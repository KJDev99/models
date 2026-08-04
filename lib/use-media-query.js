'use client'

import { useCallback, useSyncExternalStore } from 'react'

// Figma'da ikkita breakpoint bor: 1920 (desktop) va 320 (mobile).
// Kod tomonda Tailwind `lg:` (1024px) chegara sifatida ishlatiladi.
//
// useSyncExternalStore — brauzer holatini o'qishning to'g'ri yo'li:
// effekt ichida setState qilish shart emas va SSR'da server qiymati beriladi.
export function useMediaQuery(query) {
    const subscribe = useCallback(
        (onChange) => {
            const mql = window.matchMedia(query)
            mql.addEventListener('change', onChange)
            return () => mql.removeEventListener('change', onChange)
        },
        [query]
    )

    const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

    // Serverda hech narsa mos kelmaydi — gidratatsiyadan keyin aniqlanadi.
    const getServerSnapshot = useCallback(() => false, [])

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useIsMobile() {
    return useMediaQuery('(max-width: 1023px)')
}
