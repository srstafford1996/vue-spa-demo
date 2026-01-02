import type { RouteRecordRaw } from 'vue-router'

const loginRoutes : RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login.main',
        component: () => import('./pages/LoginPage.vue'),
        meta: { requiresAuth: false, isLoginPage: true }
    },
    {
        path: '/login/callback',
        name: 'login.callback',
        component: () => import('./components/OauthHandler.vue'),
        meta: { requiresAuth: false, isLoginPage: true }
    }
]

export {
    loginRoutes
}