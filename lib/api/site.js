import { api, apiToken } from '@/lib/axios'
import { isAuthenticated } from '@/lib/auth'

// ─────────────────────────────────────────────────────────────────────────────
// Ochiq sayt — backend/site.md, Swagger teglari «Site: …».
//
// Katalog va FAQ tokensiz ishlaydi; sevimlilar, bildirishnomalar, chat, bron
// va shikoyat token talab qiladi. Katalogni kirgan foydalanuvchi ham ko'radi —
// shuning uchun token bo'lsa `apiToken` ishlatiladi (backend `is_favorite`
// kabi shaxsiy maydonlarni qo'shishi mumkin).
// ─────────────────────────────────────────────────────────────────────────────

function client() {
    return isAuthenticated() ? apiToken : api
}

// Bo'sh va `undefined` parametrlarni so'rovga qo'shmaymiz.
export function clean(params = {}) {
    const out = {}
    for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null || v === '') continue
        out[k] = v
    }
    return out
}

// ── Lug'atlar ───────────────────────────────────────────────────────────────
// Filtrlar uchun ruxsat etilgan qiymatlar: { work_directions, categories,
// project_types, venue_types, suitable_for } — har biri [{ value, label }].
// Tokensiz ochiq, javob kam o'zgaradi.
export async function dictionaries() {
    const res = await api.get('/site/dictionaries')
    return res.data
}

// ── Katalog ─────────────────────────────────────────────────────────────────
// specialty: model | photographer | videographer
export async function performers(params) {
    const res = await client().get('/site/performers', { params: clean(params) })
    return res.data // { items, meta }
}

export async function performer(id) {
    const res = await client().get(`/site/performers/${id}`)
    return res.data // { user, profile, prices, experience, media, reviews, related }
}

export async function venues(params) {
    const res = await client().get('/site/venues', { params: clean(params) })
    return res.data
}

export async function venue(id) {
    const res = await client().get(`/site/venues/${id}`)
    return res.data
}

export async function projects(params) {
    const res = await client().get('/site/projects', { params: clean(params) })
    return res.data
}

export async function project(id) {
    const res = await client().get(`/site/projects/${id}`)
    return res.data // + related[], owner_stats
}

export async function agencies(params) {
    const res = await client().get('/site/agencies', { params: clean(params) })
    return res.data
}

export async function agency(id) {
    const res = await client().get(`/site/agencies/${id}`)
    return res.data
}

export async function customer(id) {
    const res = await client().get(`/site/customers/${id}`)
    return res.data
}

// ── FAQ ─────────────────────────────────────────────────────────────────────
// type: models | photographers | videographers | venues | projects |
//       project_detail | agencies | agency_profile | performer_profile |
//       customer_profile | contacts | favorites | home
export async function faqs(type) {
    const res = await api.get('/site/faqs', { params: clean({ type }) })
    return res.data // [{ id, question, answer, sort_order }]
}

export async function faqTypes() {
    const res = await api.get('/site/faq-types')
    return res.data
}

export async function createFaq({ pageType, question, answer }) {
    const res = await apiToken.post('/site/faqs', {
        page_type: pageType,
        question,
        answer,
    })
    return res.data
}

export async function myFaqs() {
    const res = await apiToken.get('/site/faqs/my')
    return res.data
}

// ── Kontaktlar / qidiruv ────────────────────────────────────────────────────
export async function contacts() {
    const res = await api.get('/site/contacts')
    return res.data // { phone, email, address, city, latitude, longitude, socials[] }
}

export async function search(q) {
    const res = await client().get('/site/search', { params: clean({ q }) })
    return res.data // [{ id, kind, title, city, cover_url, extra }]
}

export async function geocode(address) {
    const res = await api.get('/site/geocode', { params: clean({ address }) })
    return res.data
}

export async function share({ targetType, targetId }) {
    const res = await apiToken.post('/site/share', {
        target_type: targetType,
        target_id: targetId,
    })
    return res.data
}

// ── Loyihaga javob berish / taklif ──────────────────────────────────────────
export async function applyToProject(projectId, message) {
    const res = await apiToken.post(`/site/projects/${projectId}/apply`, { message })
    return res.data // { conversation_id, ... }
}

export async function invitePerformer(performerId, projectId) {
    const res = await apiToken.post(`/site/performers/${performerId}/invite`, {
        project_id: projectId,
    })
    return res.data
}

