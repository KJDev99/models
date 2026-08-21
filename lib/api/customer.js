import { apiToken } from '@/lib/axios'
import { clean } from '@/lib/api/site'

// ─────────────────────────────────────────────────────────────────────────────
// Заказчик kabineti — backend/customer.md, Swagger teglari «Customer: …».
// Barcha so'rovlar token bilan; rol `customer` bo'lmasa backend FORBIDDEN beradi.
// ─────────────────────────────────────────────────────────────────────────────

// status: active | archived | draft | pending_review | rejected
export async function cabinet(params) {
    const res = await apiToken.get('/customer/cabinet', { params: clean(params) })
    return res.data // { empty, user, company, stats, publications }
}

// ── Profil ──────────────────────────────────────────────────────────────────
export async function updateInfo(payload) {
    const res = await apiToken.patch('/customer/profile/info', payload)
    return res.data
}

export async function updateContacts(payload) {
    const res = await apiToken.patch('/customer/profile/contacts', payload)
    return res.data
}

export async function updatePhoto(url) {
    const res = await apiToken.post('/customer/profile/photo', { url })
    return res.data
}

// ── Xavfsizlik ──────────────────────────────────────────────────────────────
export async function settings() {
    const res = await apiToken.get('/customer/settings')
    return res.data // { email_masked, phone_masked, password_changed_at }
}

export async function changePassword({ currentPassword, newPassword, repeatPassword }) {
    const res = await apiToken.patch('/customer/settings/password', {
        current_password: currentPassword,
        new_password: newPassword,
        repeat_password: repeatPassword,
    })
    return res.data
}

export async function changeEmail(email) {
    const res = await apiToken.post('/customer/settings/email', { email })
    return res.data // local rejimda { token, confirm_url }
}

export async function resendEmail() {
    const res = await apiToken.post('/customer/settings/email/resend')
    return res.data
}

export async function confirmEmail(token) {
    const res = await apiToken.post('/customer/settings/email/confirm', { token })
    return res.data
}

export async function changePhone(phone) {
    const res = await apiToken.patch('/customer/settings/phone', { phone })
    return res.data // SMS_PROVIDER=log bo'lsa { code }
}

export async function confirmPhone(code) {
    const res = await apiToken.post('/customer/settings/phone/confirm', { code })
    return res.data
}

export async function deleteAccount() {
    const res = await apiToken.delete('/customer/settings')
    return res.data
}

// ── Loyihalar ───────────────────────────────────────────────────────────────
export async function projects(params) {
    const res = await apiToken.get('/customer/projects', { params: clean(params) })
    return res.data
}

export async function project(id) {
    const res = await apiToken.get(`/customer/projects/${id}`)
    return res.data
}

export async function createProject(payload) {
    const res = await apiToken.post('/customer/projects', payload)
    return res.data
}

export async function updateProject(id, payload) {
    const res = await apiToken.put(`/customer/projects/${id}`, payload)
    return res.data
}

export async function setProjectCover(id, url) {
    const res = await apiToken.post(`/customer/projects/${id}/cover`, { url })
    return res.data
}

export async function submitProject(id) {
    const res = await apiToken.post(`/customer/projects/${id}/submit`)
    return res.data
}

export async function draftProject(id) {
    const res = await apiToken.post(`/customer/projects/${id}/draft`)
    return res.data
}

export async function archiveProject(id) {
    const res = await apiToken.post(`/customer/projects/${id}/archive`)
    return res.data
}

export async function deleteProject(id) {
    const res = await apiToken.delete(`/customer/projects/${id}`)
    return res.data
}

// ── Maydonlar (площадки) ────────────────────────────────────────────────────
export async function venues(params) {
    const res = await apiToken.get('/customer/venues', { params: clean(params) })
    return res.data
}

export async function venue(id) {
    const res = await apiToken.get(`/customer/venues/${id}`)
    return res.data
}

export async function createVenue(payload) {
    const res = await apiToken.post('/customer/venues', payload)
    return res.data
}

export async function updateVenue(id, payload) {
    const res = await apiToken.put(`/customer/venues/${id}`, payload)
    return res.data
}

// Muqova uchun `album` bermaymiz, albom uchun beramiz.
export async function addVenuePhoto(id, { url, album }) {
    const res = await apiToken.post(`/customer/venues/${id}/photos`, clean({ url, album }))
    return res.data
}

