<!-- app/App.vue  -->
<script lang="ts">
    import DashboardLayout from "@/layouts/DashboardLayout.vue"
    import LoginLayout from "@/layouts/LoginLayout.vue"

    export default {
        computed: {
            layout() {
                const name = this.$route.meta.layout as string | undefined

                if (name === 'dashboard') {
                    return DashboardLayout
                }

                return LoginLayout
            }
        }
    }

</script>

<template>
    <component :is="layout">
        <RouterView />
    </component>

</template>