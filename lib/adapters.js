// ─────────────────────────────────────────────────────────────────────────────
// Backend javoblarini komponentlar kutayotgan shaklga o'giradi.
//
// Nega adapter: butun UI Figma bo'yicha `name / age / height / image / tags`
// kabi maydonlar bilan yozilgan. Backend esa `title / height_cm / logo_url`
// beradi. Adapter shu ikkisining o'rtasida turadi — komponentlarga tegmasdan
// backend maydonlari o'zgarsa, faqat shu fayl tuzatiladi.
//
// Maydon nomlari `backend/*.md` va jonli API javoblari bo'yicha aniqlangan.
// ─────────────────────────────────────────────────────────────────────────────

import { EXECUTOR_TYPES } from '@/lib/roles'
import { PLACEHOLDER } from '@/lib/assets'
import { dictLabel, dictLabels, performerDictKey } from '@/lib/dictionaries'

// ── Umumiy yordamchilar ─────────────────────────────────────────────────────

export function fullName(user) {
    if (!user) return ''
    return (
        user.agency_name ||
        user.company_name ||
        [user.first_name, user.last_name].filter(Boolean).join(' ') ||
        user.representative_name ||
        user.title ||
        ''
    )
}

// ── Yo'nalishlar va turlar ──────────────────────────────────────────────────
// Backend `work_directions`, `project_types`, `venue_type`, `suitable_for` va
// `category` ni slug bilan beradi («fashion», «loft», «music_clip»). Ruscha
// yozuv GET /site/dictionaries dan olinadi — `lib/dictionaries.js`.
//
// Ikkinchi argument — lug'atning qaysi bo'limi. Bitta slug bo'limga qarab
// turlicha yoziladi («wedding» → «Свадьба» / «Свадебный»), shuning uchun
// har bir chaqiruvda manba bo'lim ko'rsatiladi.
const directions = dictLabels

// `birth_date` («1999-04-12») dan to'liq yoshni hisoblaydi.
export function ageFromBirthDate(birthDate) {
    if (!birthDate) return null
    const d = new Date(birthDate)
    if (Number.isNaN(d.getTime())) return null
    const now = new Date()
    let age = now.getFullYear() - d.getFullYear()
    const m = now.getMonth() - d.getMonth()
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1
    return age >= 0 && age < 120 ? age : null
}

// Media ro'yxatidan URL'lar. `album` berilsa faqat o'sha albom.
export function mediaUrls(media = [], album) {
    return (media || [])
        .filter((m) => (album ? m.album === album : true))
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((m) => m.url)
        .filter(Boolean)
}

// Kartochka rasmi: backend bo'sh qaytarsa joy egallovchi beriladi —
// `next/image` `src` ni majburiy talab qiladi.
function cover(...candidates) {
    return candidates.find((c) => typeof c === 'string' && c.length > 0) || PLACEHOLDER
}

// Galereya: bo'sh bo'lsa ham kamida bitta element qaytadi.
function gallery(list) {
    const clean = (list || []).filter((u) => typeof u === 'string' && u.length > 0)
    return clean.length ? clean : [PLACEHOLDER]
}

// Sanani Figma'dagi ko'rinishga keltiradi: «2026-07-18» → «18 июля».
const MONTHS_GEN = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]

export function shootDate(iso) {
    if (!iso) return ''
    const parts = String(iso).slice(0, 10).split('-')
    if (parts.length !== 3) return String(iso)
    const month = MONTHS_GEN[Number(parts[1]) - 1]
    return month ? `${Number(parts[2])} ${month}` : String(iso)
}

// Sahifalash meta'si — `{ page, page_size, total, pages }`.
export function meta(data) {
    const m = data?.meta || {}
    return {
        page: m.page || 1,
        pageSize: m.page_size || 0,
        total: m.total || 0,
        pages: m.pages || 1,
    }
}

// ── Ijrochi (модель / фотограф / видеограф) ─────────────────────────────────

// Katalog kartochkasi. Manba: GET /site/performers → items[]
export function performerCard(item) {
    if (!item) return null
    const cardDictKey = performerDictKey(item.specialty || item.entity_type)
    return {
        id: item.id,
        // SEO uchun manzillar slug bo'yicha: /models/mariya-volkova-0b8cc430.
        // Backend detal ruchkalarida UUID ham, slug ham ishlaydi.
        slug: item.slug || item.id,
        name: item.title || fullName(item),
        specialty: item.specialty || item.entity_type,
        age: item.age ?? null,
        height: item.height_cm ?? null,
        weight: item.weight_kg ?? null,
        city: item.city || '',
        gender: item.gender || null,
        experience: item.years_experience ?? null,
        canTravel: item.can_travel ?? null,
        image: cover(item.logo_url),
        gallery: gallery([item.logo_url]),
        tags: directions(item.work_directions || item.tags, cardDictKey),
        pricePerHour: item.price_from ?? null,
        rating: item.rating_avg ?? null,
        isFavorite: item.is_favorite === true,
        likes: item.likes_count ?? 0,
        views: item.views_count ?? 0,
        status: item.status,
        isHidden: item.is_hidden,
    }
}

// «Параметры» plitkasi — modelda to'liq, foto/videografda qisqaroq.
function performerParams(profile = {}, specialty) {
    const rows = []
    const push = (label, value, suffix = '') => {
        if (value === null || value === undefined || value === '') return
        rows.push([label, `${value}${suffix}`])
    }

    if (specialty === EXECUTOR_TYPES.MODEL) {
        push('Рост', profile.height_cm, ' см')
        push('Вес', profile.weight_kg, ' кг')
        push('Грудь', profile.chest_cm, ' см')
        push('Талия', profile.waist_cm, ' см')
        push('Бёдра', profile.hips_cm, ' см')
        push('Размер одежды', profile.clothing_size)
        push('Размер обуви', profile.shoe_size)
        push('Цвет волос', profile.hair_color)
        push('Длина волос', profile.hair_length)
        push('Цвет глаз', profile.eye_color)
        push('Тип лица', profile.face_type)
        push('Тату / пирсинг', profile.tattoos_piercing)
    } else {
        push('Специализация', profile.specialization)
        push('Обработка фото', bool(profile.photo_processing))
        push('Срочный монтаж', bool(profile.urgent_editing))
        push('Видеомонтаж', bool(profile.video_editing))
        push('Цветокоррекция', bool(profile.color_correction))
        push('Съёмка с дрона', bool(profile.drone_filming))
        push('Работа с ИИ', bool(profile.ai_work))
        push('Работа по договору', bool(profile.works_by_contract))
        push('Занятость с', profile.employment_from)
    }

    push('Языки', (profile.languages || []).join(', '))
    push('Загранпаспорт', bool(profile.has_foreign_passport))
    push('Выезд в другие города', bool(profile.can_travel))
    return rows
}

