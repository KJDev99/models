import * as customerApi from '@/lib/api/customer'
import * as performerApi from '@/lib/api/performer'
import * as agencyApi from '@/lib/api/agency'
import * as site from '@/lib/api/site'
import { fullName, mapStatus, shootDate } from '@/lib/adapters'

// ─────────────────────────────────────────────────────────────────────────────
// Kabinetdagi eski ro'yxat sahifalari (`ResourceList`) uchun endpointlar va
// kartochka moslashtiruvchilari.
//
// Bu sahifalar Figma'dagi yangi kabinet maketiga kirmagan (menyu `lib/nav.js`
// hech qayerda chizilmaydi), lekin manzil bo'yicha ochiladi — shuning uchun
// mock endpointlar o'rniga haqiqiy API'ga ulangan.
//
// Funksiyalar modul darajasida: `ResourceList` ularni `useCallback`
// bog'liqligi sifatida ishlatadi, har renderda yangisi bo'lmasligi kerak.
// ─────────────────────────────────────────────────────────────────────────────

const page = (p) => ({ page: p.page, page_size: p.limit })

// Eski tab qiymatlari → backend holatlari (`mapStatus`ning teskarisi).
const API_STATUS = {
    moderation: 'pending_review',
    hidden: 'hidden',
    completed: 'completed',
    archive: 'archived',
    active: 'active',
    rejected: 'rejected',
    draft: 'draft',
}

function status(value) {
    if (!value) return undefined
    return API_STATUS[value] || value
}

// ── Loyihalar ───────────────────────────────────────────────────────────────

// Zakazchikning o'z loyihalari — GET /customer/projects.
export function customerProjects(p) {
    return customerApi.projects({ ...page(p), status: status(p.status) })
}

// Zakazchikning maydonlari — GET /customer/venues.
export function customerVenues(p) {
    return customerApi.venues({ ...page(p), status: status(p.status) })
}

// Ijrochi qatnashgan loyihalar — GET /performer/applications.
// Javobda ariza va uning loyihasi keladi, kartochkaga loyihani beramiz.
export function performerProjects(p) {
    return performerApi.applications({ ...page(p), status: status(p.status) })
}

// Agentlik uchun alohida «loyihalarim» ro'yxati yo'q — ochiq katalog
// ko'rsatiladi (backend hisoboti, 18-band).
export function agencyProjects(p) {
    return site.projects({ ...page(p) })
}

// ── Ijrochilar ──────────────────────────────────────────────────────────────

export function agencyPerformers(p) {
    return agencyApi.performers({ ...page(p), status: status(p.status) })
}

// Kabinet ichidagi katalog — tab qiymati ixtisoslik bo'lib keladi.
export function catalogPerformers(p) {
    return site.performers({ ...page(p), specialty: p.status || 'model' })
}

// ── Sharhlar ────────────────────────────────────────────────────────────────

export function customerReviews(p) {
    return customerApi.reviews({ ...page(p), status: status(p.status) })
}

export function performerReviews(p) {
    return performerApi.reviews({ ...page(p), status: status(p.status) })
}

export function agencyReviews(p) {
    return agencyApi.reviews({ ...page(p), status: status(p.status) })
}

// ── Takliflar / arizalar ────────────────────────────────────────────────────

// Zakazchikda «Приглашения» — bu uning loyihalariga kelgan arizalar
// (GET /customer/applications). Alohida «yuborilgan takliflar» ro'yxati
// backendda yo'q — faqat `POST /customer/invites`.
export function customerApplications(p) {
    return customerApi.applications({ ...page(p), status: status(p.status) })
}

export function performerApplications(p) {
    return performerApi.applications({ ...page(p), status: status(p.status) })
}

// ── Kartochkalarga moslashtirish ────────────────────────────────────────────

// Eski `ProjectCard` maydonlari: { title, city, fee, startDate, cover, company }
export function toProjectCard(item) {
    if (!item) return null
    // `/performer/applications` arizani beradi, ichida loyiha bo'lishi mumkin.
    const p = item.project || item
    return {
        id: p.id,
        slug: p.id,
        title: p.title || '',
        city: p.city || '',
        fee: p.fee_from ?? p.budget ?? null,
        startDate: p.shoot_date || null,
        cover: p.cover_url || null,
        company: p.owner ? { name: fullName(p.owner) } : null,
        status: mapStatus(item.status || p.status),
        responsesCount: p.responses_count ?? null,
    }
}

// Eski `ExecutorCard` maydonlari: { name, city, age, height, price, cover }
export function toExecutorCard(item) {
    if (!item) return null
    const user = item.user || item
    return {
        id: user.id || item.id,
        slug: user.id || item.id,
        name: item.title || fullName(user),
        city: user.city || item.city || '',
        age: item.age ?? null,
        height: item.height_cm ?? null,
        price: item.price_from ?? null,
        cover: item.logo_url || user.logo_url || null,
        category: item.specialty || user.performer_specialty || '',
    }
}

// Eski `VenueCard` maydonlari: { name, city, area, pricePerHour, cover }
export function toVenueCard(item) {
    if (!item) return null
    return {
        id: item.id,
        slug: item.id,
        name: item.name || '',
        city: item.city || '',
        area: item.area_m2 != null ? Number(item.area_m2) : null,
        pricePerHour: item.price_from ?? null,
        cover: item.cover_url || null,
    }
}

// Eski `ReviewCard` maydonlari: { author:{name,avatar}, rating, text, createdAt }
export function toReviewCard(item) {
    if (!item) return null
    const author = item.author || {}
    return {
        id: item.id,
        author: { name: fullName(author) || 'Пользователь', avatar: author.logo_url || null },
        rating: item.rating ?? null,
        text: item.body || item.text || '',
        createdAt: item.created_at || null,
        projectTitle: item.project_title || item.project?.title || '',
    }
}

// «18 июля» ko'rinishidagi sana — kartochkalarda ishlatilmasa ham, ro'yxat
// sahifalarida qulay (eski `formatDate` ISO kutadi, shuning uchun re-export).
export { shootDate }
