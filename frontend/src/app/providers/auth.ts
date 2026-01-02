export type AuthEvent = { type: 'login' } | { type: 'logout' }

export interface AuthProvider {
    isAuthenticated(): boolean

    startLogin(): Promise<void>

    handleTwitterCallback(url: URL): Promise<boolean>

    listen(listener: (state: AuthEvent) => void): () => void
}

export function createAuthProvider(): AuthProvider {
    let sessionToken: null | string = localStorage.getItem('session_token')
    let authComplete: null | boolean;
    if (localStorage.getItem('is_authorized') === 'true') {
        authComplete = true
    }

    // Event listeners
    const listeners = new Set<(e: AuthEvent) => void>()
    function notifyListeners(event: AuthEvent) {
        listeners.forEach((cb) => cb(event))
    }

    return {
        isAuthenticated() {
            console.log(!!sessionToken && !!authComplete)
            return !!sessionToken && !!authComplete
        },

        async startLogin() {
            const res = await fetch('/api/login/url')
            if (res.status != 200) {
                // This is where I'd put the error handles
                // if it wasn't 12:30 AM
                const errorBody = await res.json()
                console.log(errorBody)
                return
            }

            const { authUrl, sessionKey } = await res.json() as { authUrl: string; sessionKey: string }

            sessionToken = sessionKey
            localStorage.setItem('session_token', sessionKey)

            window.location.assign(authUrl)
        },

        async handleTwitterCallback(url: URL) {
            try {
                const code = url.searchParams.get('code')
                if (!code) {
                    // More error handling
                    // probably a redirect
                    return false
                }
                console.log(JSON.stringify({
                    code: code,
                    sessionKey: sessionToken
                }))
                const res = await fetch('/api/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        code: code,
                        sessionKey: sessionToken
                    })
                })

                if (res.status != 200) {
                    // This is where I'd put the error handles
                    // if it wasn't 12:30 AM
                    const errorBody = await res.json()
                    console.log(errorBody)
                    return false
                }

                authComplete = true
                localStorage.setItem('is_authorized', 'true')

                notifyListeners({ type: 'login' })
                return true
            } catch (err: unknown) {
                console.log('Error processing callback', err)
                return false;
            }
        },

        listen(listener: (state: AuthEvent) => void) {
            listeners.add(listener)
            return () => listeners.delete(listener)
        }
   }

}