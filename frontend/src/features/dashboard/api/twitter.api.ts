/*
// features/dashboard/api/twitter.api.ts
//
// small file, purely to define our API routes
*/

import { useHttpClient } from '@/shared/http';
import { type ApiResult } from '@/shared/http/types';
import { type RawTwitterTimeline } from './twitter.types';

const httpClient = useHttpClient()

export async function getTimeline(): Promise<ApiResult<RawTwitterTimeline>> {
    return httpClient.request<RawTwitterTimeline>('GET', '/api/timeline')
}

export async function postTweet(text: string): Promise<ApiResult<any>> {
    // Backend takes request body of { text: string }
    return httpClient.request<any>('POST', '/api/tweet', {
        body: { text }
    })
}