/*
// features/login/index.ts
//
// Expose login routes to the app
*/

import type { RouteRecordRaw } from 'vue-router'

const loginRoutes : RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login.main',
        component: () => import('./pages/LoginPage.vue'),
        meta: { requiresAuth: false, isLoginPage: true, layout: 'login' }
    },
    {
        path: '/login/callback',
        name: 'login.callback',
        component: () => import('./components/OauthHandler.vue'),
        meta: { requiresAuth: false, isLoginPage: true, layout: 'login' }
    }
]

export {
    loginRoutes
}