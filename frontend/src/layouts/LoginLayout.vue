<!-- layouts/LoginLayout.vue -->
<template>
    <div class="container">
        <div class="brand">
            <img src="/x-logo-black.jpg" />
            <span class="brand-name">Poster</span>
        </div> 
        <div class="login-ui">
            <slot />
        </div>
    </div>
</template>

<style lang="css" scoped>
    .container {
        height: 100%;
        width: 100%;

        background-color: var(--default-black);
        color: var(--default-white);

        display: flex;
        flex-direction: row;
    }

    .container > * {
        flex-grow: 1;
    }

    .brand {
        display: flex;
        flex-direction: row;

        align-items: center;
        justify-content: center;
    }

    .brand > img {
        height: 50%;
        max-height: 380px;
    }
    
    .brand > span {
        font-size: 72px;
        font-weight: 800;
        line-height: 380px;
    }

    .login-ui {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

</style>