/*
// features/dashboard/index.ts
//
// Expose dashboard routes to the app
*/
import { type RouteRecordRaw } from "vue-router";

import Dashboard from './pages/Dashboard.vue'
import TimelineComponent from './pages/TwitterTimeline/TwitterTimeline.vue';
import ProfileComponent from './pages/TwitterProfile/TwitterProfile.vue';

const dashboardRoutes : RouteRecordRaw[] = [
    {
        path: '/',
        component: Dashboard,
        meta: { requiresAuth: true, layout: 'dashboard' },
        children: [
            {
                path: '',
                name: 'dashboard.main',
                component: TimelineComponent
            },
            {
                path: '/profile',
                name: 'dashboard.profile',
                component: ProfileComponent
            }
        ]
    }
]

export {
    dashboardRoutes
}