function bool(value) {
    if (value === true) return 'Да'
    if (value === false) return 'Нет'
    return ''
}

// «Опыт работы» — 4 ta plitka (Figma 129:5792). Ixtisoslikka qarab o'zgaradi.
function performerStats(profile = {}, specialty) {
    const pick = (value, label) =>
        value === null || value === undefined ? null : { value: String(value), label }

    const base =
        specialty === EXECUTOR_TYPES.MODEL
            ? [
                  pick(profile.years_experience, 'Года опыта'),
                  pick(profile.shoots_count, 'Съёмок'),
                  pick(profile.brands_count, 'Брендов'),
                  pick(profile.projects_count, 'Проектов'),
              ]
            : [
                  pick(profile.years_experience, 'Года опыта'),
                  pick(profile.shoots_count, 'Съёмок'),
                  pick(profile.cases_count ?? profile.brands_count, 'Кейсов'),
                  pick(profile.videos_count ?? profile.projects_count, 'Проектов'),
              ]

    return base.filter(Boolean)
}

// Qatorlarni ikki ustunga teng bo'ladi (Figma'da 4+4 yoki 6+5).
function splitColumns(rows) {
    const half = Math.ceil(rows.length / 2)
    return [rows.slice(0, half), rows.slice(half)]
}

// Anketa sahifasi. Manba: GET /site/performers/{id}
export function performerDetail(data) {
    if (!data) return null
    const user = data.user || {}
    const profile = data.profile || {}
    const specialty = user.performer_specialty || data.specialty
    const photos = mediaUrls(data.media)

    return {
        id: user.id || data.id,
        slug: user.slug || data.slug || user.id || data.id,
        name: fullName(user),
        specialty,
        age: ageFromBirthDate(data.birth_date),
        height: profile.height_cm ?? null,
        weight: profile.weight_kg ?? null,
        city: user.city || '',
        about: data.about || '',
        // Asosiy surat birinchi bo'lib turadi, keyin portfolio kadrlari.
        photos: gallery([data.logo_url, ...photos]),
        // Fotograf/videograf anketasida galereya o'rniga bitta surat (129:7059).
        photo: cover(data.logo_url, photos[0]),
        // Fotograf/videograf meta qatori (Figma 129:7414 / 136:7580).
        experienceYears: profile.years_experience ?? null,
        shoots: profile.shoots_count ?? null,
        cases: profile.cases_count ?? profile.brands_count ?? null,
        tags: directions(profile.work_directions, performerDictKey(specialty)),
        stats: performerStats(profile, specialty),
        params: performerParams(profile, specialty),
        // «Информация» — ikki ustun (Figma 136:7626 / 136:7627).
        info: splitColumns(performerParams(profile, specialty)),
        prices: (data.prices || []).map((p) => [p.service_type, p.price_label]),
        projects: (data.experience || []).map((e) => ({
            year: String(e.year ?? ''),
            project: e.project_name || '',
            brand: e.brand || '',
            role: e.role_title || '',
        })),
        media: data.media || [],
        reviews: (data.reviews || []).map(reviewItem),
        rating: data.rating_avg ?? null,
        related: (data.related || []).map(performerCard),
        status: user.status,
        agencyId: data.agency_id || null,
    }
}

// ── Maydon (площадка) ───────────────────────────────────────────────────────

export function venueCard(item) {
    if (!item) return null
    return {
        id: item.id,
        slug: item.slug || item.id,
        name: item.name || '',
        area: numeric(item.area_m2),
        capacity: item.capacity ?? null,
        pricePerHour: item.price_from ?? null,
        city: item.city || '',
        type: dictLabel(item.venue_type || item.category, 'venue_types'),
        image: cover(item.cover_url),
        gallery: gallery([item.cover_url]),
        likes: item.likes_count ?? 0,
        views: item.views_count ?? 0,
        status: item.status,
        ownerName:
            item.company_name ||
            item.agency_name ||
            [item.first_name, item.last_name].filter(Boolean).join(' '),
        ownerLogo: item.owner_logo || null,
    }
}

// Backend o'nlik sonlarni matn qilib beradi («60.00») — ortiqcha nollar olib
// tashlanadi: «60.00» → «60», «4.50» → «4,5» (ruscha vergul).
function trimNumber(value) {
    if (value === null || value === undefined || value === '') return value
    const n = Number(value)
    if (Number.isNaN(n)) return value
    return String(n).replace('.', ',')
}

// «120» / «120 м²» kabi matndan sonni ajratadi.
function numeric(value) {
    if (value === null || value === undefined || value === '') return null
    const n = parseFloat(String(value).replace(',', '.'))
    return Number.isNaN(n) ? null : n
}

