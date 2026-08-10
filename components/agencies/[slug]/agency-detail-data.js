// ─────────────────────────────────────────────────────────────────────────────
// Agentlik sahifasining statik kontenti.
// Figma: desktop 164:13583, mobil 377:14960.
//
// Barcha matnlar Figma'dan aynan olingan. Backend ulanganda `AGENCY` obyekti
// `/agencies/{slug}/` javobi bilan almashtiriladi — maydon nomlari o'sha
// holicha qoladi.
// ─────────────────────────────────────────────────────────────────────────────

import { AGENCY_IMAGE } from '@/components/agencies/agencies-data'

export { AGENCY_IMAGE }

export const AGENCY = {
    slug: 'lumen-agency',
    name: 'LUMEN AGENCY',
    kind: 'Модельное и креативное агентство',
    city: 'Санкт-Петербург',
    logo: AGENCY_IMAGE,
    // Figma 164:13655
    about:
        'LUMEN Agency — агентство, представляющее моделей, фотографов и видеографов для ' +
        'рекламных, коммерческих и творческих проектов. Подбираем специалистов под задачи ' +
        'заказчика и сопровождаем проекты на всех этапах сотрудничества.',
    // Контакты — Figma 164:14276
    phone: '+ 7 (000)-000-00-00',
    email: 'po4ta@mail.ru',
    // Raqamli plitkalar — Figma 164:13840
    stats: [
        { value: '68', label: 'Исполнителей' },
        { value: '48', label: 'Моделей' },
        { value: '12', label: 'Фотографов' },
        { value: '8', label: 'Видеографов' },
    ],
}

// ── Исполнители (Figma 164:13904) ───────────────────────────────────────────
// Har bir tur uchun namuna anketa: chip, havola va ikkita parametr.
const TEMPLATES = {
    models: {
        type: 'Модель',
        base: '/models',
        image: '/img/models/model.jpg',
        names: ['Катерина Журавлева', 'София Лебедева'],
        slugs: ['katerina-zhuravleva', 'sofia-lebedeva'],
        chips: ['24 лет', '170 см'],
    },
    photographers: {
        type: 'Фотограф',
        base: '/photographers',
        image: '/img/photographers/photographer.jpg',
        names: ['Алексей Миронов'],
        slugs: ['aleksey-mironov'],
        chips: ['5 лет опыта', '120 съёмок'],
    },
    videographers: {
        type: 'Видеограф',
        base: '/videographers',
        image: '/img/videographers/videographer.jpg',
        names: ['Илья Воронов'],
        slugs: ['ilya-voronov'],
        chips: ['4 года опыта', '45 кейсов'],
    },
}

function makeExecutors(kind, count, offset) {
    const t = TEMPLATES[kind]
    return Array.from({ length: count }, (_, i) => {
        const n = i % t.names.length
        return {
            id: offset + i + 1,
            kind,
            type: t.type,
            name: t.names[n],
            href: `${t.base}/${t.slugs[n]}-${i + 1}`,
            image: t.image,
            chips: t.chips,
        }
    })
}

// Figma'dagi hisoblar: 48 model, 12 fotograf, 8 videograf — jami 68.
const POOLS = [
    makeExecutors('models', 48, 0),
    makeExecutors('photographers', 12, 48),
    makeExecutors('videographers', 8, 60),
]

// Figma 164:13988 da setka «Модель · Фотограф · Видеограф · Модель» tartibida
// aralashib turadi — shuning uchun turlarni navbat bilan olamiz.
export const EXECUTORS = (() => {
    const list = []
    const rest = POOLS.map((pool) => [...pool])
    while (rest.some((pool) => pool.length)) {
        rest.forEach((pool) => {
            if (pool.length) list.push(pool.shift())
        })
    }
    return list
})()

export const EXECUTOR_TABS = [
    { key: 'all', label: 'Все', count: EXECUTORS.length },
    { key: 'models', label: 'Модели', count: 48 },
    { key: 'photographers', label: 'Фотографы', count: 12 },
    { key: 'videographers', label: 'Видеографы', count: 8 },
]

// Figma'da bir marta 16 ta anketa ko'rsatiladi (4 qator × 4 ustun).
export const EXECUTORS_STEP = 16

export const EXECUTORS_SORT_OPTIONS = [
    { value: 'popular', label: 'Сначала популярные' },
    { value: 'new', label: 'Сначала новые' },
    { value: 'name-asc', label: 'По имени: А–Я' },
]
