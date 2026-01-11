<!-- features/dashboard/components/TwitterTimleine.vue 
 --
 -- Dashboard component for timeline view
-->
<script lang="ts">
    import { mapStores } from 'pinia';
    import { useTwitterStore } from '../../stores/twitter.store';
    import { parseUINumber, parseUIDate } from '@/shared/util';


    export default {
        computed: {
            ...mapStores(useTwitterStore)
        },
        methods: {
            parseUINumber,
            parseUIDate
        }
    }
</script>

<template>
    <div v-if="twitterStore.timeline != null">
        <ul class="twitter-timeline">
            <li class="twitter-post" v-for="tweet in twitterStore.timeline.tweets">
                <div class="post-pfp">
                    <img v-bind:src="twitterStore.userInfo?.profile_image_url" />
                </div>
                <div class="post-content">
                    <div class="post-header">
                        <span>{{ twitterStore.userInfo?.name }}</span>
                        <span class="post-header-subinfo">@{{ twitterStore.userInfo?.username }}</span>
                        <span class="post-header-subinfo"> · </span>
                        <span class="post-header-subinfo">{{ parseUIDate(tweet.created_at) }}</span>
                    </div>
                    <div class="post-text">
                        {{ tweet.text }}
                    </div>
                    <div class="post-metrics">
                        <span>{{ parseUINumber(tweet.public_metrics.reply_count, ['Reply', 'Replies']) }}</span>
                        <span>{{ parseUINumber(tweet.public_metrics.retweet_count, ['Retweet', 'Retweets']) }}</span>
                        <span>{{ parseUINumber(tweet.public_metrics.like_count, ['Like', 'Likes']) }}</span>
                        <span>{{ parseUINumber(tweet.public_metrics.impression_count, ['View', 'Views']) }}</span>
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
        border-color: rgba(0, 0, 0, .4);
    }

    .twitter-post {
        display: flex;
        flex-direction: row;

        padding: 8px;
        width: 100%;

        border-bottom: 1px solid rgba(0, 0, 0, .4);
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