import { apiToken } from '@/lib/axios'
import { clean } from '@/lib/api/site'

// ─────────────────────────────────────────────────────────────────────────────
// Агентство kabineti — backend/agency.md, Swagger teglari «Agency: …».
//
// Anketa qo'shishda `agency_id` va `status` yuborilmaydi — server o'zi qo'yadi
// (agentlik = joriy user, status = pending_review).
// ─────────────────────────────────────────────────────────────────────────────

// specialty: model | photographer | videographer (bo'sh — hammasi)
export async function cabinet(params) {
    const res = await apiToken.get('/agency/cabinet', { params: clean(params) })
    return res.data // { user, logo_url, about, contact_links, stats, performers }
}

// ── Profil ──────────────────────────────────────────────────────────────────
export async function updateInfo(payload) {
    const res = await apiToken.patch('/agency/profile/info', payload)
    return res.data
}

export async function updateContacts(payload) {
    const res = await apiToken.patch('/agency/profile/contacts', payload)
    return res.data
}

export async function updateSecurity({ currentPassword, newPassword, repeatPassword }) {
    const res = await apiToken.patch('/agency/profile/security', {
        current_password: currentPassword,
        new_password: newPassword,
        repeat_password: repeatPassword,
    })
    return res.data
}

export async function updatePhoto(url) {
    const res = await apiToken.post('/agency/profile/photo', { url })
    return res.data
}

export async function deleteAccount() {
    const res = await apiToken.delete('/agency/profile')
    return res.data
}

// ── Ijrochilar ──────────────────────────────────────────────────────────────
export async function performers(params) {
    const res = await apiToken.get('/agency/performers', { params: clean(params) })
    return res.data
}

export async function performer(id) {
    const res = await apiToken.get(`/agency/performers/${id}`)
    return res.data
}

export async function createPerformer(payload) {
    const res = await apiToken.post('/agency/performers', payload)
    return res.data
}

export async function updatePerformer(id, payload) {
    const res = await apiToken.put(`/agency/performers/${id}`, payload)
    return res.data
}

export async function addPerformerPhoto(id, { url, album }) {
    const res = await apiToken.post(`/agency/performers/${id}/photos`, clean({ url, album }))
    return res.data
}

export async function setPerformerHidden(id, hidden) {
    const res = await apiToken.post(`/agency/performers/${id}/hide`, null, {
        params: { hidden },
    })
    return res.data
}

export async function deletePerformer(id) {
    const res = await apiToken.delete(`/agency/performers/${id}`)
    return res.data
}

// ── Sharhlar ────────────────────────────────────────────────────────────────
export async function reviews(params) {
    const res = await apiToken.get('/agency/reviews', { params: clean(params) })
    return res.data // { rating_avg, items, meta }
}

export async function performerReviews(id, params) {
    const res = await apiToken.get(`/agency/performers/${id}/reviews`, { params: clean(params) })
    return res.data
}

// ── Chatlar ─────────────────────────────────────────────────────────────────
// «Проекты» — agentlik ijrochilari qatnashgan loyihalar.
// Elementda `roster[]` bo'ladi: kim qaysi holatda.
export async function projects(params) {
    const res = await apiToken.get('/agency/projects', { params: clean(params) })
    return res.data // { items, meta }
}

// «Отклики» — agentlik ijrochilari yuborgan arizalar.
// `status`: pending | accepted | rejected.
export async function applications(params) {
    const res = await apiToken.get('/agency/applications', { params: clean(params) })
    return res.data // { items, meta }
}

// «Приглашения» — zakazchiklar agentlik ijrochilarini chaqirgan takliflar.
export async function invites(params) {
    const res = await apiToken.get('/agency/invites', { params: clean(params) })
    return res.data // { items, meta }
}

export async function chats(params) {
    const res = await apiToken.get('/agency/chats', { params: clean(params) })
    return res.data
}

export async function chat(id) {
    const res = await apiToken.get(`/agency/chats/${id}`)
    return res.data
}

export async function openChat(peerId) {
    const res = await apiToken.post('/agency/chats', { peer_id: peerId })
    return res.data
}

export async function sendMessage(id, { body, attachmentUrl }) {
    const res = await apiToken.post(`/agency/chats/${id}/messages`, {
        body,
        attachment_url: attachmentUrl || null,
    })
    return res.data
}

// «Позвать в проект» — chat ichidan.
export async function inviteToProject(id, projectId) {
    const res = await apiToken.post(`/agency/chats/${id}/invite`, { project_id: projectId })
    return res.data
}
