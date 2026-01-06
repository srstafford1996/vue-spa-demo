<!-- features/dashboard/pages/TwitterDashboard.vue -->
<script setup lang="ts">
    import TimelineComponent from '../components/TimelineComponent.vue';
    import { useTwitterStore } from '../stores/twitter.store';

    const store = useTwitterStore()
    store.loadTimeline()

</script>

<template>
    <TimelineComponent />
</template>