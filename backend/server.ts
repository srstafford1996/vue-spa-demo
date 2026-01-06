import path from "node:path";
import fs from "node:fs";

import express, { type Request,type Response, type NextFunction } from "express";
import dotenv from "dotenv";
import { Client, auth } from "twitter-api-sdk";
import { OAuth2User } from "twitter-api-sdk/dist/OAuth2User.js";

dotenv.config();

const CACHE_FILE = path.join(import.meta.dirname, 'cache.json');

type TimelineCache = Record<string, {
    user: any;
    tweets: any;
    cachedAt: number;
}>;

function readCache(): TimelineCache {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const data = fs.readFileSync(CACHE_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('Failed to read cache:', err);
    }
    return {};
}

function writeCache(cache: TimelineCache): void {
    try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    } catch (err) {
        console.error('Failed to write cache:', err);
    }
}

const BUILD_DIR = path.join(import.meta.dirname, '..', 'frontend', 'dist')
const PORT = Number(process.env.PORT ?? 3000);

const X_CLIENT_ID = process.env.X_CLIENT_ID;
const X_CLIENT_SECRET = process.env.X_CLIENT_SECRET;
const X_CALLBACK_URL = process.env.X_CALLBACK_URL;

if (!X_CLIENT_ID || !X_CLIENT_SECRET || !X_CALLBACK_URL ) {
    throw new Error(
        "Missing env vars. Required: X_CLIENT_ID, X_CLIENT_SECRET, X_CALLBACK_URL, SESSION_SECRET"
    );
}

type SessionData = {
    state: string,
    client: null | auth.OAuth2User
    cache: Map<string, any>
    userId?: string
    user?: any
};

const sessionsMap = new Map<string, SessionData>();

function newOAuthClient(): auth.OAuth2User {
    return new auth.OAuth2User({
        client_id: X_CLIENT_ID!,
        client_secret: X_CLIENT_SECRET!,
        callback: X_CALLBACK_URL!,
        scopes: ["users.read", "tweet.read", "tweet.write", "offline.access"],
    });
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
    const sessionKey = req.get('session_key') as string
    
    const session = sessionsMap.get(sessionKey)
    if (!session) {
        return res.status(401).json({
            error: `No session found for key: ${sessionKey}. Try logging in.`
        })
    }

    next()
}

const router = express.Router()

router.get('/login/url', async function(req, res) {
    const state = crypto.randomUUID()
    const sessionKey = crypto.randomUUID()
    
    const oauthClient = newOAuthClient() 
    const authUrl = oauthClient.generateAuthURL({
        state,
        code_challenge_method: 's256'
    })

    sessionsMap.set(sessionKey, { state, client: oauthClient, cache: new Map<string, any>() })

    res.json({
        authUrl,
        sessionKey
    })
})

router.post('/login', async function(req, res) {
    console.log(req.body)
    const code = req.body.code
    const sessionKey = req.body.sessionKey

    if (!code || !sessionKey) {
        return res.status(400).json( { error: 'Missing code or session key' } )
    }

    const session = sessionsMap.get(sessionKey)
    if (!session) {
        return res.status(400).json( { errror: 'Invalid session key' } )
    }

    await session.client?.requestAccessToken(code)

    // Fetch and cache user ID after login
    const client = new Client(session.client!)
    const user = await client.users.findMyUser({
        'user.fields': ['name', 'username', 'profile_image_url', 'public_metrics']
    })
    if (user.data?.id) {
        session.userId = user.data.id
        session.user = user.data
    }

    res.json({
        message: 'Auth success'
    })
})

router.get('/timeline', requireAuth, async function(req, res) {
    try {
        const session = sessionsMap.get(req.get('session_key') as string)!

        // Use cached user ID from session
        const userId = session.userId
        if (!userId) {
            return res.status(500).json({ error: 'User ID not found in session. Try logging in again.' })
        }

        // Check file cache by user ID
        const cache = readCache()
        if (cache[userId]) {
            console.log(`Cache hit for user ${userId}`)
            return res.json(cache[userId])
        }

        console.log(`Cache miss for user ${userId}, fetching from API...`)
        const client = new Client(session.client!)
        const userTweets = await client.tweets.usersIdTweets(userId, {
            max_results: 5,
            exclude: ['replies', 'retweets'],
            'tweet.fields': ['created_at', 'text', 'attachments', 'public_metrics'],
            expansions: ['attachments.media_keys'],
            'media.fields': ['url', 'preview_image_url', 'height', 'width']
        })

        const response = { user: session.user, tweets: userTweets, cachedAt: Date.now() }

        // Save to file cache
        cache[userId] = response
        writeCache(cache)

        return res.json(response)
    } catch (err: any) {
        console.error(err)
        res.status(500).json( {error: 'Read tweets failed', message: String(err?.message ?? err)} )
    }
})

router.post('/tweet', requireAuth, async function(req, res) {
    try {
        const { text } = req.body as { text?: string }
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Malformed request body' })
        }

        const oauthClient = sessionsMap.get(req.headers['session_key'] as string)!.client as OAuth2User
        const client = new Client(oauthClient)

        const result = await client.tweets.createTweet({ text })
        res.json(result)

    } catch (err: any) {
        console.error(err)
        res.status(500).json({ error: 'Tweet post failed', message: String(err?.message ?? err)})
    }
})

const app = express()
app.use(express.static(BUILD_DIR))
app.use(express.json())
app.use('/api', router)

app.all('/{*any}', async function(req, res) {
    res.sendFile(path.join(BUILD_DIR, 'index.html'))
})


app.listen(PORT, () => {
    console.log(`Server running: http://127.0.0.1:${PORT}`)
});
