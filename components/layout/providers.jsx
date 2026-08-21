'use client'

import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/store/useAuthStore'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import { isAuthenticated } from '@/lib/auth'
import AuthModal from '@/components/auth/auth-modal/auth-modal'
import BlockedModal from '@/components/auth/blocked-modal'

// Ilova ochilganda sessiya va избранное localStorage'dan ko'tariladi,
// so'ng token bo'lsa `GET /auth/me` bilan foydalanuvchi yangilanadi —
// status (`pending_review` / `blocked`) o'zgargan bo'lishi mumkin.
export default function Providers({ children }) {
    const hydrateAuth = useAuthStore((s) => s.hydrate)
    const fetchMe = useAuthStore((s) => s.fetchMe)
    const hydrateFavorites = useFavoritesStore((s) => s.hydrate)

    useEffect(() => {
        hydrateAuth()
        hydrateFavorites()
        if (isAuthenticated()) fetchMe()

        function onAuthChange() {
            hydrateAuth()
        }
        window.addEventListener('auth-changed', onAuthChange)
        return () => window.removeEventListener('auth-changed', onAuthChange)
    }, [hydrateAuth, hydrateFavorites, fetchMe])

    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: { borderRadius: '12px', background: '#222222', color: '#ffffff' },
                }}
            />
            {children}

            {/* Авторизация oynasi — butun sayt uchun bitta (Figma 75:171 …) */}
            <AuthModal />

            {/* «Аккаунт заблокирован» — istalgan 403 ACCOUNT_BLOCKED'da ochiladi */}
            <BlockedModal />
        </>
    )
}
