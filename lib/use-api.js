'use client'

import { useCallback, useEffect, useState } from 'react'
import { toApiError } from '@/lib/api-error'

// ─────────────────────────────────────────────────────────────────────────────
// Ma'lumot olishning yagona hooki. Barcha sahifalar shu orqali backendga
// murojaat qiladi — loading/error/qayta yuklash mantiqi bir joyda turadi.
//
//   const fetcher = useCallback(() => site.performers(params), [paramsKey])
//   const { data, loading, error, reload } = useApi(fetcher)
//
// `fetcher` `useCallback` bilan memolangan bo'lishi shart — u effekt
// bog'liqligi bo'lib, o'zgarganda yangi so'rov ketadi. Eski javob yangisidan
// keyin kelib qolmasligi uchun effekt tozalanishida bekor qilinadi.
// ─────────────────────────────────────────────────────────────────────────────
export function useApi(fetcher, { enabled = true, initial = null } = {}) {
    const [state, setState] = useState({ data: initial, loading: enabled, error: null })
    const [tick, setTick] = useState(0)

    useEffect(() => {
        if (!enabled) return undefined

        let cancelled = false

        async function load() {
            setState((s) => ({ ...s, loading: true, error: null }))
            try {
                const data = await fetcher()
                if (!cancelled) setState({ data, loading: false, error: null })
            } catch (err) {
                if (!cancelled) setState({ data: initial, loading: false, error: toApiError(err) })
            }
        }

        load()
        return () => {
            cancelled = true
        }
    }, [fetcher, enabled, initial, tick])

    const reload = useCallback(() => setTick((t) => t + 1), [])

    return { ...state, reload }
}

// Foydalanuvchi harakatlari uchun (POST/PATCH/DELETE): loading + xato bilan.
// `run` chaqirilganda `action` shu paytdagi qiymati bilan ishlaydi.
export function useAction(action) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const run = useCallback(
        async (...args) => {
            setLoading(true)
            setError(null)
            try {
                const data = await action(...args)
                return { success: true, data }
            } catch (err) {
                const apiError = toApiError(err)
                setError(apiError)
                return { success: false, error: apiError }
            } finally {
                setLoading(false)
            }
        },
        [action],
    )

    return { run, loading, error, setError }
}
