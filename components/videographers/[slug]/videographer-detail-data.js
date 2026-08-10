// ─────────────────────────────────────────────────────────────────────────────
// Videograf anketasining statik kontenti.
// Figma: desktop 136:7645, mobil 366:17914.
//
// Barcha matnlar Figma'dan aynan olingan. Backend ulanganda `VIDEOGRAPHER`
// obyekti `/executors/{slug}/` javobi bilan almashtiriladi — maydon nomlari
// o'sha holicha qoladi.
// ─────────────────────────────────────────────────────────────────────────────

import { VIDEOGRAPHER_IMAGE } from '@/components/videographers/videographers-data'

export { VIDEOGRAPHER_IMAGE }

export const VIDEOGRAPHER = {
    slug: 'ilya-voronov',
    name: 'Илья Воронов',
    age: 24,
    experienceYears: 4,
    cases: 45,
    city: 'Санкт-Петербург',
    photo: VIDEOGRAPHER_IMAGE,
    // Figma 136:7705
    tags: ['Клип', 'Реклама', 'Кино', 'Коммерческая съёмка', 'Интервью'],
    // Figma 136:7714
    about:
        'Профессиональный видеограф с опытом создания рекламных, коммерческих и имиджевых ' +
        'видеороликов. Работает над проектами полного цикла: от разработки идеи и съёмки до ' +
        'монтажа, цветокоррекции и финальной подготовки материалов. Создаёт качественный ' +
        'видеоконтент для брендов, бизнеса, мероприятий и социальных сетей.',
    // «Опыт работы» — 4 ta plitka (Figma 136:7717)
    stats: [
        { value: '5', label: 'Года опыта' },
        { value: '45', label: 'Кейсов' },
        { value: '48+', label: 'Брендов' },
        { value: '120+', label: 'Видеороликов' },
    ],
    // «Информация» — ikki ustun, 4 + 5 (Figma 136:7739 / 136:7752)
    info: [
        [
            ['Специализация', 'Рекламная, коммерческая'],
            ['Опыт', '5 года'],
            ['Город', 'Санкт-Петербург'],
            ['Выезд в другие города', 'Да'],
        ],
        [
            ['Монтаж видео', 'Да'],
            ['Цветокоррекция', 'Да'],
            ['Съёмка с дрона', 'Да'],
            ['Работа по договору', 'Да'],
            ['Загранпаспорт', 'Есть'],
        ],
    ],
    // «Стоимость» — Figma 136:7768
    prices: [
        ['Индивидуальная съёмка', 'от 8 000 ₽'],
        ['Коммерческая съёмка', 'от 15 000 ₽'],
        ['Монтаж видео', 'от 3 500 ₽ / час'],
        ['Почасовая работа', 'от 12 000 ₽'],
        ['Съёмка с дроном', 'от 2 500 ₽'],
    ],
    // «Опыт в проектах» — Figma 136:7787
    projects: [
        {
            year: '2026',
            project: 'Рекламная кампания нового бренда одежды',
            brand: 'LIME',
            role: 'Видеограф',
        },
        {
            year: '2025',
            project: 'Имиджевый ролик',
            brand: 'Газпром',
            role: 'Оператор-постановщик',
        },
        {
            year: '2025',
            project: 'Презентационный фильм',
            brand: 'Сбер',
            role: 'Видеограф',
        },
        {
            year: '2024',
            project: 'Музыкальный клип',
            brand: 'Исполнитель',
            role: 'Режиссёр монтажа',
        },
    ],
    rating: '4,6',
}

// ── Портфолио (Figma 136:7816) ──────────────────────────────────────────────
export const PORTFOLIO_TABS = [
    { key: 'all', label: 'Все', count: 45 },
    { key: 'advertising', label: 'Реклама', count: 8 },
    { key: 'clips', label: 'Клипы', count: 6 },
    { key: 'interview', label: 'Интервью', count: 3 },
    { key: 'cinema', label: 'Кино', count: 4 },
    { key: 'commercial', label: 'Коммерческая съёмка', count: 7 },
]

export const PORTFOLIO_ITEMS = PORTFOLIO_TABS.reduce((acc, tab) => {
    acc[tab.key] = Array.from({ length: tab.count }, (_, i) => ({
        id: `${tab.key}-${i}`,
        image: VIDEOGRAPHER_IMAGE,
    }))
    return acc
}, {})

// Figma'da bir marta 16 ta ish ko'rsatiladi (4 qator × 4 ustun).
export const PORTFOLIO_STEP = 16

// ── Отзывы (Figma 320:8711) ─────────────────────────────────────────────────
const REVIEW_TEXTS = [
    {
        author: 'Анна Смирнова',
        text: 'Видеограф отлично передал атмосферу съёмки. Монтаж выполнен качественно, все пожелания были учтены, готовый материал получили в срок.',
    },
    {
        author: 'LUMEN Agency',
        text: 'Профессиональный подход на всех этапах работы. Видео получилось динамичным, качественным и полностью соответствовало поставленной задаче.',
    },
    {
        author: 'Дмитрий Волков',
        text: 'Работать было легко и комфортно. Видеограф грамотно организовал процесс съёмки, быстро подготовил финальный ролик и всегда был на связи.',
    },
]

export const REVIEWS = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    ...REVIEW_TEXTS[i % REVIEW_TEXTS.length],
    rating: 5,
    date: '23.04.2026',
}))

export const REVIEWS_STEP = 6