export function venueDetail(data) {
    if (!data) return null
    const photos = mediaUrls(data.media)
    const yes = (v) => v === true

    // «Характеристики» — faqat to'ldirilgan maydonlar chiqadi.
    const params = []
    const push = (label, value, suffix = '') => {
        if (value === null || value === undefined || value === '') return
        params.push([label, `${value}${suffix}`])
    }
    push('Площадь', trimNumber(data.area_m2), ' м²')
    push('Высота потолков', trimNumber(data.ceiling_height_m), ' м')
    push('Вместимость', data.capacity, ' чел.')
    push('Количество залов', data.halls_count)
    push('Этаж', data.floor)
    push('Окна', data.windows_count)
    push('Минимальная аренда', data.min_rental_label)
    push('Метро', data.metro)

    const amenities = [
        yes(data.natural_light) && 'Естественный свет',
        yes(data.wifi) && 'Wi-Fi',
        yes(data.air_conditioning) && 'Кондиционер',
        yes(data.dressing_room) && 'Гримёрная',
        yes(data.elevator) && 'Лифт',
        yes(data.parking) && 'Парковка',
        yes(data.freight_entrance) && 'Грузовой вход',
    ].filter(Boolean)

    return {
        id: data.id,
        slug: data.slug || data.id,
        name: data.name || '',
        type: dictLabel(data.venue_type || data.category, 'venue_types'),
        about: data.description || '',
        city: data.city || '',
        address: data.address || '',
        metro: data.metro || '',
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        area: numeric(data.area_m2),
        capacity: data.capacity ?? null,
        pricePerHour: data.price_from ?? null,
        photos: gallery([data.cover_url, ...photos]),
        tags: data.tags || [],
        suitableFor: directions(data.suitable_for, 'suitable_for'),
        amenities,
        params,
        // «Характеристики» ikki ustunda (Figma 141:8709).
        specs: splitColumns(params),
        equipment: data.equipment_description || '',
        rules: data.rules || '',
        prices: (data.prices || []).map((p) => [p.rental_type, p.price_label]),
        media: data.media || [],
        reviews: (data.reviews || []).map(reviewItem),
        rating: data.rating_avg ?? null,
        owner: ownerCard(data.owner, data.owner_stats),
        ownerName: fullName(data.owner),
        status: data.status,
    }
}

// Kartochka pastidagi egasi bloki (Figma 138:8470 / 151:11963).
function ownerCard(owner, stats) {
    if (!owner) return null
    const count = stats?.venues ?? stats?.projects
    return {
        id: owner.id,
        name: fullName(owner),
        note: count != null ? `${count} ${plural(count, 'публикация', 'публикации', 'публикаций')}` : '',
        logo: cover(owner.logo_url),
        href: `/persons/${owner.id}`,
    }
}

// Ruscha son qo'shimchasi (lib/format.js dagi bilan bir xil qoida).
function plural(count, one, few, many) {
    const n = Math.abs(count) % 100
    const n1 = n % 10
    if (n > 10 && n < 20) return many
    if (n1 > 1 && n1 < 5) return few
    if (n1 === 1) return one
    return many
}

// ── Loyiha (проект) ─────────────────────────────────────────────────────────

export function projectCard(item) {
    if (!item) return null
    return {
        id: item.id,
        slug: item.slug || item.id,
        title: item.title || '',
        name: item.title || '',
        description: item.description || '',
        need: specialtyLabel(item.performer_specialty, item.model_count),
        city: item.city || '',
        date: shootDate(item.shoot_date),
        dateISO: item.shoot_date || null,
        price: item.fee_from_label || item.budget_label || item.hourly_rate_label || '',
        image: cover(item.cover_url),
        gallery: gallery([item.cover_url]),
        responses: item.responses_count ?? 0,
        views: item.views_count ?? 0,
        likes: item.likes_count ?? 0,
        status: item.status,
        requirements: dictLabels(item.requirement_tags, 'project_types'),
        ownerId: item.owner_id,
        ownerName:
            item.company_name ||
            item.agency_name ||
            [item.first_name, item.last_name].filter(Boolean).join(' '),
        ownerLogo: item.owner_logo || null,
    }
}

const SPECIALTY_LABEL = {
    [EXECUTOR_TYPES.MODEL]: ['модель', 'модели', 'моделей'],
    [EXECUTOR_TYPES.PHOTOGRAPHER]: ['фотограф', 'фотографа', 'фотографов'],
    [EXECUTOR_TYPES.VIDEOGRAPHER]: ['видеограф', 'видеографа', 'видеографов'],
}

// «Требуется 2 модели» — Figma 353:20916.
function specialtyLabel(specialty, count) {
    const forms = SPECIALTY_LABEL[specialty]
    if (!forms) return ''
    const n = count || 1
    const mod100 = n % 100
    const mod10 = n % 10
    let word = forms[2]
    if (mod100 < 11 || mod100 > 14) {
        if (mod10 === 1) word = forms[0]
        else if (mod10 >= 2 && mod10 <= 4) word = forms[1]
    }
    return `Требуется ${n} ${word}`
}

export function projectDetail(data) {
    if (!data) return null
    const card = projectCard(data)

    // «Кого ищем» — Figma 151:11943.
    const requirements = [...(data.requirement_tags || [])]
    if (data.gender) requirements.unshift(genderLabel(data.gender))
    if (data.age_min || data.age_max) {
        requirements.push(`${data.age_min ?? ''}–${data.age_max ?? ''} лет`)
    }
    if (data.height_min || data.height_max) {
        requirements.push(`${data.height_min ?? ''}–${data.height_max ?? ''} см`)
    }
    if (data.clothing_size) requirements.push(`Размер одежды ${data.clothing_size}`)

    return {
        ...card,
        details: data.details || '',
        tasks: data.tasks || '',
        requirementsText: data.requirements_text || '',
        conditionsText: data.conditions_text || '',
        requirements: requirements.filter(Boolean),
        address: data.address || '',
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        timeFrom: data.time_from || '',
        timeTo: data.time_to || '',
        // «Время: 10:00 – 18:00» (Figma 145:11090).
        time: [data.time_from, data.time_to].filter(Boolean).join(' – '),
        // «Подробнее о проекте» — kirish matni va ro'yxatli bloklar (145:10996).
        detailsBlocks: {
            intro: data.details || data.description || '',
            blocks: [
                textBlock('Что предстоит делать', data.tasks),
                textBlock('Требования', data.requirements_text),
                textBlock('Условия', data.conditions_text),
            ].filter(Boolean),
        },
        duration: data.duration_label || '',
        hourlyRate: data.hourly_rate_label || '',
        budget: data.budget_label || '',
        venueName: data.venue_name || '',
        owner: data.owner || null,
        ownerStats: data.owner_stats || null,
        // «О проекте» matni va zakazchik bloki (Figma 151:11963).
        about: data.description || '',
        company: projectOwner(data.owner, data.owner_stats),
        related: (data.related || []).map(projectCard),
        moderationComment: data.moderation_comment || '',
    }
}

// Erkin matnni ro'yxatga aylantiradi: har bir qator — alohida band.
// Backend `tasks` / `requirements_text` / `conditions_text` ni shu ko'rinishda
// beradi (Swagger «Customer: Проекты»).
function textBlock(title, text) {
    if (!text || !String(text).trim()) return null
    const items = String(text)
        .split(/\r?\n|;/)
        .map((line) => line.replace(/^[-\u2022\s]+/, '').trim())
        .filter(Boolean)
    return items.length ? { title, items } : null
}

