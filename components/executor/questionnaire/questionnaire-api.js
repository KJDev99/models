import * as performerApi from '@/lib/api/performer'
import * as agencyApi from '@/lib/api/agency'
import * as site from '@/lib/api/site'

// ─────────────────────────────────────────────────────────────────────────────
// Anketa ustasi ikki joyda ishlatiladi:
//   · «Исполнитель» kabineti — o'z anketasi (PUT /performer/profile …)
//   · «Агентство» kabineti — «Добавить исполнителя» (POST /agency/performers …)
//
// Formaning o'zi bir xil, faqat endpointlar farq qiladi. Shu fayl ikkala
// to'plamni beradi va formadagi qiymatlarni backend maydonlariga o'giradi.
// ─────────────────────────────────────────────────────────────────────────────

// «170 см» / «55 кг» / «4» → 170 / 55 / 4. Bo'sh bo'lsa `undefined`.
export function num(value) {
    if (value === null || value === undefined || value === '') return undefined
    const n = parseInt(String(value).replace(/[^\d-]/g, ''), 10)
    return Number.isNaN(n) ? undefined : n
}

// «Да» / «Есть» → true, «Нет» → false, tanlanmagan bo'lsa `undefined`.
export function yesNo(value) {
    if (value === 'yes') return true
    if (value === 'no') return false
    return undefined
}

function text(value) {
    const v = String(value ?? '').trim()
    return v || undefined
}

// Ijrochi turiga qarab «Опыт работы» to'rt maydoni boshqa nomlarga tushadi
// (Figma 260:13032 / 265:16600 / 265:17228).
function experienceCounters(type, values) {
    const [a, b, c, d] = values.map(num)
    if (type === 'videographer') {
        return {
            years_experience: a,
            cases_count: b,
            brands_count: c,
            videos_count: d,
        }
    }
    return {
        years_experience: a,
        shoots_count: b,
        brands_count: c,
        projects_count: d,
    }
}

// «Информация» bo'limidagi tanlovlar nomi bo'yicha keladi — backend maydoniga
// moslash jadvali (Figma 265:16600 / 265:17228).
const INFO_FIELD = {
    'Обработка фотографий': 'photo_processing',
    'Срочная обработка': 'urgent_editing',
    'Монтаж видео': 'video_editing',
    Цветокоррекция: 'color_correction',
    'Съёмка с дрона': 'drone_filming',
    'Работа по договору': 'works_by_contract',
    Загранпаспорт: 'has_foreign_passport',
}

// Forma holatini `PUT /performer/profile` tanasiga aylantiradi.
export function profileBody({ type, form, experience, info, prices }) {
    const body = {
        performer_specialty: type,
        first_name: form.firstName,
        last_name: form.lastName,
        city: form.city,
        about: text(form.about),
        work_directions: form.directions?.length ? form.directions : undefined,
        ...experienceCounters(type, experience),
        has_foreign_passport: yesNo(form.passport),
        can_travel: yesNo(form.travel),
        specialization: text(form.specialization),
        // Agentlik oqimida to'ldiriladi; o'z anketasida bo'sh — yuborilmaydi.
        email: text(form.email),
        phone: text(form.phone),
        prices: (prices || [])
            .filter((p) => p.kind?.trim() && p.value?.trim())
            .map((p) => ({ service_type: p.kind.trim(), price_label: p.value.trim() })),
    }

    if (type === 'model') {
        Object.assign(body, {
            height_cm: num(form.height),
            weight_kg: num(form.weight),
            chest_cm: num(form.chest),
            waist_cm: num(form.waist),
            hips_cm: num(form.hips),
            clothing_size: text(form.clothes),
            shoe_size: text(form.shoes),
            hair_color: text(form.hair),
            eye_color: text(form.eyes),
        })
    }

    // Фотограф / видеограф tanlovlari.
    for (const [label, value] of Object.entries(info || {})) {
        const field = INFO_FIELD[label]
        if (field) body[field] = yesNo(value)
    }

    return body
}

// «Опыт участия в проектах» — bo'sh qatorlar yuborilmaydi.
export function experienceItems(projects) {
    return (projects || [])
        .filter((p) => p.title?.trim())
        .map((p) => ({
            year: num(p.year),
            project_name: p.title.trim(),
            brand: text(p.brand),
            role_title: text(p.role),
        }))
}

// ── Endpoint to'plamlari ────────────────────────────────────────────────────

// O'z anketasi (Исполнитель kabineti).
export const performerActions = {
    load: () => performerApi.cabinet(),
    saveProfile: (body, asDraft) => performerApi.saveProfile(body, { asDraft }),
    saveExperience: (items) => performerApi.saveExperience(items),
    setPhoto: (url) => performerApi.setPhoto(url),
    addPhoto: (url, album) => performerApi.addPortfolio({ url, album }),
    submit: () => performerApi.submit(),
    upload: (file) => site.upload(file),
}

