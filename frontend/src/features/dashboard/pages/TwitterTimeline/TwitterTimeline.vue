<!-- features/dashboard/components/TwitterTimleine.vue 
 --
 -- Dashboard component for timeline view
-->
<script setup lang="ts">
    import { ref } from 'vue'
    import { postTweet } from '../../api/twitter.api';
    import { useTwitterStore } from '../../stores/twitter.store';
    import { parseUInumber, parseUIDate } from '@/shared/util';


    const tweetText = ref<string>('')
    const store = useTwitterStore()


    async function submitTweet() {
        if (tweetText.value == '') {
            return
        }

        const res = await postTweet(tweetText.value)
        if (res.success) {
            store.saveNewTweet(tweetText.value)
            tweetText.value = ''
        }
    }
</script>

<template>
    <div v-if="store.timeline != null">
        <ul class="twitter-timeline">
            <li class="twitter-input">
                <textarea v-model="tweetText" placeholder="What's happening?" />
                <button @click="submitTweet">Send</button>
            </li>
            <li class="twitter-post" v-for="tweet in store.timeline.tweets">
                <div class="post-pfp">
                    <img v-bind:src="store.userInfo?.profile_image_url" />
                </div>
                <div class="post-content">
                    <div class="post-header">
                        <span>{{ store.userInfo?.name }}</span>
                        <span class="post-header-subinfo">@{{ store.userInfo?.username }}</span>
                        <span class="post-header-subinfo"> · </span>
                        <span class="post-header-subinfo">{{ parseUIDate(tweet.created_at) }}</span>
                    </div>
                    <div class="post-text">
                        {{ tweet.text }}
                    </div>
                    <div class="post-metrics">
                        <span>{{ parseUInumber(tweet.public_metrics.reply_count, ['Reply', 'Replies']) }}</span>
                        <span>{{ parseUInumber(tweet.public_metrics.retweet_count, ['Retweet', 'Retweets']) }}</span>
                        <span>{{ parseUInumber(tweet.public_metrics.like_count, ['Like', 'Likes']) }}</span>
                        <span>{{ parseUInumber(tweet.public_metrics.impression_count, ['View', 'Views']) }}</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<style lang="css" scoped>
    .twitter-timeline {
        display: flex;
        flex-direction: column;

        max-width: 640px;
        margin: 0 auto;
        
        border-width: 1px 1px 0px 1px;
        border-style: solid;
        border-color: var(--border-faded);
    }



    .twitter-input {
        display: flex;
        flex-direction: column;
        gap: 8px;

        padding: 8px;
        width: 100%;
        border-bottom: 1px solid var(--border-faded);
    }

    .twitter-input > textarea {
        padding: 8px;
        min-height: 100px;
        resize: none;
    }

    .twitter-input > button {
        padding: 5px 10px;
        width: 100%;
        border: 1px solid var(--default-black);
        border-radius: 4px;
    }

    .twitter-post {
        display: flex;
        flex-direction: row;

        padding: 8px;
        width: 100%;

        border-bottom: 1px solid var(--border-faded);
    }

    .post-pfp > img {
        border-radius: 50%;
    }

    .post-content {
        padding-left: 9px;
        width: 100%;
    }

    .post-content > * {
        width: 100%;
    }

    .post-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
    }
    
    .post-header-subinfo {
        font-size: 15px;
    }
    .post-text {
        padding: 8px 0px;
    }

    .post-metrics {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    

</style>