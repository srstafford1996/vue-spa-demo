<!-- features/login/pages/LoginPage.vue -->
<script lang="ts">
    import { type AuthProvider } from '@/app/providers/auth'

    export default {
        inject: { 
            authProvider: 'auth'
        },
        methods: {
            beginLogin() {
                (this.authProvider as AuthProvider).startLogin()
            }
        }
    }
</script>

<template>
    <div class="login-page">
        <h1>Sign in to X Poster</h1>        
        <button @click="beginLogin">Login with Twitter</button>
    </div>
</template>

<style scoped lang="css">

    .login-page {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .login-page > button {
        height: 44px;
        width: 100%;
        max-width: 300px;

        background-color: var(--default-white);
        color: var(--default-black);
        
        border-radius: 10px;
    }
</style>