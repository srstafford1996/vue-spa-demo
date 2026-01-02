import { type RouteRecordRaw } from "vue-router";

const dashboardRoutes : RouteRecordRaw[] = [
    {
        path: '/',
        name: 'dashboard.main',
        component: () => import('./pages/DashboardPage.vue'),
        meta: { requiresAuth: true }
    }
]

export {
    dashboardRoutes
}