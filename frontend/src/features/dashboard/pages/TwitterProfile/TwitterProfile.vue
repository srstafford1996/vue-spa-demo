<!-- features/dashboard/components/ProfileComponent.vue -->
<script setup lang="ts">
    import { useTwitterStore } from '../../stores/twitter.store';
    import { parseUInumber } from '@/shared/util';

    const store = useTwitterStore()
    
    if (!store.timeline) {
        store.loadTimeline()
    }

</script>

<template>
    <div class="profile-view">
        <div class="profile-header">
            <div class="pfp-container">
                <img :src="store.userInfo?.profile_image_url" />
            </div>
            <h1>{{ store.userInfo?.name }}</h1>
            <span>@{{ store.userInfo?.username }}</span>
        </div>
        <div class="profile-metrics">
            <div class="profile-metric">
                <h2>{{ parseUInumber(store.userInfo?.public_metrics.following_count) }}</h2> <span>Following</span>
            </div>
            <div class="profile-metric">
                <h2>{{ parseUInumber(store.userInfo?.public_metrics.followers_count) }}</h2> <span>Followers</span>
            </div>
            <div class="profile-metric">
                <h2>{{ parseUInumber(store.userInfo?.public_metrics.tweet_count) }}</h2> <span>Tweets</span>
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