/*
// shared/http/types.ts
//
// Type exports for HTTP client
*/
export type HttpMethod = 'GET' | 'POST'

export type ApiResult<T> = | { success: true; data: T; status: number; } | { success: false; status: number; message?: null | string; }

export type HttpClientOptions = {
    getSessionToken: () => (null | string);
}

export type HttpRequestOptions = {
    headers?: Record<string, string>;
    query?: Record<string, string | number | boolean>;
    body?: any;
}

export type HttpClient = {
    request: <T>(method: HttpMethod, path: string, options?: HttpRequestOptions) => Promise<ApiResult<T>>;
}

