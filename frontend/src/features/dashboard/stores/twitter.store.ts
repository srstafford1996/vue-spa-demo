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

    // Tracking new tweets made client-side
    // non-reactive because it will be apart of the timeline
    let clientTweets : RawTwitterPost[] = []

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

            
            const clientTweetStrings = localStorage.getItem('client_tweets')
            if (clientTweetStrings != null) {
                clientTweets = JSON.parse(clientTweetStrings)
                tl.tweets = [...clientTweets, ...tl.tweets]
            }

            timeline.value = tl
        } else {
            // Erorr handling stuff
        }
    }

    function saveNewTweet(text: string) {
        const newTweet: RawTwitterPost = {
            text,
            id: '',
            created_at: new Date().toString(),
            edit_history_tweet_ids: [0],
            public_metrics: {
                retweet_count: 0,
                reply_count: 0,
                like_count: 0,
                quote_count: 0,
                bookmark_count: 0,
                impression_count: 0
            }
        }

        clientTweets.unshift(newTweet)
        timeline.value!.tweets.unshift(newTweet)

        localStorage.setItem('client_tweets', JSON.stringify(clientTweets))
    }

    return {
        userInfo,
        timeline,
        loadTimeline,
        saveNewTweet
    }
})