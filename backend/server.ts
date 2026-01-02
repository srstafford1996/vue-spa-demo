import path from "node:path";

import express, { type Request,type Response, type NextFunction } from "express";
import dotenv from "dotenv";
import { Client, auth } from "twitter-api-sdk";
import { OAuth2User } from "twitter-api-sdk/dist/OAuth2User.js";

dotenv.config();

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
};

const sessionsMap = new Map<string, SessionData>();

function newOAuthClient(): auth.OAuth2User {
    return new auth.OAuth2User({
        client_id: X_CLIENT_ID!,
        client_secret: X_CLIENT_SECRET!,
        callback: X_CALLBACK_URL!,
        // Scopes needed for: read user, read tweets, write tweets, and refresh tokens
        scopes: ["users.read", "tweet.read", "tweet.write", "offline.access"],
    });
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
    const sessionKey = req.headers['session_key'] as string
    
    const session = sessionsMap.get(sessionKey)
    if (!session) {
        return res.status(401).json({
            error: 'No session found for key. Try logging in.'
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

    sessionsMap.set(sessionKey, { state, client: oauthClient })

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

    res.json({ 
        message: 'Auth success'
    })
})

router.get('/timeline', requireAuth, async function(req, res) {
    try {
        const max = Math.min(Number(req.query.max ?? 5), 100)
        const oauthClient = sessionsMap.get(req.headers['session_key'] as string)!.client as OAuth2User
        
        const client = new Client(oauthClient)
        const user = await client.users.findMyUser()

        const userId = user.data?.id
        if (!userId) {
            return res.status(500).json({ error: 'Unable to find user ID' })
        }

        const userTweets = await client.tweets.usersIdTweets(userId, {
            max_results: max,
            'tweet.fields': ['created_at', 'text']
        })

        res.json({ user: user.data, tweets: userTweets })
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
