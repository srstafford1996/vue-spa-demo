/*
// app/providers/auth.ts
// 
// Authenitciation provider definition. In a serious app, this is where session management and auth refreshing would go.
// Since this is a demo app, we're doing OAuth things inside the SPA...not recommended.
*/

export type AuthEvent = { type: 'login' } | { type: 'logout' }

export interface AuthProvider {
    listen(listener: (state: AuthEvent) => void): () => void
    startLogin(): Promise<void>
    startLogout(): Promise<void>
    isAuthenticated(): boolean
    getSessionToken(): null | string
    handleTwitterCallback(url: URL): Promise<boolean>
}

export function createAuthProvider(): AuthProvider {
    let sessionToken: null | string = sessionStorage.getItem('session_token')
    let authComplete: null | boolean;
    if (sessionStorage.getItem('is_authorized') === 'true') {
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

        listen(listener: (state: AuthEvent) => void) {
            listeners.add(listener)
            return () => listeners.delete(listener)
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
            sessionStorage.setItem('session_token', sessionKey)

            window.location.assign(authUrl)
        },

        async startLogout() {
            // This is where I would hit a logout endpoint in a real application
            // but this is a demo so let's just clear the session storage
            sessionStorage.clear()
        },

        async handleTwitterCallback(url: URL) {
            try {
                const code = url.searchParams.get('code')
                if (!code) {
                    // More error handling
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
                sessionStorage.setItem('is_authorized', 'true')

                notifyListeners({ type: 'login' })
                return true
            } catch (err: unknown) {
                console.log('Error processing callback', err)
                return false;
            }
        },

        getSessionToken() {
            return sessionToken
        }
   }

}