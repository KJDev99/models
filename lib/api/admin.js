import { apiToken } from '@/lib/axios'
import { clean } from '@/lib/api/site'

// ─────────────────────────────────────────────────────────────────────────────
// Adminka — backend/admin.md, Swagger teglari «Admin: …».
// Kirish alohida: `POST /admin/auth/login` (lib/api/auth.js → adminLogin).
// ─────────────────────────────────────────────────────────────────────────────

export async function dashboard() {
    const res = await apiToken.get('/admin/dashboard')
    return res.data // { stats, latest_moderation, latest_users }
}

// ── Ijrochilar ──────────────────────────────────────────────────────────────
export async function performers(params) {
    const res = await apiToken.get('/admin/performers', { params: clean(params) })
    return res.data
}

export async function performer(id) {
    const res = await apiToken.get(`/admin/performers/${id}`)
    return res.data
}

export async function createPerformer(payload) {
    const res = await apiToken.post('/admin/performers', payload)
    return res.data
}

export async function updatePerformer(id, payload) {
    const res = await apiToken.put(`/admin/performers/${id}`, payload)
    return res.data
}

export async function deletePerformer(id) {
    const res = await apiToken.delete(`/admin/performers/${id}`)
    return res.data
}

// measure — «Заблокировать на 1 день» kabi matn, days — muddat.
export async function blockPerformer(id, { measure, reason, days }) {
    const res = await apiToken.post(`/admin/performers/${id}/block`, clean({ measure, reason, days }))
    return res.data
}

export async function unblockPerformer(id) {
    const res = await apiToken.post(`/admin/performers/${id}/unblock`)
    return res.data
}

export async function hidePerformer(id, hidden) {
    const res = await apiToken.post(`/admin/performers/${id}/hide`, null, { params: { hidden } })
    return res.data
}

export async function pausePerformer(id, paused) {
    const res = await apiToken.post(`/admin/performers/${id}/pause`, null, { params: { paused } })
    return res.data
}

export async function addPerformerPhoto(id, { url, album }) {
    const res = await apiToken.post(`/admin/performers/${id}/photos`, clean({ url, album }))
    return res.data
}

// ── Zakazchiklar ────────────────────────────────────────────────────────────
export async function customers(params) {
    const res = await apiToken.get('/admin/customers', { params: clean(params) })
    return res.data
}

export async function customer(id) {
    const res = await apiToken.get(`/admin/customers/${id}`)
    return res.data
}

export async function createCustomer(payload) {
    const res = await apiToken.post('/admin/customers', payload)
    return res.data
}

export async function updateCustomer(id, payload) {
    const res = await apiToken.put(`/admin/customers/${id}`, payload)
    return res.data
}

export async function deleteCustomer(id) {
    const res = await apiToken.delete(`/admin/customers/${id}`)
    return res.data
}

export async function blockCustomer(id, { measure, reason, days }) {
    const res = await apiToken.post(`/admin/customers/${id}/block`, clean({ measure, reason, days }))
    return res.data
}

export async function unblockCustomer(id) {
    const res = await apiToken.post(`/admin/customers/${id}/unblock`)
    return res.data
}

// ── Agentliklar ─────────────────────────────────────────────────────────────
export async function agencies(params) {
    const res = await apiToken.get('/admin/agencies', { params: clean(params) })
    return res.data
}

export async function agency(id) {
    const res = await apiToken.get(`/admin/agencies/${id}`)
    return res.data
}

export async function createAgency(payload) {
    const res = await apiToken.post('/admin/agencies', payload)
    return res.data
}

export async function updateAgency(id, payload) {
    const res = await apiToken.put(`/admin/agencies/${id}`, payload)
    return res.data
}

export async function deleteAgency(id) {
    const res = await apiToken.delete(`/admin/agencies/${id}`)
    return res.data
}

export async function blockAgency(id, { measure, reason, days }) {
    const res = await apiToken.post(`/admin/agencies/${id}/block`, clean({ measure, reason, days }))
    return res.data
}

export async function unblockAgency(id) {
    const res = await apiToken.post(`/admin/agencies/${id}/unblock`)
    return res.data
}

export async function addAgencyPerformer(agencyId, payload) {
    const res = await apiToken.post(`/admin/agencies/${agencyId}/performers`, payload)
    return res.data
}

// ── Loyihalar ───────────────────────────────────────────────────────────────
export async function projects(params) {
    const res = await apiToken.get('/admin/projects', { params: clean(params) })
    return res.data
}

export async function project(id) {
    const res = await apiToken.get(`/admin/projects/${id}`)
    return res.data
}

export async function createProject(payload) {
    const res = await apiToken.post('/admin/projects', payload)
    return res.data
}

