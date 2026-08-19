// ─────────────────────────────────────────────────────────────────────────────
// Anketa sahifasining statik kontenti.
// Figma: desktop 129:5247, mobil 360:24036.
//
// Backend ulanganda `MODEL` obyekti `/executors/{slug}/` javobi bilan
// almashtiriladi — maydon nomlari o'sha holicha qoladi.
// ─────────────────────────────────────────────────────────────────────────────

import { MODEL_IMAGE } from '@/components/models/models-data'

export { MODEL_IMAGE }

// Galereya — Figma'da 6 ta eskiz, oxirgisining ostida «yana» strelkasi.
// Suratlar Figma 265:13865 dan olingan (to'rt xil kadr navbat bilan takrorlanadi).
const GALLERY = [
    MODEL_IMAGE,
    '/img/models/[slug]/model-2.jpg',
    '/img/models/[slug]/model-3.jpg',
    '/img/models/[slug]/model-4.jpg',
]
const PHOTOS = Array.from({ length: 6 }, (_, i) => GALLERY[i % GALLERY.length])

export const MODEL = {
    slug: 'katerina-zhuravleva',
    name: 'Катерина Журавлева',
    age: 24,
    height: 170,
    weight: 55,
    city: 'Санкт-Петербург',
    photos: PHOTOS,
    tags: ['Реклама', 'Каталог', 'Коммерческая', 'Клипы', 'Показы'],
    about:
        'Профессиональная модель с опытом работы в fashion-, рекламных и коммерческих съёмках. ' +
        'Принимала участие в фотосессиях для брендов, каталогов, рекламных кампаний и творческих ' +
        'проектов. Быстро адаптируется к различным образам, уверенно работает перед камерой и легко ' +
        'взаимодействует с командой на съёмочной площадке. Ответственно подходит к каждому проекту ' +
        'и открыта к новым предложениям о сотрудничестве.',

    // «Опыт работы» — 4 ta plitka (Figma 129:5792)
    stats: [
        { value: '4', label: 'Года опыта' },
        { value: '120+', label: 'Съёмок' },
        { value: '30+', label: 'Брендов' },
        { value: '15', label: 'Проектов' },
    ],

    // «Параметры» — ikki ustunga bo'linadi (Figma 129:6246)
    params: [
        ['Рост', '170 см'],
        ['Вес', '55 кг'],
        ['Грудь', '84 см'],
        ['Талия', '61 см'],
        ['Бёдра', '90 см'],
        ['Размер одежды', 'S (42)'],
        ['Размер обуви', '38'],
        ['Цвет волос', 'Тёмно-русый'],
        ['Цвет глаз', 'Карие'],
        ['Загранпаспорт', 'Есть'],
        ['Выезд в другие города', 'Да'],
    ],

    // «Стоимость» (Figma 129:6375)
    prices: [
        ['Съёмка', 'от 7 000 ₽'],
        ['Почасовая работа', 'от 3 000 ₽ / час'],
        ['TFP', 'По договорённости'],
    ],

    // «Опыт участия в проектах» (Figma 129:7019)
    projects: [
        {
            year: '2026',
            project: 'Рекламная кампания нового бренда одежды',
            brand: 'LIME',
            role: 'Главная модель',
        },
        {
            year: '2025',
            project: 'Каталог весенней коллекции',
            brand: 'Love Republic',
            role: 'Модель каталога',
        },
        {
            year: '2025',
            project: 'Музыкальный клип «Название»',
            brand: 'Артист / режиссёр',
            role: 'Главная роль',
        },
        {
            year: '2024',
            project: 'Fashion-показ',
            brand: 'Московская неделя моды',
            role: 'Подиумная модель',
        },
    ],

    rating: '4,6',
}

// ── Портфолио (Figma 129:6342 — tablar, 129:6374 — setka) ───────────────────
export const PORTFOLIO_TABS = [
    { key: 'all', label: 'Все', count: 33 },
    { key: 'photo', label: 'Фотосессии', count: 8 },
    { key: 'ads', label: 'Реклама', count: 6 },
    { key: 'shows', label: 'Показы', count: 3 },
    { key: 'clips', label: 'Клипы', count: 5 },
    { key: 'catalog', label: 'Каталоги', count: 4 },
    { key: 'cinema', label: 'Кино', count: 7 },
]

// Har bir tab uchun rasmlar — galereyadagi to'rt kadr navbat bilan takrorlanadi.
export const PORTFOLIO_ITEMS = PORTFOLIO_TABS.reduce((acc, tab) => {
    acc[tab.key] = Array.from({ length: tab.count }, (_, i) => ({
        id: `${tab.key}-${i}`,
        image: GALLERY[i % GALLERY.length],
    }))
    return acc
}, {})

// Bir marta ko'rsatiladigan rasmlar soni (Figma'da 4×4 = 16).
export const PORTFOLIO_STEP = 16

// ── Отзывы (Figma 343:13233) ────────────────────────────────────────────────
const REVIEW_TEXTS = [
    {
        author: 'Анна Смирнова',
        text: 'Отлично справилась с задачей. Быстро влилась в процесс, уверенно работала перед камерой и выполнила все пожелания команды.',
    },
    {
        author: 'LUMEN Agency',
        text: 'Очень приятно работать. Все договорённости были соблюдены, модель отлично взаимодействовала с командой.',
    },
    {
        author: 'Дмитрий Волков',
        text: 'Ответственная и пунктуальная. Быстро адаптировалась к задачам на площадке и отлично проявила себя во время всей съёмки.',
    },
]

export const REVIEWS = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    ...REVIEW_TEXTS[i % REVIEW_TEXTS.length],
    rating: 5,
    date: '23.04.2026',
}))

export const REVIEWS_STEP = 6
