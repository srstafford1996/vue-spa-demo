<!-- src/layouts/DashboardLayout.vue -->
<script setup lang="ts">

</script>

<template>
    <div class="layout-container">
        <header>
            <div class="header-container">
                <div class="header-title">
                    <img src="/x-logo-black.jpg" />
                    <h1>Poster</h1>
                </div>
                <div class="header-nav">
                    <button class="logout-button">Logout</button>
                </div>
            </div>
        </header>
        <main>
            <slot />
        </main>

    </div>
</template>

<style scoped lang="css">

    .layout-container {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
    }

    header {
        width: 100%;
        height: 102px;

        color: var(--default-white);
        background-color: var(--default-black);

    }

    .header-container {
        height: 100%;
        width: 100%;

        max-width: 1280px;
        margin: 0 auto;

        display: flex;
        flex-direction: row;
        justify-content: space-between;

        align-items: center;
    }

    .header-title {
        display: flex;
        flex-direction: row;
        height: 100%;
    }

    .header-title > img {
        height: 100%;
    }

    .header-title > h1 {
        font-size: 64px;
    }

    .header-nav {
        height: 100%;
    }

    .logout-button {
        height: 100%;
        padding: 0 30px;
        font-size: 32px;
    }

    .logout-button:hover {
        background-color: var(--primary-faded);
    }

</style>