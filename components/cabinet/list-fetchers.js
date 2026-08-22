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
// `new` va `declined` — «Приглашения» tab'lari; `GET /customer/applications`
// faqat `pending|accepted|rejected` ni biladi va noma'lum qiymatda 500 beradi
// (hisobot №2, «Отклики»), shuning uchun ular shu yerda o'giriladi.
const API_STATUS = {
    moderation: 'pending_review',
    hidden: 'hidden',
    completed: 'completed',
    archive: 'archived',
    active: 'active',
    rejected: 'rejected',
    draft: 'draft',
    new: 'pending',
    declined: 'rejected',
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

export function agencyProjects(p) {
    return agencyApi.projects({ ...page(p), status: status(p.status) })
}

// «Приглашения» — GET /agency/invites.
export function agencyInvites(p) {
    return agencyApi.invites({ ...page(p), status: status(p.status) })
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

// «Приглашения» — GET /performer/invites.
export function performerInvites(p) {
    return performerApi.invites({ ...page(p), status: status(p.status) })
}

// ── Kartochkalarga moslashtirish ────────────────────────────────────────────

// Loyiha egasining nomi ro'yxat javoblarida tekis maydonlar bilan keladi
// (`company_name` / `agency_name` / `first_name` + `last_name`), ichma-ich
// `owner` obyekti yo'q — kartochkaga esa `{ name }` kerak.
function ownerName(p) {
    const name =
        p.company_name ||
        p.agency_name ||
        [p.first_name, p.last_name].filter(Boolean).join(' ')
    return name ? { name } : null
}

// `ProjectCard` maydonlari: { title, city, price, startDate, cover, company }.
//
// Bitta moslashtiruvchi ikki xil javobga tushadi:
//   loyiha  — `/customer/projects`, `/agency/projects` (title, city, slug…)
//   ariza   — `/customer/applications`, `/performer/applications`
//             (`project_title`, `project_city`, `performer_city`)
// Shuning uchun har maydon uchun ikkala nom ham tekshiriladi.
//
// Narxni backend tayyor satr qilib beradi (`fee_from_label` → «от 45 000 ₽»),
// raqamli `price_from` esa hamma ruchkada ham yo'q — shuning uchun satr asosiy.
export function toProjectCard(item) {
    if (!item) return null
    const p = item.project || item
    return {
        // Arizada `id` — arizaning o'zi, havola esa loyihaga olib borishi kerak.
        id: p.id,
        slug: p.slug || p.project_slug || p.project_id || p.id,
        title: p.title || p.project_title || '',
        city: p.city || p.project_city || p.performer_city || '',
        price: p.fee_from_label || p.budget_label || '',
        startDate: p.shoot_date || null,
        cover: p.cover_url || p.performer_logo || null,
        company: ownerName(p),
        status: mapStatus(item.status || p.status),
        responsesCount: p.responses_count ?? null,
    }
}

// «Приглашения» elementi — taklifning o'zi, ichida loyihaning qisqa ma'lumoti.
// Manba: GET /performer/invites yoki GET /agency/invites.
export function toInviteCard(item) {
    if (!item) return null
    return {
        // `id` — taklifning identifikatori (accept/reject shu bo'yicha),
        // havola esa loyihaga olib boradi.
        id: item.id,
        slug: item.project_slug || item.project_id,
        title: item.title || '',
        city: item.city || '',
        cover: item.cover_url || null,
        // Sana va narx taklif elementiga qo'shildi (backend javobi, 22.08).
        price: item.fee_from_label || item.budget_label || '',
        startDate: item.shoot_date || null,
        company: item.first_name || item.last_name
            ? { name: [item.first_name, item.last_name].filter(Boolean).join(' ') }
            : null,
        inviteStatus: item.status || 'pending',
        status: mapStatus(item.status),
        specialty: item.specialty || null,
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
