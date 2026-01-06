<!-- app/App.vue  -->
<script setup lang="ts">
    import { computed } from "vue"
    import { useRoute } from "vue-router"

    import DashboardLayout from "@/layouts/DashboardLayout.vue"
    import LoginLayout from "@/layouts/LoginLayout.vue"

    const route = useRoute()

    const layout = computed(() => {
        const name = route.meta.layout as string | undefined

        if (name === 'dashboard') {
            return DashboardLayout
        }

        return LoginLayout
    })

</script>

<template>
    <component :is="layout">
        <RouterView />
    </component>

</template>