<!-- features/login/components/OauthHandler.vue -->
<script lang="ts">
    import { type AuthProvider } from '@/app/providers/auth';
    
    export default {
        inject: {
            authProvider: { from: 'auth' }
        },
        mounted() {
            const handle = async () => {
                const success = await (this.authProvider as AuthProvider).handleTwitterCallback(new URL(window.location.href))
                if (success) {
                    this.$router.push({ name: 'dashboard.main' })
                } else {
                    this.$router.push({ name: 'login.main' })
                }
            }

            handle()
        }
    }
</script>

<template>

<span>
    Logging in...
</span>

</template>