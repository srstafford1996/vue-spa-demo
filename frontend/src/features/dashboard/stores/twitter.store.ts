/*
// features/dashboard/stores/twitter.store.ts
//
// Store declares application data used by the Twitter dashboard
*/
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getTimeline } from '../api/twitter.api'

import type { RawTwitterPost, RawTwitterMediaInfo, RawTwitterUser } from '../api/twitter.types'

export type TwitterTimeline = {
    tweets: RawTwitterPost[];
    mediaInfo: Record<string, RawTwitterMediaInfo>;
}

export const useTwitterStore = defineStore('twitter', () => {
    const userInfo = ref<RawTwitterUser | null>(null)
    const timeline = ref<TwitterTimeline | null>(null)

    // Load initial user info and timeline
    async function loadTimeline() {
        console.log("Load timeline called")
        const timelineRes = await getTimeline()

        if (timelineRes.success) {
            userInfo.value = timelineRes.data.user

            const tl: TwitterTimeline = {
                tweets: [],
                mediaInfo: {}
            }

            tl.tweets = timelineRes.data.tweets.data
            timelineRes.data.tweets.includes.media.forEach((info => {
                tl.mediaInfo[info.media_key] = info
            }))

            timeline.value = tl
        } else {
            // Erorr handling stuff
        }
    }

    return {
        userInfo,
        timeline,
        loadTimeline
    }
})