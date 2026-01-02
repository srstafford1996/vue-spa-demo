import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/app/router'

import App from './App.vue'
import  { createAuthProvider } from '@/app/providers/auth'


const app = createApp(App)

app.use(createPinia())
app.use(router)

app.provide('auth', createAuthProvider())

app.mount('#app')