// ── Sevimlilar ──────────────────────────────────────────────────────────────
// tab: all | models | photographers | videographers | agencies | venues | projects
export async function favorites(tab) {
    const res = await apiToken.get('/site/favorites', { params: clean({ tab }) })
    return res.data // { items, counts }
}

export async function addFavorite({ targetType, targetId }) {
    const res = await apiToken.post('/site/favorites', {
        target_type: targetType,
        target_id: targetId,
    })
    return res.data
}

export async function removeFavorite(favoriteId) {
    const res = await apiToken.delete(`/site/favorites/${favoriteId}`)
    return res.data
}

// ── Bildirishnomalar ────────────────────────────────────────────────────────
export async function notifications(params) {
    const res = await apiToken.get('/site/notifications', { params: clean(params) })
    return res.data // { items, unread }
}

export async function markNotificationsRead(ids) {
    const res = await apiToken.post('/site/notifications/read', clean({ ids }))
    return res.data
}

// ── Chatlar ─────────────────────────────────────────────────────────────────
export async function chats(params) {
    const res = await apiToken.get('/site/chats', { params: clean(params) })
    return res.data
}

// Texnik yordam suhbati — mijoz izohi (24/08 №12).
//
// Backend hozir bunday ruchka bermaydi; kelганда quyidagi shakl kutiladi:
//   GET /site/support → { user_id, name, logo_url }
// `user_id` — tizim foydalanuvchisi, undan keyin oddiy suhbat ochiladi
// (`useChatStore.startChat`). Ruchka yo'q bo'lsa 404 qaytadi va
// «Поддержка» tugmasi umuman chizilmaydi.
export async function support() {
    const res = await apiToken.get('/site/support')
    return res.data
}

export async function chat(conversationId) {
    const res = await apiToken.get(`/site/chats/${conversationId}`)
    return res.data
}

export async function sendMessage(conversationId, { body, attachmentUrl }) {
    const res = await apiToken.post(`/site/chats/${conversationId}/messages`, {
        body,
        attachment_url: attachmentUrl || null,
    })
    return res.data
}

export async function complain({ accusedId, conversationId, reason, body }) {
    const res = await apiToken.post('/site/complaints', {
        accused_id: accusedId,
        conversation_id: conversationId,
        reason,
        body,
    })
    return res.data
}

// ── Fayl yuklash ────────────────────────────────────────────────────────────
export async function upload(file) {
    const form = new FormData()
    form.append('file', file)
    const res = await apiToken.post('/site/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data // { url }
}

// ── Bron ────────────────────────────────────────────────────────────────────
// `venueId` — faqat UUID: bron ruchkasi slug qabul qilmaydi (hisobot, 22-band).
// `time_slot` ni backend o'zi `time_from` / `time_to` ga ajratadi.
export async function bookVenue(venueId, { shootDate, projectName, timeSlot, comment }) {
    const res = await apiToken.post(
        `/site/venues/${venueId}/book`,
        clean({
            shoot_date: shootDate,
            project_name: projectName,
            time_slot: timeSlot,
            comment,
        }),
    )
    return res.data
}

export async function myBookings(params) {
    const res = await apiToken.get('/site/bookings', { params: clean(params) })
    return res.data
}

export async function incomingBookings(params) {
    const res = await apiToken.get('/site/bookings/incoming', { params: clean(params) })
    return res.data
}

export async function venueBookings(venueId, params) {
    const res = await apiToken.get(`/site/venues/${venueId}/bookings`, {
        params: clean(params),
    })
    return res.data
}

export async function confirmBooking(id) {
    const res = await apiToken.post(`/site/bookings/${id}/confirm`)
    return res.data
}

export async function rejectBooking(id, comment) {
    const res = await apiToken.post(`/site/bookings/${id}/reject`, clean({ comment }))
    return res.data
}

export async function cancelBooking(id) {
    const res = await apiToken.post(`/site/bookings/${id}/cancel`)
    return res.data
}

export async function payBooking(id, method = 'offline') {
    const res = await apiToken.post(`/site/bookings/${id}/pay`, { method })
    return res.data
}

// ── Hujjatlar / til ─────────────────────────────────────────────────────────
export async function legal(slug, locale = 'ru') {
    const res = await api.get(`/site/legal/${slug}`, { params: { locale } })
    return res.data
}

export async function locales() {
    const res = await api.get('/site/locales')
    return res.data
}

export async function setLocale(locale) {
    const res = await apiToken.patch('/site/me/locale', { locale })
    return res.data
}
