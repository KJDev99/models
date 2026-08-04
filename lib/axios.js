import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// Token talab qilmaydigan ochiq endpointlar (katalog, sahifalar, login).
export const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
})

// Token bilan ishlaydigan endpointlar (kabinet, admin).
export const apiToken = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
})

apiToken.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token')
        if (token) config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// 401 — token eskirgan: sessiyani tozalab, login sahifasiga qaytaramiz.
// Guard'lar ham xuddi shu `auth-changed` hodisasiga quloq soladi.
apiToken.interceptors.response.use(
    (res) => res,
    (error) => {
        if (typeof window !== 'undefined' && error?.response?.status === 401) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('user')
            window.dispatchEvent(new Event('auth-changed'))
        }
        return Promise.reject(error)
    }
)
