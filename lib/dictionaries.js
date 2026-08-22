// ─────────────────────────────────────────────────────────────────────────────
// Filtr lug'atlari — GET /site/dictionaries.
//
// Javob: { work_directions, categories, project_types, categories_photographer,
//          categories_videographer, project_types_videographer, venue_types,
//          suitable_for } — har biri [{ value, label }].
//
// Lug'at butun sayt bo'ylab bitta va deyarli o'zgarmaydi, shuning uchun modul
// darajasida bir marta so'raladi va keshlanadi: nechta katalog ochilishidan
// qat'i nazar, tarmoqqa bitta so'rov ketadi.
//
// Bu faylda hook yo'q — adapterlar (server tomonida ham ishlaydi) shu yerdan
// `dictLabel` ni oladi. React hooki `lib/use-dictionaries.js` da.
// ─────────────────────────────────────────────────────────────────────────────

import * as site from '@/lib/api/site'

const EMPTY = {}

// Bitta slug turli bo'limlarda turlicha yoziladi:
//   wedding    → «Свадьба» (проекты) · «Свадебный» (фотографы)
//   video      → «Видео» (проекты) · «Видеосъёмка» (тип проекта)
//   commercial → «Коммерческая» (модели) · «Коммерческая съёмка» (видеографы)
//   content    → «Контент» (видеографы) · «Съёмка контента» (площадки)
// Shuning uchun yorliqlar bo'lim kesimida saqlanadi, `labels` esa bo'lim
// noma'lum bo'lgan joylar uchun umumiy zaxira.
const byKey = new Map()
const labels = new Map()

let cache = null
let inflight = null
const listeners = new Set()

export function getDictionaries() {
    return cache || EMPTY
}

export function subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
}

function apply(data) {
    cache = data || EMPTY
    for (const [key, list] of Object.entries(cache)) {
        if (!Array.isArray(list)) continue
        const map = new Map()
        for (const o of list) {
            if (!o?.value || !o?.label) continue
            map.set(o.value, o.label)
            if (!labels.has(o.value)) labels.set(o.value, o.label)
        }
        byKey.set(key, map)
    }
    listeners.forEach((fn) => fn(cache))
    return cache
}

export function loadDictionaries() {
    if (cache) return Promise.resolve(cache)
    if (!inflight) {
        inflight = site
            .dictionaries()
            .then(apply)
            // Lug'at kelmasa — statik variantlar ishlatiladi, katalog buzilmaydi.
            .catch(() => apply(EMPTY))
            .finally(() => {
                inflight = null
            })
    }
    return inflight
}

// ── Yorliqlar ───────────────────────────────────────────────────────────────
// Backend javoblarida slug keladi («fashion», «loft», «music_clip»), UI'da esa
// ruscha yozuv kerak. Asosiy manba — lug'at; u hali yuklanmagan bo'lsa (birinchi
// render, SSR) quyidagi zaxira ro'yxat ishlaydi, shunda teg hech qachon xom
// slug ko'rinishida chiqmaydi. Tuzilishi lug'at bilan bir xil — bo'lim kesimida.
const FALLBACK = {
    work_directions: {
        fashion: 'Фэшн',
        commercial: 'Коммерческая',
        catalog: 'Каталог',
        advertising: 'Реклама',
    },
    categories: {
        fashion: 'Фэшн',
        beauty: 'Бьюти',
        catalog: 'Каталог',
        sport: 'Спорт',
        video: 'Видео',
        wedding: 'Свадьба',
    },
    project_types: {
        photo: 'Фотосъёмка',
        video: 'Видеосъёмка',
        show: 'Показ',
    },
    categories_photographer: {
        wedding: 'Свадебный',
        portrait: 'Портрет',
        advertising: 'Реклама',
        commercial: 'Коммерческая',
        fashion: 'Фэшн',
    },
    categories_videographer: {
        clips: 'Клипы',
        advertising: 'Реклама',
        cinema: 'Кино',
        interview: 'Интервью',
        commercial: 'Коммерческая съёмка',
        content: 'Контент',
    },
    project_types_videographer: {
        video: 'Видеосъёмка',
        music_clip: 'Музыкальный клип',
        reportage: 'Репортаж',
        image: 'Имиджевый ролик',
    },
    venue_types: {
        studio: 'Фотостудия',
        loft: 'Лофт',
        interior: 'Интерьерная студия',
        cyclorama: 'Циклорама',
        terrace: 'Терраса',
        grunge: 'Гранж',
        penthouse: 'Пентхаус',
        industrial: 'Индустриал',
        daylight: 'Дневной свет',
        roof: 'Крыша',
    },
    suitable_for: {
        photo: 'Фотосъёмка',
        video: 'Видеосъёмка',
        content: 'Съёмка контента',
        event: 'Мероприятие',
    },
}

// Bo'lim ko'rsatilmagan joylar uchun tekis zaxira — lug'atdagi tartibda
// birinchi uchragan yozuv g'olib (`labels` bilan bir xil mantiq).
const FLAT_FALLBACK = {}
for (const group of Object.values(FALLBACK)) {
    for (const [value, label] of Object.entries(group)) {
        if (!(value in FLAT_FALLBACK)) FLAT_FALLBACK[value] = label
    }
}

// Ijrochining ixtisosiga qarab qaysi bo'limdan yorliq olinishi.
// `work_directions` maydonida fotografda «portrait», videografda «clips»
// keladi — ya'ni maydon bitta, taksonomiya uchta.
export function performerDictKey(specialty) {
    if (specialty === 'photographer') return 'categories_photographer'
    if (specialty === 'videographer') return 'categories_videographer'
    return 'work_directions'
}

export function dictLabel(value, key) {
    if (!value) return ''
    if (key) {
        const scoped = byKey.get(key)?.get(value) || FALLBACK[key]?.[value]
        if (scoped) return scoped
    }
    return labels.get(value) || FLAT_FALLBACK[value] || value
}

// Takrorlar olib tashlanadi: bir yozuvda bir teg ikki marta uchrasa
// kartochkada bir xil chip ikki marta chiqmasin.
export function dictLabels(list, key) {
    return [...new Set((list || []).map((v) => dictLabel(v, key)).filter(Boolean))]
}

// `FILTER_FIELDS` dagi statik variantlarni lug'atdagilar bilan almashtiradi.
// Maydonga `dict: 'venue_types'` yozilgan bo'lsa — o'sha ro'yxat olinadi.
// Birinchi element («Все площадки» kabi) o'z joyida qoladi.
export function withDictionary(fields, dict) {
    if (!dict || !Object.keys(dict).length) return fields
    return fields.map((field) => {
        const list = field.dict && dict[field.dict]
        if (!Array.isArray(list) || !list.length) return field
        const [placeholder] = field.options || []
        return { ...field, options: [placeholder, ...list].filter(Boolean) }
    })
}
