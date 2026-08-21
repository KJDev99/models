// ─────────────────────────────────────────────────────────────────────────────
// Sessiya (token + user) localStorage'da saqlanadi. Har o'zgarishda
// `auth-changed` hodisasi yuboriladi — navbar, guard va store shunga qarab
// darhol yangilanadi.
//
// Backend `{ tokens: { access_token, refresh_token }, user }` qaytaradi
// (backend/auth.md), shuning uchun `setSession` shu shaklni ham tushunadi.
// ─────────────────────────────────────────────────────────────────────────────

const ACCESS_KEY = 'access_token'
const REFRESH_KEY = 'refresh_token'
const USER_KEY = 'user'

// Bloklangan akkaunt modali shu hodisadan ochiladi (Figma 345:18476).
export const AUTH_BLOCKED_EVENT = 'auth-blocked'

function emit() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-changed'))
    }
}

export function getAccessToken() {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken() {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(REFRESH_KEY)
}

export function getUser() {
    if (typeof window === 'undefined') return null
    try {
        return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    } catch {
        return null
    }
}

export function getRole() {
    return getUser()?.role || null
}

export function isAuthenticated() {
    return Boolean(getAccessToken())
}

// `access`/`refresh` yoki backenddagi `tokens` obyekti — ikkalasi ham bo'ladi.
export function setSession({ access, refresh, tokens, user }) {
    if (typeof window === 'undefined') return
    const accessToken = access || tokens?.access_token
    const refreshToken = refresh || tokens?.refresh_token
    if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken)
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    emit()
}

// Faqat tokenlarni yangilash (refresh rotation) — `auth-changed` chiqarmaydi,
// chunki foydalanuvchi o'zgarmagan va guard'larni qayta ishga tushirish shart emas.
export function setTokens({ access_token, refresh_token }) {
    if (typeof window === 'undefined') return
    if (access_token) localStorage.setItem(ACCESS_KEY, access_token)
    if (refresh_token) localStorage.setItem(REFRESH_KEY, refresh_token)
}

export function setUser(user) {
    if (typeof window === 'undefined') return
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    emit()
}

export function clearSession() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(USER_KEY)
    emit()
}

// Login'dan keyin qaytib kelish uchun manzilni eslab qolamiz
// (Figma: "Требуется вход" modali — kirgandan keyin o'sha sahifaga qaytadi).
export function setReturnUrl(url) {
    if (typeof window === 'undefined') return
    sessionStorage.setItem('return_url', url)
}

export function popReturnUrl() {
    if (typeof window === 'undefined') return null
    const url = sessionStorage.getItem('return_url')
    sessionStorage.removeItem('return_url')
    return url
}