// Loyiha egasining kartochkasi (Figma 151:11963).
function projectOwner(owner, stats) {
    if (!owner) return null
    const count = stats?.projects
    return {
        id: owner.id,
        name: fullName(owner),
        note: owner.city || '',
        more: count != null ? `Ещё ${count} ${plural(count, 'проект', 'проекта', 'проектов')}` : '',
        logo: cover(owner.logo_url),
        href: `/persons/${owner.id}`,
    }
}

function genderLabel(gender) {
    if (gender === 'male') return 'Мужской'
    if (gender === 'female') return 'Женский'
    return ''
}

// ── Agentlik ────────────────────────────────────────────────────────────────

export function agencyCard(item) {
    if (!item) return null
    return {
        id: item.id,
        slug: item.slug || item.id,
        name: item.title || item.agency_name || '',
        kind: item.about || '',
        city: item.city || '',
        executors: item.performers_count ?? item.stats?.performers ?? null,
        image: cover(item.logo_url),
        status: item.status,
    }
}

export function agencyDetail(data) {
    if (!data) return null
    const user = data.user || {}
    return {
        id: user.id || data.id,
        slug: user.slug || data.slug || user.id || data.id,
        name: user.agency_name || fullName(user),
        representative: user.representative_name || '',
        city: user.city || '',
        about: data.about || '',
        qualification: data.qualification || '',
        sphere: data.sphere_of_activity || '',
        website: data.website || '',
        phone: data.contact_phone || user.phone || '',
        email: user.email || '',
        image: cover(data.logo_url),
        logo: cover(data.logo_url),
        // «Модельное и креативное агентство» qatori (Figma 164:13650).
        kind: data.sphere_of_activity || data.qualification || '',
        links: data.contact_links || [],
        statsRaw: data.stats || {},
        // Kartochkadagi 4 ta plitka (Figma 164:13720).
        stats: agencyStats(data.stats),
        executors: (data.performers || []).map(agencyExecutorItem),
        // «Исполнители» bo'limi tablari — sonlar `stats` dan (Figma 164:13904).
        executorTabs: agencyExecutorTabs(data.stats),
        reviews: (data.reviews || []).map(reviewItem),
        rating: data.rating_avg ?? null,
        status: user.status,
    }
}

// Agentlik kartochkasidagi 4 ta plitka.
function agencyStats(stats = {}) {
    const rows = [
        [stats.performers, 'Исполнителей'],
        [stats.models, 'Моделей'],
        [stats.photographers, 'Фотографов'],
        [stats.videographers, 'Видеографов'],
    ]
    return rows
        .filter(([value]) => value !== null && value !== undefined)
        .map(([value, label]) => ({ value: String(value), label }))
}

// «Исполнители» bo'limi tablari.
function agencyExecutorTabs(stats = {}) {
    return [
        { key: 'all', label: 'Все', count: stats.performers ?? 0 },
        { key: 'model', label: 'Модели', count: stats.models ?? 0 },
        { key: 'photographer', label: 'Фотографы', count: stats.photographers ?? 0 },
        { key: 'videographer', label: 'Видеографы', count: stats.videographers ?? 0 },
    ]
}

const SPECIALTY_TITLE = {
    model: 'Модель',
    photographer: 'Фотограф',
    videographer: 'Видеограф',
}

const SPECIALTY_PATH = {
    model: '/models',
    photographer: '/photographers',
    videographer: '/videographers',
}

// Agentlik sahifasidagi ijrochi kartochkasi (Figma 164:13938).
function agencyExecutorItem(item) {
    if (!item) return null
    const chips = []
    if (item.specialty === 'model') {
        if (item.age != null) chips.push(`${item.age} лет`)
        if (item.height_cm != null) chips.push(`${item.height_cm} см`)
    } else {
        if (item.years_experience != null) chips.push(`${item.years_experience} лет опыта`)
        if (item.shoots_count != null) chips.push(`${item.shoots_count} съёмок`)
    }

    return {
        id: item.id,
        kind: item.specialty,
        type: SPECIALTY_TITLE[item.specialty] || '',
        name: [item.first_name, item.last_name].filter(Boolean).join(' '),
        href: `${SPECIALTY_PATH[item.specialty] || '/models'}/${item.id}`,
        image: cover(item.logo_url),
        chips,
    }
}

// Agentlik ichidagi ijrochi kartochkasi (katalog kartochkasidan farq qiladi:
// bu yerda `first_name`/`last_name` alohida keladi).
export function agencyPerformerCard(item) {
    if (!item) return null
    return {
        id: item.id,
        slug: item.slug || item.id,
        name: [item.first_name, item.last_name].filter(Boolean).join(' '),
        specialty: item.specialty,
        city: item.city || '',
        height: item.height_cm ?? null,
        weight: item.weight_kg ?? null,
        age: item.age ?? null,
        image: cover(item.logo_url),
        status: item.status,
        isHidden: item.is_hidden,
        tags: directions(item.work_directions, performerDictKey(item.specialty)),
    }
}

// ── Sharh ───────────────────────────────────────────────────────────────────

export function reviewItem(r) {
    if (!r) return null
    return {
        id: r.id,
        author: [r.author_first_name, r.author_last_name].filter(Boolean).join(' ') || 'Пользователь',
        authorId: r.author_id,
        authorType: authorTypeLabel(r.author_type, r.author_agency),
        rating: r.rating ?? 0,
        text: r.body || '',
        body: r.body || '',
        // Figma'da sana «18 июля» ko'rinishida (343:13233).
        date: shootDate(r.created_at),
        dateISO: r.created_at,
        status: r.status,
    }
}

const AUTHOR_TYPE = {
    customer: 'Заказчик',
    performer: 'Исполнитель',
    agency: 'Агентство',
    model: 'Модель',
    photographer: 'Фотограф',
    videographer: 'Видеограф',
}

function authorTypeLabel(type, agencyName) {
    if (agencyName) return agencyName
    return AUTHOR_TYPE[type] || ''
}

// ── FAQ / kontaktlar / bildirishnoma / chat ─────────────────────────────────