export async function venuePhotos(id, params) {
    const res = await apiToken.get(`/customer/venues/${id}/photos`, { params: clean(params) })
    return res.data
}

export async function deletePhoto(mediaId) {
    const res = await apiToken.delete(`/customer/photos/${mediaId}`)
    return res.data
}

export async function submitVenue(id) {
    const res = await apiToken.post(`/customer/venues/${id}/submit`)
    return res.data
}

export async function draftVenue(id) {
    const res = await apiToken.post(`/customer/venues/${id}/draft`)
    return res.data
}

export async function archiveVenue(id) {
    const res = await apiToken.post(`/customer/venues/${id}/archive`)
    return res.data
}

export async function deleteVenue(id) {
    const res = await apiToken.delete(`/customer/venues/${id}`)
    return res.data
}

// ── Sevimlilar / sharhlar ───────────────────────────────────────────────────
export async function favorites(params) {
    const res = await apiToken.get('/customer/favorites', { params: clean(params) })
    return res.data
}

export async function addFavorite({ targetType, targetId }) {
    const res = await apiToken.post('/customer/favorites', {
        target_type: targetType,
        target_id: targetId,
    })
    return res.data
}

export async function removeFavorite(favoriteId) {
    const res = await apiToken.delete(`/customer/favorites/${favoriteId}`)
    return res.data
}

export async function reviews(params) {
    const res = await apiToken.get('/customer/reviews', { params: clean(params) })
    return res.data
}

export async function createReview({ targetId, venueId, rating, body }) {
    const res = await apiToken.post('/customer/reviews', clean({
        target_id: targetId,
        venue_id: venueId,
        rating,
        body,
    }))
    return res.data
}

// ── Chatlar ─────────────────────────────────────────────────────────────────
export async function chats(params) {
    const res = await apiToken.get('/customer/chats', { params: clean(params) })
    return res.data
}

export async function chat(id) {
    const res = await apiToken.get(`/customer/chats/${id}`)
    return res.data
}

export async function openChat(peerId) {
    const res = await apiToken.post('/customer/chats', { peer_id: peerId })
    return res.data
}

export async function sendMessage(id, { body, attachmentUrl }) {
    const res = await apiToken.post(`/customer/chats/${id}/messages`, {
        body,
        attachment_url: attachmentUrl || null,
    })
    return res.data
}

// ── Otkliklar / takliflar ───────────────────────────────────────────────────
export async function applications(params) {
    const res = await apiToken.get('/customer/applications', { params: clean(params) })
    return res.data
}

export async function acceptApplication(id) {
    const res = await apiToken.post(`/customer/applications/${id}/accept`)
    return res.data
}

export async function rejectApplication(id, comment) {
    const res = await apiToken.post(`/customer/applications/${id}/reject`, clean({ comment }))
    return res.data
}

export async function invite({ performerId, projectId }) {
    const res = await apiToken.post('/customer/invites', {
        performer_id: performerId,
        project_id: projectId,
    })
    return res.data
}

// ── Katalog (kirgan zakazchik uchun) ────────────────────────────────────────
export async function catalogPerformers(params) {
    const res = await apiToken.get('/customer/catalog/performers', { params: clean(params) })
    return res.data
}

export async function catalogPerformer(id) {
    const res = await apiToken.get(`/customer/catalog/performers/${id}`)
    return res.data
}

export async function catalogVenues(params) {
    const res = await apiToken.get('/customer/catalog/venues', { params: clean(params) })
    return res.data
}

export async function catalogVenue(id) {
    const res = await apiToken.get(`/customer/catalog/venues/${id}`)
    return res.data
}

export async function catalogProjects(params) {
    const res = await apiToken.get('/customer/catalog/projects', { params: clean(params) })
    return res.data
}

export async function catalogProject(id) {
    const res = await apiToken.get(`/customer/catalog/projects/${id}`)
    return res.data
}

export async function catalogAgencies(params) {
    const res = await apiToken.get('/customer/catalog/agencies', { params: clean(params) })
    return res.data
}

export async function catalogAgency(id) {
    const res = await apiToken.get(`/customer/catalog/agencies/${id}`)
    return res.data
}
