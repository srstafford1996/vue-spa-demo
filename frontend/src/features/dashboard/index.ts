import { type RouteRecordRaw } from "vue-router";

const dashboardRoutes : RouteRecordRaw[] = [
    {
        path: '/',
        name: 'dashboard.main',
        component: () => import('./pages/TwitterDashboard.vue'),
        meta: { requiresAuth: true, layout: 'dashboard' }
    }
]

export {
    dashboardRoutes
}