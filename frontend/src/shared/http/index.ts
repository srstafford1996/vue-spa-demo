/*
// shared/http/index.ts
//
// Singleton client for interacting with REST api.
// Get the instance with useHttpClient() and set the access token getter.
*/
import { APP_BASE_URL } from '../constants';
import type { HttpClient, HttpMethod, HttpRequestOptions, ApiResult } from './types';
import type { AuthProvider } from '@/app/providers/auth';

let httpClient: null | HttpClient = null
let getSessionToken: null | (() => (null | string)) = null

export function configureHttpSession(auth: AuthProvider) {
    getSessionToken = () => auth.getSessionToken()
}

export function useHttpClient(): HttpClient {
    if (!!httpClient) {
        return httpClient
    }

    return {
        async request <T>(method: HttpMethod, path: string, options?: HttpRequestOptions): Promise<ApiResult<T>> {
            const url = new URL(path, APP_BASE_URL)

            if (options?.query) {
                for (const [key, value] of Object.entries(options.query)) {
                    url.searchParams.set(key, String(value))
                }
            }

            const headers: Record<string, string> = {
            ...(options?.headers ?? {}),
            }

            if (!!getSessionToken) {
                const sessionToken = getSessionToken()
                headers['session_key'] = sessionToken ??  ''
            }

            let body: BodyInit | undefined = undefined
            if (options?.body !== undefined) {
                headers['Content-Type'] = 'application/json'
                body = JSON.stringify(options.body)
            }

            try {
                const res = await fetch(url.toString(), { method, headers, body })
                const payload = await res.json()

                if (!res.ok) {
                    return {
                        success: false,
                        status: res.status,
                        message: payload['error']
                    }
                }

                return {
                    success: true,
                    data: payload,
                    status: res.status
                }
            } catch (e) {
                const message = e instanceof Error ? e.message : `Unknown error during HTTP request to ${path}`
                return { success: false, status: 0, message: message }
            }
        }
    }
}
