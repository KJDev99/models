// ─────────────────────────────────────────────────────────────────────────────
// Sessiya (token + user) localStorage'da saqlanadi. Har o'zgarishda
// `auth-changed` hodisasi yuboriladi — navbar, guard va store shunga qarab
// darhol yangilanadi (genius-shop'dagi `cart-updated` bilan bir xil uslub).
// ─────────────────────────────────────────────────────────────────────────────

const ACCESS_KEY = 'access_token'
const REFRESH_KEY = 'refresh_token'
const USER_KEY = 'user'

function emit() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-changed'))
    }
}

export function getAccessToken() {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(ACCESS_KEY)
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

export function setSession({ access, refresh, user }) {
    if (typeof window === 'undefined') return
    if (access) localStorage.setItem(ACCESS_KEY, access)
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    emit()
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
