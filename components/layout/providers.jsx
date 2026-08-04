'use client'

import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/store/useAuthStore'
import { useFavoritesStore } from '@/store/useFavoritesStore'

// Ilova ochilganda sessiya va избранное localStorage'dan ko'tariladi.
export default function Providers({ children }) {
    const hydrateAuth = useAuthStore((s) => s.hydrate)
    const hydrateFavorites = useFavoritesStore((s) => s.hydrate)

    useEffect(() => {
        hydrateAuth()
        hydrateFavorites()

        function onAuthChange() {
            hydrateAuth()
        }
        window.addEventListener('auth-changed', onAuthChange)
        return () => window.removeEventListener('auth-changed', onAuthChange)
    }, [hydrateAuth, hydrateFavorites])

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
        </>
    )
}