export function faqItem(f) {
    if (!f) return null
    return { id: f.id, q: f.question, a: f.answer, status: f.status, order: f.sort_order }
}

export function contactsInfo(data) {
    if (!data) return null
    return {
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        city: data.city || '',
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        socials: (data.socials || []).map((s, i) => ({
            key: s.title || `social-${i}`,
            label: s.title || '',
            href: s.url,
        })),
    }
}

export function notificationItem(n) {
    if (!n) return null
    return {
        id: n.id,
        type: n.ntype || n.type,
        title: n.title || '',
        text: n.body || n.message || '',
        date: n.created_at,
        isRead: n.is_read ?? n.isRead ?? false,
        link: n.link || null,
    }
}

export function chatListItem(c) {
    if (!c) return null
    const name =
        c.agency_name || [c.first_name, c.last_name].filter(Boolean).join(' ') || 'Диалог'
    return {
        id: c.id,
        peerId: c.peer_id,
        peerRole: c.peer_role,
        specialty: c.specialty || null,
        // Chat komponentlari `companion` obyektini kutadi.
        companion: {
            id: c.peer_id,
            name,
            avatar: c.logo_url || null,
            role: AUTHOR_TYPE[c.specialty] || AUTHOR_TYPE[c.peer_role] || '',
        },
        name,
        avatar: c.logo_url || null,
        // Ro'yxatda oxirgi xabar matn ko'rinishida keladi.
        lastMessage: c.last_message ? { text: c.last_message, createdAt: c.last_at } : null,
        lastAt: c.last_at || null,
        unreadCount: c.unread_count ?? 0,
    }
}

export function chatMessage(m, currentUserId) {
    if (!m) return null
    const authorId = m.sender_id || m.author_id
    return {
        id: m.id,
        authorId,
        authorName: [m.first_name, m.last_name].filter(Boolean).join(' '),
        text: m.body || '',
        attachment: m.attachment_url || null,
        createdAt: m.created_at,
        projectId: m.project_id || null,
        own: currentUserId ? String(authorId) === String(currentUserId) : false,
    }
}

// ── Portfolio (albomlar bo'yicha tablar) ────────────────────────────────────

// Media ro'yxatidan «Портфолио» bloki uchun tablar va rasmlar yasaydi
// (Figma 129:6342 — tablar, 129:6374 — setka).
//   tabs  → [{ key, label, count }]  — birinchisi doim «Все»
//   items → { [key]: [{ id, image }] }
export function portfolioFromMedia(media = []) {
    const list = (media || []).filter((m) => m?.url)
    const albums = []
    for (const m of list) {
        const name = m.album || 'Без альбома'
        if (!albums.includes(name)) albums.push(name)
    }

    const items = { all: list.map((m) => ({ id: m.id, image: m.url })) }
    for (const name of albums) {
        items[name] = list
            .filter((m) => (m.album || 'Без альбома') === name)
            .map((m) => ({ id: m.id, image: m.url }))
    }

    const tabs = [
        { key: 'all', label: 'Все', count: items.all.length },
        ...albums.map((name) => ({ key: name, label: name, count: items[name].length })),
    ]

    return { tabs, items }
}

// ── Sevimlilar ──────────────────────────────────────────────────────────────

// Backend `target_type`: user | venue | project. Ijrochi va agentlik ikkalasi
// ham `user`, farqi `role` maydonida (backend/site.md → GET /site/favorites).
export const FAVORITE_TARGET = {
    executor: 'user',
    agency: 'user',
    venue: 'venue',
    project: 'project',
}

export function favoriteItem(f) {
    if (!f) return null

    let type = 'project'
    let href = `/projects/${f.target_id}`

    if (f.target_type === 'user') {
        if (f.role === 'agency') {
            type = 'agency'
            href = `/agencies/${f.target_id}`
        } else {
            type = 'executor'
            href = `${SPECIALTY_PATH[f.specialty] || '/models'}/${f.target_id}`
        }
    } else if (f.target_type === 'venue') {
        type = 'venue'
        href = `/venues/${f.target_id}`
    }

    return {
        // `favoriteId` — o'chirish uchun (DELETE /site/favorites/{favorite_id}).
        favoriteId: f.id,
        type,
        id: f.target_id,
        slug: f.target_id,
        title: f.title || '',
        name: f.title || '',
        image: cover(f.cover_url),
        href,
        specialty: f.specialty || null,
        city: f.venue_city || f.project_city || '',
        area: f.area_m2 ?? null,
        price: f.hourly_rate_label || '',
        date: shootDate(f.shoot_date),
    }
}

// ── Kabinet: статусы ────────────────────────────────────────────────────────

// Backend statuslari → `components/admin/ui/admin-statuses.js` dagi kalitlar.
const STATUS_MAP = {
    active: 'active',
    published: 'active',
    draft: 'draft',
    pending_review: 'moderation',
    moderation: 'moderation',
    rejected: 'rejected',
    archived: 'archive',
    hidden: 'paused',
    blocked: 'rejected',
    completed: 'done',
    done: 'done',
    paused: 'paused',
}

export function mapStatus(status) {
    return STATUS_MAP[status] || status || 'draft'
}

// ── Kabinet: заказчик ───────────────────────────────────────────────────────

// GET /customer/cabinet → sahifadagi profil kartochkasi (Figma 208:4747).
export function customerProfile(data) {
    if (!data) return null
    const user = data.user || {}
    const stats = data.stats || {}

    return {
        id: user.id,
        name:
            user.company_name ||
            [user.first_name, user.last_name].filter(Boolean).join(' ') ||
            'Профиль',
        note: user.customer_type === 'company' ? 'Компания' : '',
        city: user.city || '',
        logo: data.logo_url || null,
        about: data.about || 'Информация о компании пока не заполнена',
        phone: data.contact_phone || data.phone || user.phone || '',
        email: user.email || '',
        site: data.website || '',
        inn: data.inn || '',
        customerType: user.customer_type,
        // «Сфера деятельности» — Figma 338:16487 (backend javobi, 16-band).
        field: user.sphere_of_activity || '',
        representative: user.representative_name || '',
        // Tahrirlash oynasi uchun xom maydonlar.
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        companyName: user.company_name || '',
        stats: [
            { value: String(stats.projects ?? 0), label: 'Проектов' },
            { value: String(stats.venues ?? 0), label: 'Площадок' },
            { value: String(stats.responses ?? 0), label: 'Отклика' },
            { value: String(stats.new_requests ?? 0), label: 'Новые заявки' },
        ],
    }
}

