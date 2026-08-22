import { apiToken } from '@/lib/axios'
import { clean } from '@/lib/api/site'

// ─────────────────────────────────────────────────────────────────────────────
// Исполнитель kabineti — backend/performer.md, Swagger teglari «Performer: …».
//
// Anketa ustasi (мастер): profile → experience → photo/portfolio → submit.
// `status`: pending_review → moderatsiya ekrani · rejected → banner +
// `moderation_comment` · active → to'liq kartochka.
// ─────────────────────────────────────────────────────────────────────────────

export async function cabinet(params) {
    const res = await apiToken.get('/performer/cabinet', { params: clean(params) })
    return res.data // { user, profile, sections, status, wizard, moderation_comment, age }
}

// ── Anketa ustasi ───────────────────────────────────────────────────────────
// `asDraft` — «В черновик» tugmasi.
export async function saveProfile(payload, { asDraft = false } = {}) {
    const res = await apiToken.put('/performer/profile', payload, {
        params: asDraft ? { as_draft: true } : undefined,
    })
    return res.data
}

// items: [{ year, project_name, brand, role_title }]
export async function saveExperience(items) {
    const res = await apiToken.put('/performer/experience', { items })
    return res.data
}

export async function saveDraft(payload) {
    const res = await apiToken.post('/performer/draft', payload)
    return res.data
}

export async function submit() {
    const res = await apiToken.post('/performer/submit')
    return res.data
}

// ── Portfolio ───────────────────────────────────────────────────────────────
export async function setPhoto(url) {
    const res = await apiToken.post('/performer/photo', { url })
    return res.data
}

export async function addPortfolio({ url, album }) {
    const res = await apiToken.post('/performer/portfolio', clean({ url, album }))
    return res.data
}

export async function portfolio(params) {
    const res = await apiToken.get('/performer/portfolio', { params: clean(params) })
    return res.data // { items, albums, meta }
}

export async function deletePortfolio(mediaId) {
    const res = await apiToken.delete(`/performer/portfolio/${mediaId}`)
    return res.data
}

// ── Sharhlar / otkliklar ────────────────────────────────────────────────────
export async function reviews(params) {
    const res = await apiToken.get('/performer/reviews', { params: clean(params) })
    return res.data
}

// «Приглашения» — zakazchik yuborgan takliflar.
export async function invites(params) {
    const res = await apiToken.get('/performer/invites', { params: clean(params) })
    return res.data // { items, meta }
}

// Taklifga javob. Qayta ko'rib chiqib bo'lmaydi — ikkinchi marta 409.
export async function acceptInvite(id) {
    const res = await apiToken.post(`/performer/invites/${id}/accept`)
    return res.data
}

export async function rejectInvite(id) {
    const res = await apiToken.post(`/performer/invites/${id}/reject`)
    return res.data
}

export async function applications(params) {
    const res = await apiToken.get('/performer/applications', { params: clean(params) })
    return res.data
}

// ── Sozlamalar ──────────────────────────────────────────────────────────────
export async function settings() {
    const res = await apiToken.get('/performer/settings')
    return res.data // { email, phone, password_changed_at, is_hidden }
}

export async function changePassword({ currentPassword, newPassword, repeatPassword }) {
    const res = await apiToken.patch('/performer/settings/password', {
        current_password: currentPassword,
        new_password: newPassword,
        repeat_password: repeatPassword,
    })
    return res.data
}

export async function changeEmail(email) {
    const res = await apiToken.patch('/performer/settings/email', { email })
    return res.data
}

export async function changePhone(phone) {
    const res = await apiToken.patch('/performer/settings/phone', { phone })
    return res.data
}

export async function setHidden(hidden) {
    const res = await apiToken.post('/performer/settings/hide', null, {
        params: { hidden },
    })
    return res.data
}

// «Видимость профиля» — to'rtta bayroq bitta so'rovda (Figma 334:14236).
// Qiymatlar `GET /performer/cabinet` javobida ham bor.
export async function setVisibility({ isHidden, showPhone, showEmail, allowInvites }) {
    const res = await apiToken.patch(
        '/performer/settings/visibility',
        clean({
            is_hidden: isHidden,
            show_phone: showPhone,
            show_email: showEmail,
            allow_invites: allowInvites,
        }),
    )
    return res.data
}

export async function deleteAccount() {
    const res = await apiToken.delete('/performer/settings')
    return res.data
}

// ── Chatlar ─────────────────────────────────────────────────────────────────
export async function chats(params) {
    const res = await apiToken.get('/performer/chats', { params: clean(params) })
    return res.data
}

export async function chat(id) {
    const res = await apiToken.get(`/performer/chats/${id}`)
    return res.data
}

export async function openChat(peerId) {
    const res = await apiToken.post('/performer/chats', { peer_id: peerId })
    return res.data
}

export async function sendMessage(id, { body, attachmentUrl }) {
    const res = await apiToken.post(`/performer/chats/${id}/messages`, {
        body,
        attachment_url: attachmentUrl || null,
    })
    return res.data
}
