/*
// app/store/auth.store.ts
//
// App-wide store for reacting to authentication status.
// Do not use as security feature, just for frontend state management.
*/

import { ref, inject } from 'vue'
import { defineStore } from 'pinia'
import { type AuthProvider, type AuthEvent } from '@/app/providers/auth'

export const useAuthStore = defineStore('auth', () => {
    const authProvider = inject<AuthProvider>('auth')!

    const isAuthenticated = ref<Boolean>(authProvider.isAuthenticated())
    authProvider.listen( (e: AuthEvent ) => {
        if (e.type == 'login') {
            isAuthenticated.value = true;
            return
        }

        if (e.type == 'logout') {
            isAuthenticated.value = false;
            return
        }
    })

    return {
        isAuthenticated,
        logout() {
            authProvider.startLogout()
        }
    }
})