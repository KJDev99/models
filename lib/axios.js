import axios from 'axios'
import {
    AUTH_BLOCKED_EVENT,
    clearSession,
    getAccessToken,
    getRefreshToken,
    setTokens,
} from '@/lib/auth'
import { ERROR_CODES, toApiError } from '@/lib/api-error'

// ─────────────────────────────────────────────────────────────────────────────
// Backend har doim `{ success, data }` qaytaradi (backend/auth.md). Interceptor
// `response.data` ni ichki `data` bilan almashtiradi, shuning uchun chaqiruv
// joyida `res.data` — bevosita foydali yuk bo'ladi.
//
// Xatolar `err.api = { code, message, details, status, fields }` ga keltiriladi.
// 401 kelganda refresh token bilan bir marta yangilanadi va so'rov takrorlanadi;
// bir vaqtda ketgan so'rovlar navbatda kutadi (bitta refresh, rotation sababli).
// ─────────────────────────────────────────────────────────────────────────────

// Brauzerda nisbiy yo'l ishlatiladi (`/api/v1`) — so'rov Next serveri orqali
// uzatiladi va CORS kerak bo'lmaydi. Serverda esa nisbiy yo'l ishlamaydi,
// shuning uchun backendning mutlaq manzili qo'shiladi (generateMetadata,
// server komponentlar).
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1'
const ORIGIN = process.env.API_ORIGIN || process.env.NEXT_PUBLIC_API_ORIGIN || ''
const BASE_URL =
    typeof window === 'undefined' && RAW_BASE.startsWith('/') ? `${ORIGIN}${RAW_BASE}` : RAW_BASE

export const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
})

export const apiToken = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
})

// Refresh uchun alohida, interceptor'siz nusxa — aks holda halqa hosil bo'ladi.
const refreshClient = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
})

function unwrap(response) {
    const body = response.data
    if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
        response.data = body.data
    }
    return response
}

function notifyBlocked(apiError) {
    if (typeof window === 'undefined') return
    window.dispatchEvent(
        new CustomEvent(AUTH_BLOCKED_EVENT, { detail: apiError }),
    )
}

function rejectWith(error) {
    const apiError = toApiError(error)
    error.api = apiError
    if (apiError.code === ERROR_CODES.ACCOUNT_BLOCKED) notifyBlocked(apiError)
    return Promise.reject(error)
}

api.interceptors.response.use(unwrap, rejectWith)

apiToken.interceptors.request.use((config) => {
    const token = getAccessToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// ── Token yangilash navbati ─────────────────────────────────────────────────
let refreshing = null

async function refreshTokens() {
    const refresh = getRefreshToken()
    if (!refresh) return null
    try {
        const res = await refreshClient.post('/auth/refresh', { refresh_token: refresh })
        const pair = res.data?.data || res.data
        if (!pair?.access_token) return null
        // Eski refresh endi yaroqsiz (rotation) — yangi juftlikni saqlaymiz.
        setTokens(pair)
        return pair.access_token
    } catch {
        return null
    }
}

apiToken.interceptors.response.use(unwrap, async (error) => {
    const apiError = toApiError(error)
    error.api = apiError

    if (apiError.code === ERROR_CODES.ACCOUNT_BLOCKED) {
        notifyBlocked(apiError)
        return Promise.reject(error)
    }

    const original = error.config
    const canRetry =
        error?.response?.status === 401 &&
        original &&
        !original._retried &&
        getRefreshToken()

    if (!canRetry) {
        if (error?.response?.status === 401) clearSession()
        return Promise.reject(error)
    }

    original._retried = true
    if (!refreshing) refreshing = refreshTokens().finally(() => { refreshing = null })
    const token = await refreshing

    if (!token) {
        clearSession()
        return Promise.reject(error)
    }

    original.headers = { ...original.headers, Authorization: `Bearer ${token}` }
    return apiToken(original)
})