// «Мои публикации» — loyihalar va maydonlar bitta ro'yxatda (Figma 208:4792).
export function publicationsFrom(data, { base = '/client' } = {}) {
    const projects = (data?.projects || []).map((p) => ({
        id: p.id,
        kind: 'projects',
        status: mapStatus(p.status),
        title: p.title || '',
        description: p.description || '',
        date: shootDate(p.shoot_date),
        city: p.city || '',
        price: p.fee_from_label || p.budget_label || p.hourly_rate_label || '',
        image: cover(p.cover_url),
        comments: p.responses_count ?? 0,
        views: p.views_count ?? 0,
        href: `${base}/projects/${p.id}`,
        editHref: `${base}/projects/${p.id}/edit`,
        moderationComment: p.moderation_comment || '',
    }))

    const venues = (data?.venues || []).map((v) => ({
        id: v.id,
        kind: 'venues',
        status: mapStatus(v.status),
        title: v.name || '',
        description: v.description || '',
        date: shootDate(v.created_at),
        city: v.city || '',
        price: v.price_from != null ? pricePerHour(v.price_from) : '',
        image: cover(v.cover_url),
        comments: v.comments_count ?? 0,
        views: v.views_count ?? 0,
        href: `${base}/venues/${v.id}`,
        editHref: `${base}/venues/${v.id}/edit`,
        moderationComment: v.moderation_comment || '',
    }))

    return {
        items: [...projects, ...venues],
        tabs: [
            { key: 'projects', label: 'Проекты', count: projects.length },
            { key: 'venues', label: 'Площадки', count: venues.length },
        ],
    }
}

// «от 2 500 ₽/час» (Figma 120:1220).
function pricePerHour(value) {
    return `от ${new Intl.NumberFormat('ru-RU').format(value)} ₽/час`
}

// ── Kabinet: исполнитель ────────────────────────────────────────────────────

// GET /performer/cabinet — tuzilishi ochiq anketa bilan bir xil, ustiga
// kabinetga xos maydonlar qo'shiladi (backend/performer.md).
export function performerCabinet(data) {
    if (!data) return null
    const base = performerDetail(data)
    const sections = data.sections || {}

    return {
        ...base,
        // Backend `age` ni tayyor beradi; `birth_date` bo'sh bo'lsa shu ishlatiladi.
        age: base.age ?? data.age ?? null,
        rating: data.rating_avg ?? null,
        status: mapStatus(data.user?.status),
        rawStatus: data.user?.status,
        moderationComment: data.moderation_comment || '',
        isHidden: Boolean(data.is_hidden),
        wizard: data.wizard || { step: 1, needs_fill: true, can_submit: false },
        sections,
        // Anketa hech bo'lmasa bitta bo'limi to'ldirilganmi.
        filled: Boolean(
            sections.parameters || sections.prices || sections.experience || sections.portfolio,
        ),
        albums: data.albums || [],
        portfolioTotal: data.portfolio_total ?? 0,
        reviewsTotal: data.reviews_total ?? 0,
    }
}

// ── Kabinet: агентство ──────────────────────────────────────────────────────

// GET /agency/cabinet — ochiq agentlik profili bilan bir xil + kabinet menyusi.
export function agencyCabinet(data) {
    if (!data) return null
    const base = agencyDetail(data)
    return {
        ...base,
        phone: data.contact_phone || data.phone || data.user?.phone || '',
        executors: (data.performers || []).map((p) => ({
            ...agencyExecutorItem(p),
            status: mapStatus(p.status),
            isHidden: Boolean(p.is_hidden),
            href: `/agency/executors/${p.id}`,
            editHref: `/agency/executors/${p.id}/edit`,
        })),
    }
}

// ── Bosh sahifa: «Популярные исполнители» ───────────────────────────────────

// Figma 81:1926 — rol yorlig'i rangi ixtisoslikka qarab o'zgaradi.
const ROLE_CLASS = {
    model: 'bg-[rgba(200,164,107,0.5)]',
    photographer: 'bg-[rgba(107,188,200,0.3)]',
    videographer: 'bg-[rgba(150,200,107,0.3)]',
}

export function homeExecutorCard(item) {
    if (!item) return null
    const specialty = item.specialty || item.entity_type
    const tags = []
    if (specialty === EXECUTOR_TYPES.MODEL) {
        if (item.age != null) tags.push(`${item.age} лет`)
        if (item.height_cm != null) tags.push(`${item.height_cm} см`)
    } else {
        if (item.years_experience != null) tags.push(`${item.years_experience} лет опыта`)
        if (item.shoots_count != null) tags.push(`${item.shoots_count} съёмок`)
    }

    return {
        id: item.id,
        slug: item.slug || item.id,
        name: item.title || fullName(item),
        role: SPECIALTY_TITLE[specialty] || '',
        roleClass: ROLE_CLASS[specialty] || ROLE_CLASS.model,
        tags,
        href: `${SPECIALTY_PATH[specialty] || '/models'}/${item.id}`,
        image: cover(item.logo_url),
    }
}

// ── Adminka ─────────────────────────────────────────────────────────────────

const ENTITY_TITLE = {
    // Adminka ro'yxatlarida tur `entity_type` da keladi: zakazchiklarda
    // `individual` / `company`, ijrochilarda ixtisoslik.
    individual: 'Частное лицо',
    company: 'Компания',
    model: 'Модель',
    photographer: 'Фотограф',
    videographer: 'Видеограф',
    performer: 'Исполнитель',
    customer: 'Заказчик',
    agency: 'Агентство',
    project: 'Проект',
    venue: 'Площадка',
    user: 'Пользователь',
}

// Moderatsiya manbai → adminkadagi kartochka manzili.
const MODERATION_PATH = {
    user: '/admin/executors',
    project: '/admin/projects',
    venue: '/admin/venues',
}

function adminName(item) {
    return (
        item.title ||
        item.name ||
        item.agency_name ||
        item.company_name ||
        [item.first_name, item.last_name].filter(Boolean).join(' ') ||
        '—'
    )
}

