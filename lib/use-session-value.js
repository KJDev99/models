'use client'

import { useCallback, useSyncExternalStore } from 'react'

// sessionStorage'dan qiymat o'qish (auth oqimidagi telefon/pochta kabi).
// useSyncExternalStore ishlatilgan: effekt ichida setState chaqirilmaydi,
// SSR'da esa bo'sh qiymat qaytadi va gidratatsiya buzilmaydi.
export function useSessionValue(key, fallback = '') {
    const subscribe = useCallback((onChange) => {
        window.addEventListener('storage', onChange)
        return () => window.removeEventListener('storage', onChange)
    }, [])

    const getSnapshot = useCallback(
        () => sessionStorage.getItem(key) ?? fallback,
        [key, fallback]
    )

    const getServerSnapshot = useCallback(() => fallback, [fallback])

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
