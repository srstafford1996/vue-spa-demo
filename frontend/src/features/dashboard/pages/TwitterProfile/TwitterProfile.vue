<!-- features/dashboard/components/ProfileComponent.vue -->
<script lang="ts">
    import { mapStores } from 'pinia';

    import { useTwitterStore } from '../../stores/twitter.store';
    import { parseUINumber } from '@/shared/util';

    export default {
        computed: {
            ...mapStores(useTwitterStore)
        },
        methods: {
            parseUINumber
        }
    }

</script>

<template>
    <div class="profile-view">
        <div class="profile-header">
            <div class="pfp-container">
                <img :src="twitterStore.userInfo?.profile_image_url" />
            </div>
            <h1>{{ twitterStore.userInfo?.name }}</h1>
            <span>@{{ twitterStore.userInfo?.username }}</span>
        </div>
        <div class="profile-metrics">
            <div class="profile-metric">
                <h2>{{ parseUINumber(twitterStore.userInfo?.public_metrics.following_count) }}</h2> <span>Following</span>
            </div>
            <div class="profile-metric">
                <h2>{{ parseUINumber(twitterStore.userInfo?.public_metrics.followers_count) }}</h2> <span>Followers</span>
            </div>
            <div class="profile-metric">
                <h2>{{ parseUINumber(twitterStore.userInfo?.public_metrics.tweet_count) }}</h2> <span>Tweets</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="css">
    .profile-view {
        margin: 0 auto;
        padding: 10px;

        width: 100%;
        max-width: 640px;

        border: 1px solid rgba(0, 0, 0, 0.4);
    }

    .profile-header {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .pfp-container > img {
        height: 135px;
        border-radius: 50%;
    }

    .profile-metrics {
        margin-top: 10px;
        display: flex;
        flex-direction: row;

        align-items: baseline;
        gap: 10px;
    }

    .profile-metric {
        display: flex;
        flex-direction: row;
        align-items: center;
        
        gap: 2px;
    }

    .profile-metric > h2 {
        font-size: 20px;
    }
</style>