// Rol/tur bo'yicha adminkadagi kartochka manzili.
function adminHref(item) {
    const id = item.id || item.user_id || item.entity_id
    if (item.role === 'agency' || item.entity_type === 'agency') return `/admin/agencies/${id}`
    if (item.role === 'customer' || item.entity_type === 'customer') return `/admin/clients/${id}`
    return `/admin/executors/${id}`
}

// GET /admin/dashboard → uchta blok (Figma 321:12629).
export function adminDashboard(data) {
    if (!data) return null
    const s = data.stats || {}

    return {
        stats: [
            { value: formatCount(s.moderation ?? s.pending ?? 0), label: 'На модерации' },
            { value: formatCount(s.users ?? 0), label: 'Пользователи' },
            { value: formatCount(s.projects ?? s.active_projects ?? 0), label: 'Активные проекты' },
            { value: formatCount(s.venues ?? 0), label: 'Площадки' },
        ],
        moderation: (data.latest_moderation || []).map((m) => ({
            id: m.entity_id || m.id,
            source: m.source || m.entity_type || 'user',
            name: adminName(m),
            type: ENTITY_TITLE[m.entity_type || m.source] || '—',
            email: m.email || '—',
            date: formatDateTimeRu(m.created_at),
            status: 'На модерации',
        })),
        users: (data.latest_users || []).map((u) => ({
            id: u.id,
            name: adminName(u),
            type: ENTITY_TITLE[u.entity_type || u.performer_specialty || u.role] || '—',
            email: u.email || '—',
            date: formatDateTimeRu(u.created_at),
            href: adminHref(u),
        })),
    }
}

// «2 300» — mingliklar ajratilgan holda (Figma 321:12700).
function formatCount(value) {
    return new Intl.NumberFormat('ru-RU').format(Number(value) || 0)
}