export async function updateProject(id, payload) {
    const res = await apiToken.put(`/admin/projects/${id}`, payload)
    return res.data
}

export async function deleteProject(id) {
    const res = await apiToken.delete(`/admin/projects/${id}`)
    return res.data
}

// ── Maydonlar ───────────────────────────────────────────────────────────────
export async function venues(params) {
    const res = await apiToken.get('/admin/venues', { params: clean(params) })
    return res.data
}

export async function venue(id) {
    const res = await apiToken.get(`/admin/venues/${id}`)
    return res.data
}

export async function createVenue(payload) {
    const res = await apiToken.post('/admin/venues', payload)
    return res.data
}

export async function updateVenue(id, payload) {
    const res = await apiToken.put(`/admin/venues/${id}`, payload)
    return res.data
}

export async function deleteVenue(id) {
    const res = await apiToken.delete(`/admin/venues/${id}`)
    return res.data
}

export async function addVenuePhoto(id, { url, album }) {
    const res = await apiToken.post(`/admin/venues/${id}/photos`, clean({ url, album }))
    return res.data
}

// ── Sharhlar ────────────────────────────────────────────────────────────────
export async function reviews(params) {
    const res = await apiToken.get('/admin/reviews', { params: clean(params) })
    return res.data
}

export async function setReviewStatus(id, status) {
    const res = await apiToken.patch(`/admin/reviews/${id}`, { status })
    return res.data
}

export async function deleteReview(id) {
    const res = await apiToken.delete(`/admin/reviews/${id}`)
    return res.data
}

// ── Moderatsiya ─────────────────────────────────────────────────────────────
// source: user | project | venue
export async function moderation(params) {
    const res = await apiToken.get('/admin/moderation', { params: clean(params) })
    return res.data
}

export async function moderationItem(source, id) {
    const res = await apiToken.get(`/admin/moderation/${source}/${id}`)
    return res.data
}

export async function approve(source, id) {
    const res = await apiToken.post(`/admin/moderation/${source}/${id}/approve`)
    return res.data
}

export async function reject(source, id, comment) {
    const res = await apiToken.post(`/admin/moderation/${source}/${id}/reject`, { comment })
    return res.data
}

// ── Shikoyatlar ─────────────────────────────────────────────────────────────
export async function complaints(params) {
    const res = await apiToken.get('/admin/complaints', { params: clean(params) })
    return res.data
}

export async function complaintMessages(id) {
    const res = await apiToken.get(`/admin/complaints/${id}/messages`)
    return res.data
}

export async function acceptComplaint(id, { measure, reason, days } = {}) {
    const res = await apiToken.post(`/admin/complaints/${id}/accept`, clean({ measure, reason, days }))
    return res.data
}

export async function rejectComplaint(id, comment) {
    const res = await apiToken.post(`/admin/complaints/${id}/reject`, clean({ comment }))
    return res.data
}

// ── Chatlar ─────────────────────────────────────────────────────────────────
export async function chats(params) {
    const res = await apiToken.get('/admin/chats', { params: clean(params) })
    return res.data
}

export async function chat(id) {
    const res = await apiToken.get(`/admin/chats/${id}`)
    return res.data
}

export async function sendMessage(id, { body, attachmentUrl }) {
    const res = await apiToken.post(`/admin/chats/${id}/messages`, {
        body,
        attachment_url: attachmentUrl || null,
    })
    return res.data
}

// ── FAQ / kontaktlar / hujjatlar ────────────────────────────────────────────
export async function faqs(params) {
    const res = await apiToken.get('/admin/faqs', { params: clean(params) })
    return res.data
}

export async function createFaq(payload) {
    const res = await apiToken.post('/admin/faqs', payload)
    return res.data
}

export async function updateFaq(id, payload) {
    const res = await apiToken.put(`/admin/faqs/${id}`, payload)
    return res.data
}

export async function publishFaq(id) {
    const res = await apiToken.post(`/admin/faqs/${id}/publish`)
    return res.data
}

export async function setFaqStatus(id, status) {
    const res = await apiToken.patch(`/admin/faqs/${id}/status`, { status })
    return res.data
}

export async function deleteFaq(id) {
    const res = await apiToken.delete(`/admin/faqs/${id}`)
    return res.data
}

export async function contacts() {
    const res = await apiToken.get('/admin/contacts')
    return res.data
}

export async function saveContacts(payload) {
    const res = await apiToken.put('/admin/contacts', payload)
    return res.data
}

export async function legalPages() {
    const res = await apiToken.get('/admin/legal')
    return res.data
}

export async function saveLegal(slug, payload) {
    const res = await apiToken.put(`/admin/legal/${slug}`, payload)
    return res.data
}
