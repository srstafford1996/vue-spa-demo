<!-- features/dashboard/pages/TwitterDashboard.vue -->
<script setup lang="ts">
    import { RouterView } from 'vue-router';
    import { useTwitterStore } from '../stores/twitter.store';

    
    const store = useTwitterStore()
    store.loadTimeline()
    
</script>

<template>
    <div class="dashboard">
        <nav class="dashboard-nav">
           <RouterLink to="/" exact-active-class="active">Timeline</RouterLink>
           <RouterLink to="/profile" exact-active-class="active">Profile</RouterLink>
        </nav>

        <RouterView />
    </div>
</template>

<style scoped lang="css">
    .dashboard-nav {
        margin: 50px auto 10px;

        width: 100%;
        max-width: 640px; 

        display: flex;
        flex-direction: row;

        border-width: 1px 0px 1px 1px;
        border-style: solid;
        border-color: var(--default-faded);
    }
    
    .dashboard-nav > * {
        height: 46px;
        
        text-align: center;
        align-items: center;

        flex-grow: 1;
        font-size: 28px;

        border-right: 1px solid var(--default-faded);
    }

    .dashboard-nav > *:hover, .dashboard-nav > .active {
        background-color: var(--primary-faded);
    }

</style>