import { api, apiToken } from '@/lib/axios'

// ─────────────────────────────────────────────────────────────────────────────
// Avtorizatsiya — backend/auth.md va Swagger teglari «Вход: …», «Регистрация: …»,
// «Сессия», «Профиль», «OAuth».
//
// Oqim: identify → (login | register) → tokens + user.
// `challenge_token` 10 daqiqa yashaydi va faqat state'da saqlanadi.
// ─────────────────────────────────────────────────────────────────────────────

// OAuth'da brauzer backendga to'g'ridan-to'g'ri o'tadi (redirect zanjiri
// proxy orqali ishlamaydi), shuning uchun mutlaq manzil kerak.
const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN || ''
const API_URL = `${API_ORIGIN}/api/v1`

// 1-qadam: telefon yoki pochta bo'yicha profilni aniqlash.
// role: customer|performer|agency · intent: login|register
export async function identify({ role, intent, identifierType, phone, email }) {
    const body = { role, intent, identifier_type: identifierType }
    if (identifierType === 'phone') body.phone = phone
    else body.email = email
    const res = await api.post('/auth/identify', body)
    return res.data // { challenge_token, next_step, display_identifier, role }
}

// 2-qadam: parol bilan kirish.
export async function login({ challengeToken, password }) {
    const res = await api.post('/auth/login', {
        challenge_token: challengeToken,
        password,
    })
    return res.data // { tokens, user }
}

// «Знакомство» — zakazchik (jismoniy shaxs yoki kompaniya).
export async function registerCustomer(payload) {
    const res = await api.post('/auth/register/customer', payload)
    return res.data
}

// «Знакомство» — ijrochi (model / fotograf / videograf).
export async function registerPerformer(payload) {
    const res = await api.post('/auth/register/performer', payload)
    return res.data
}

// «Знакомство» — agentlik.
export async function registerAgency(payload) {
    const res = await api.post('/auth/register/agency', payload)
    return res.data
}

export async function me() {
    const res = await apiToken.get('/auth/me')
    return res.data
}

export async function refresh(refreshToken) {
    const res = await api.post('/auth/refresh', { refresh_token: refreshToken })
    return res.data
}

export async function logout(refreshToken) {
    const res = await api.post('/auth/logout', { refresh_token: refreshToken })
    return res.data
}

// OAuth'dan keyin profil to'ldirilmagan bo'lsa (`is_profile_complete === false`)
// «Знакомство» formasi shu endpointlarga yuboriladi — `challenge_token`siz.
export async function completeProfile(role, payload) {
    const res = await apiToken.patch(`/auth/profile/${role}`, payload)
    return res.data
}

// OAuth boshlanish manzili — brauzer shu URL'ga yo'naltiriladi.
export function oauthStartUrl(provider, { role, intent }) {
    const params = new URLSearchParams({ role, intent })
    return `${API_URL}/auth/oauth/${provider}/start?${params}`
}

// Adminka alohida kiradi: pochta + parol (challenge yo'q).
export async function adminLogin({ email, password }) {
    const res = await api.post('/admin/auth/login', { email, password })
    return res.data // { tokens, user }
}
