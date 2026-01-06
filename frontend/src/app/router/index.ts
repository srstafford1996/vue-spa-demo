/*
// app/router/index.ts
//
// Import routes and define global guards here. 
*/

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { loginRoutes } from '@/features/login'
import { dashboardRoutes } from '@/features/dashboard'
import { useAuthStore } from '@/app/store/auth.store'

const routes : RouteRecordRaw[] = [
    ...loginRoutes,
    ...dashboardRoutes
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to) => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated && to.meta.requiresAuth) {
        return { name: 'login.main' }
    }

    if (authStore.isAuthenticated && to.meta.isLoginPage) {
        return { name: 'dashboard.main'}
    }
})

export default router