<script setup lang="ts">
    import { inject } from 'vue'
    import { type AuthProvider } from '@/app/providers/auth'

    const authProvider = inject<AuthProvider>('auth')!

    function beginLogin() {
        authProvider.startLogin()
    }
</script>

<template>
    <span>
        Hello World, you gotta <button @click="beginLogin">log tf in</button>
    </span>
</template>