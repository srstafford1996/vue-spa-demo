/*
// app/main.ts
// 
// Declaring provideers, singletons, and mounting.
// Keep this file as simple as possible.
*/

import App from './App.vue'
import router from '@/app/router'

import './styles/variables.css'
import './styles/globals.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuthProvider } from '@/app/providers/auth'
import { configureHttpSession } from '@/shared/http'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const authProvider = createAuthProvider()
app.provide('auth', authProvider)

configureHttpSession(authProvider)

app.mount('#app')
