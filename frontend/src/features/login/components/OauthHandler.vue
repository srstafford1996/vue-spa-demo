<script setup lang="ts">

    import { inject, onMounted } from 'vue';
    import { useRouter } from 'vue-router';

    import { type AuthProvider } from '@/app/providers/auth';
    
    const authProvider = inject<AuthProvider>('auth')!
    const router = useRouter()
        
    onMounted(() => {
        async function handle() {
            const success = await authProvider.handleTwitterCallback(new URL(window.location.href))

            if (success) {
                router.push({ name: 'dashboard.main' })
            } else {
                router.push({ name: 'login.main' })
            }
        }

        handle()
    })

</script>

<template>

<span>
    Logging in...
</span>

</template>