// Agentlik anketa qo'shadi. Avval yozuv yaratiladi, keyingi qadamlar
// yaratilgan `id` bilan ishlaydi (backend/agency.md).
export function agencyActions() {
    let createdId = null

    return {
        load: async () => null,
        saveProfile: async (body) => {
            if (createdId) {
                return agencyApi.updatePerformer(createdId, body)
            }
            const created = await agencyApi.createPerformer(body)
            createdId = created?.id || created?.user?.id || null
            return created
        },
        // Agentlik uchun alohida «опыт» endpointi yo'q — tajriba anketa
        // tanasining bir qismi sifatida yuboriladi.
        saveExperience: async (items) => {
            if (!createdId) return null
            return agencyApi.updatePerformer(createdId, { experience: items })
        },
        setPhoto: async (url) => {
            if (!createdId) return null
            return agencyApi.addPerformerPhoto(createdId, { url })
        },
        addPhoto: async (url, album) => {
            if (!createdId) return null
            return agencyApi.addPerformerPhoto(createdId, { url, album })
        },
        // Agentlik qo'shgan anketa serverda darhol `pending_review` bo'ladi.
        submit: async () => null,
        upload: (file) => site.upload(file),
        get id() {
            return createdId
        },
    }
}

// ── Kabinet javobidan formaga ───────────────────────────────────────────────

// «170» → «170 см» (select qiymatlari birlik bilan yoziladi).
function unit(value, u) {
    return value === null || value === undefined ? '' : `${value} ${u}`
}

function bool(value) {
    if (value === true) return 'yes'
    if (value === false) return 'no'
    return ''
}

// GET /performer/cabinet javobini forma boshlang'ich qiymatlariga o'giradi.
export function toFormValues(data) {
    if (!data) return null
    const user = data.user || {}
    const profile = data.profile || {}
    const type = user.performer_specialty || 'model'

    const counters =
        type === 'videographer'
            ? [profile.years_experience, profile.cases_count, profile.brands_count, profile.videos_count]
            : [profile.years_experience, profile.shoots_count, profile.brands_count, profile.projects_count]

    // Albomlar bo'yicha guruhlangan media.
    const byAlbum = new Map()
    for (const m of data.media || []) {
        const name = m.album || ''
        if (!byAlbum.has(name)) byAlbum.set(name, [])
        byAlbum.get(name).push({ url: m.url, id: m.id })
    }
    const albums = [...byAlbum.entries()].map(([name, photos]) => ({ name, photos }))

    return {
        type,
        form: {
            email: user.email || '',
        phone: user.phone || '',
        firstName: user.first_name || '',
            lastName: user.last_name || '',
            city: user.city || '',
            about: data.about || '',
            directions: profile.work_directions || [],
            height: unit(profile.height_cm, 'см'),
            weight: unit(profile.weight_kg, 'кг'),
            chest: unit(profile.chest_cm, 'см'),
            waist: unit(profile.waist_cm, 'см'),
            hips: unit(profile.hips_cm, 'см'),
            clothes: profile.clothing_size || '',
            shoes: profile.shoe_size || '',
            hair: profile.hair_color || '',
            eyes: profile.eye_color || '',
            passport: bool(profile.has_foreign_passport),
            travel: bool(profile.can_travel),
            specialization: profile.specialization || '',
        },
        experience: counters.map((v) => (v === null || v === undefined ? '' : String(v))),
        info: {
            'Обработка фотографий': bool(profile.photo_processing),
            'Срочная обработка': bool(profile.urgent_editing),
            'Монтаж видео': bool(profile.video_editing),
            Цветокоррекция: bool(profile.color_correction),
            'Съёмка с дрона': bool(profile.drone_filming),
            'Работа по договору': bool(profile.works_by_contract),
            Загранпаспорт: bool(profile.has_foreign_passport),
        },
        prices: (data.prices || []).length
            ? data.prices.map((p) => ({ kind: p.service_type || '', value: p.price_label || '' }))
            : [{ kind: '', value: '' }],
        projects: (data.experience || []).length
            ? data.experience.map((e) => ({
                  year: e.year ? String(e.year) : '',
                  title: e.project_name || '',
                  brand: e.brand || '',
                  role: e.role_title || '',
              }))
            : [
                  { year: '', title: '', brand: '', role: '' },
                  { year: '', title: '', brand: '', role: '' },
              ],
        mainPhoto: data.logo_url ? { url: data.logo_url } : null,
        albums: albums.length ? albums : [{ name: '', photos: [] }],
    }
}