// «17.07.2026, 14:34»
export function formatDateTimeRu(value) {
    if (!value) return '—'
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

// Adminkadagi foydalanuvchilar ro'yxati (ijrochi / zakazchik / agentlik).
export function adminUserRow(item) {
    if (!item) return null
    return {
        id: item.id,
        name: adminName(item),
        type:
            ENTITY_TITLE[
                item.entity_type || item.performer_specialty || item.customer_type || item.role
            ] || '—',
        email: item.email || '—',
        phone: item.phone || '—',
        city: item.city || '—',
        date: formatDateTimeRu(item.created_at),
        status: mapStatus(item.status),
        isHidden: Boolean(item.is_hidden),
        href: adminHref(item),
        editHref: `${adminHref(item)}/edit`,
        image: cover(item.logo_url),
    }
}

// Adminkadagi loyihalar ro'yxati.
// Qator kartochkasi pastidagi egasi bloki (Figma 338:19284 / 340:11046).
// Ro'yxat javobida ega alohida obyekt bilan kelmaydi — tekis maydonlardan
// yig'iladi. Rasm har doim bo'lishi shart: `next/image` `src` siz yiqiladi.
function rowOwner(item) {
    const name =
        item.company_name ||
        item.agency_name ||
        [item.first_name, item.last_name].filter(Boolean).join(' ') ||
        'Пользователь'
    return {
        id: item.owner_id || null,
        name,
        logo: cover(item.owner_logo),
        note: item.company_name ? 'Компания' : item.agency_name ? 'Агентство' : 'Заказчик',
        projects: item.owner_projects_count ?? '',
    }
}

export function adminProjectRow(item) {
    if (!item) return null
    return {
        ...projectCard(item),
        about: item.description || item.details || '',
        comments: item.responses_count ?? 0,
        company: rowOwner(item),
        status: mapStatus(item.status),
        date: shootDate(item.shoot_date),
        createdAt: formatDateTimeRu(item.created_at),
        href: `/admin/projects/${item.id}`,
        editHref: `/admin/projects/${item.id}/edit`,
    }
}

// Adminkadagi maydonlar ro'yxati.
export function adminVenueRow(item) {
    if (!item) return null
    const card = venueCard(item)
    return {
        ...card,
        // Yangi maydon hali to'ldirilmagan bo'lishi mumkin (`name: ""`).
        name: card.name || 'Без названия',
        comments: item.comments_count ?? 0,
        company: rowOwner(item),
        status: mapStatus(item.status),
        createdAt: formatDateTimeRu(item.created_at),
        href: `/admin/venues/${item.id}`,
        editHref: `/admin/venues/${item.id}/edit`,
    }
}

// Moderatsiya navbati (Figma 343:12345).
export function adminModerationRow(item) {
    if (!item) return null
    const source = item.source || item.entity_type || 'user'
    const id = item.entity_id || item.id
    return {
        id,
        source,
        name: adminName(item),
        type: ENTITY_TITLE[item.entity_type || source] || '—',
        email: item.email || '—',
        date: formatDateTimeRu(item.created_at),
        status: 'На модерации',
        href: `${MODERATION_PATH[source] || '/admin/executors'}/${id}`,
        reviewHref: `/admin/moderation/${id}?source=${source}`,
    }
}

// Shikoyatlar (Figma 344:16561).
export function adminComplaintRow(item) {
    if (!item) return null
    return {
        id: item.id,
        author: adminName(item.author || {}) || item.author_name || '—',
        accused: item.accused_name || adminName(item.accused || {}) || '—',
        accusedId: item.accused_id,
        reason: item.reason || '—',
        text: item.body || '',
        date: formatDateTimeRu(item.created_at),
        status: item.status || 'new',
        conversationId: item.conversation_id,
        href: `/admin/complaints/${item.id}`,
    }
}

// Sayt FAQ'lari (Figma 438:19200).
export function adminFaqRow(item) {
    if (!item) return null
    return {
        id: item.id,
        pageType: item.page_type,
        question: item.question || '',
        answer: item.answer || '',
        status: item.status,
        author: item.author_name || '—',
        authorRole: item.author_role || '',
        date: formatDateTimeRu(item.created_at),
    }
}

// Adminkadagi sharh qatori (Figma 343:12626).
export function adminReviewRow(r) {
    if (!r) return null
    const base = reviewItem(r)
    const targetName =
        [r.target_first_name, r.target_last_name].filter(Boolean).join(' ') || 'Пользователь'

    return {
        ...base,
        // Adminkada holat `published | hidden` ko'rinishida.
        status: r.status || 'published',
        target: {
            id: r.target_id,
            name: targetName,
            role: AUTHOR_TYPE[r.target_specialty] || 'Исполнитель',
            image: cover(r.target_logo_url),
            href: `${SPECIALTY_PATH[r.target_specialty] || '/models'}/${r.target_id}`,
        },
    }
}

// ── Adminka: kartochka sahifalari ───────────────────────────────────────────

// Adminka anketasi — Figma «Анкета» 334:14442 / «Модерация → Анкета» 344:14840.
// Manba: GET /admin/performers/{id} (yoki GET /admin/moderation/user/{id}).
// Backend javobi ba'zan {user, profile, media…}, ba'zan tekis obyekt bo'lishi
// mumkin — ikkalasi ham qo'llab-quvvatlanadi.
export function adminExecutorProfile(data) {
    if (!data) return null
    const user = data.user || data
    const profile = data.profile || data.performer_profile || {}
    const specialty = user.performer_specialty || data.specialty
    const photos = mediaUrls(data.media)
    const shots = gallery([data.logo_url || user.logo_url, ...photos])
    const { tabs, items } = portfolioFromMedia(data.media)

    return {
        id: user.id || data.id,
        name: fullName(user) || user.email || '—',
        status: adminUserStatus(user),
        age: withUnit(ageFromBirthDate(data.birth_date || user.birth_date), ' лет'),
        height: withUnit(profile.height_cm, ' см'),
        weight: withUnit(profile.weight_kg, ' кг'),
        city: user.city || '',
        tags: directions(profile.work_directions, performerDictKey(specialty)),
        aboutTitle: specialty === 'model' ? 'О модели' : 'Об исполнителе',
        about: data.about || profile.about || '',
        gallery: shots,
        experience: performerStats(profile, specialty),
        params: performerParams(profile, specialty),
        prices: (data.prices || []).map((p) => [p.service_type, p.price_label]),
        works: (data.experience || []).map((e) => [
            String(e.year ?? ''),
            e.project_name || '',
            e.brand || '',
            e.role_title || '',
        ]),
        portfolioTabs: tabs,
        portfolio: (items.all || []).map((x) => x.image),
        portfolioItems: items,
        reviews: (data.reviews || []).map(reviewItem).filter(Boolean),
        specialty,
        email: user.email || '',
        phone: user.phone || '',
    }
}

// Adminka jadvallaridagi 4 ta holat: active | paused | blocked | moderation.
function adminUserStatus(user = {}) {
    const s = user.status
    if (s === 'blocked') return 'blocked'
    if (s === 'pending_review' || s === 'moderation') return 'moderation'
    if (s === 'hidden' || s === 'paused') return 'paused'
    return 'active'
}

function withUnit(value, suffix) {
    if (value === null || value === undefined || value === '') return ''
    return `${value}${suffix}`
}

// «Профиль компании / заказчика» — Figma 338:16386.
// Manba: GET /admin/customers/{id}.
export function adminCustomerProfile(data) {
    if (!data) return null
    const user = data.user || data
    const stats = data.stats || {}
    const isCompany = user.customer_type === 'company'

    return {
        id: user.id || data.id,
        name: isCompany ? user.company_name || fullName(user) : fullName(user) || user.email || '—',
        status: adminUserStatus(user),
        type: isCompany ? 'Компания' : 'Частное лицо',
        city: user.city || '',
        email: user.email || '',
        phone: user.phone || '',
        site: user.website || '',
        contact: user.representative_name || fullName(user),
        about: data.about || user.about || '',
        logo: cover(user.logo_url, data.logo_url) || null,
        // «Сфера деятельности» — Figma 338:16487.
        field: user.sphere_of_activity || '',
        registered: formatDateTimeRu(user.created_at),
        stats: [
            { value: formatCount(stats.projects), label: 'Проектов' },
            { value: formatCount(stats.venues), label: 'Площадок' },
            { value: formatCount(stats.responses), label: 'Отклика' },
            { value: formatCount(stats.new_requests), label: 'Новые заявки' },
        ],
        // «Публикации» — loyihalar va maydonlar ikkita tab.
        publicationTabs: publicationsFrom(data, { base: '/admin' }).tabs,
        publications: publicationsFrom(data, { base: '/admin' }).items,
    }
}

// «Профиль агентства» — Figma 341:17720. Manba: GET /admin/agencies/{id}.
export function adminAgencyProfile(data) {
    if (!data) return null
    const user = data.user || data
    const stats = data.stats || {}

    return {
        id: user.id || data.id,
        name: user.agency_name || fullName(user) || '—',
        status: adminUserStatus(user),
        city: user.city || '',
        email: user.email || '',
        phone: user.phone || '',
        site: user.website || '',
        contact: user.representative_name || '',
        about: data.about || user.about || '',
        logo: cover(user.logo_url, data.logo_url) || null,
        // Swagger: AgencyWriteRequest → `sphere_of_activity`.
        field: user.sphere_of_activity || data.sphere_of_activity || '',
        registered: formatDateTimeRu(user.created_at),
        stats: agencyStats(stats),
        executorTabs: agencyExecutorTabs(stats),
        executors: (data.performers || []).map(agencyExecutorItem).filter(Boolean),
    }
}

// Adminka loyiha kartochkasi — Figma «Проект» 338:19624.
// Manba: GET /admin/projects/{id}.
export function adminProjectDetail(data) {
    const p = projectDetail(data)
    if (!p) return null
    const owner = data.owner || data.customer || {}
    return {
        ...p,
        ownerName:
            owner.company_name || fullName(owner) || p.owner?.name || '—',
        ownerId: owner.id || data.customer_id || null,
        ownerHref: owner.id ? `/admin/clients/${owner.id}` : null,
        createdAt: formatDateTimeRu(data.created_at),
    }
}

// Moderatsiya kartochkasi — manba GET /admin/moderation/{source}/{id}.
// `source`: user | project | venue.
export function adminModerationDetail(source, data) {
    if (!data) return null
    if (source === 'user') return { kind: 'user', profile: adminExecutorProfile(data) }
    if (source === 'venue') return { kind: 'venue', venue: venueDetail(data) }
    return { kind: 'project', project: adminProjectDetail(data) }
}
