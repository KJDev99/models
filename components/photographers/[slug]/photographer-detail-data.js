// ─────────────────────────────────────────────────────────────────────────────
// Fotograf anketasining statik kontenti.
// Figma: desktop 129:7022, mobil 364:15567.
//
// Barcha matnlar Figma'dan aynan olingan. Backend ulanganda `PHOTOGRAPHER`
// obyekti `/executors/{slug}/` javobi bilan almashtiriladi — maydon nomlari
// o'sha holicha qoladi.
// ─────────────────────────────────────────────────────────────────────────────

import { PHOTOGRAPHER_IMAGE } from '@/components/photographers/photographers-data'

export { PHOTOGRAPHER_IMAGE }

export const PHOTOGRAPHER = {
    slug: 'aleksey-mironov',
    name: 'Алексей Миронов',
    age: 24,
    experienceYears: 5,
    shoots: 120,
    city: 'Санкт-Петербург',
    photo: PHOTOGRAPHER_IMAGE,
    // Figma 129:7414
    tags: ['Свадебный', 'Портрет', 'Коммерческая'],
    // Figma 129:7113
    about:
        'Профессиональный фотограф с опытом работы в fashion-, рекламной и коммерческой съёмке. ' +
        'Создаёт визуальный контент для брендов, каталогов, рекламных кампаний и digital-проектов. ' +
        'Уверенно работает как в студии, так и на выездных съёмках, сопровождая проект от подготовки ' +
        'до финальной обработки материала.',
    // «Опыт работы» — 4 ta plitka (Figma 129:7116)
    stats: [
        { value: '5', label: 'Года опыта' },
        { value: '120+', label: 'Съёмок' },
        { value: '48+', label: 'Брендов' },
        { value: '92', label: 'Проектов' },
    ],
    // «Информация» — ikki ustun, 4 + 4 (Figma 136:7626 / 136:7627)
    info: [
        [
            ['Специализация', 'Fashion, Beauty'],
            ['Опыт', '5 лет'],
            ['Город', 'Санкт-Петербург'],
            ['Загранпаспорт', 'Есть'],
        ],
        [
            ['Выезд в другие города', 'Да'],
            ['Обработка фотографий', 'Да'],
            ['Срочная обработка', 'Да'],
            ['Работа по договору', 'Да'],
        ],
    ],
    // «Стоимость» — Figma 129:7171
    prices: [
        ['Индивидуальная съёмка', 'от 8 000 ₽'],
        ['Коммерческая съёмка', 'от 15 000 ₽'],
        ['Почасовая работа', 'от 3 500 ₽ / час'],
        ['Репортажная съёмка', 'от 12 000 ₽'],
        ['Срочная обработка', 'от 2 500 ₽'],
    ],
    // «Опыт в проектах» — Figma 129:7184
    projects: [
        {
            year: '2026',
            project: 'Рекламная кампания нового бренда одежды',
            brand: 'LIME',
            role: 'Фотограф',
        },
        {
            year: '2025',
            project: 'Каталог весенней коллекции',
            brand: 'Love Republic',
            role: 'Fashion-фотограф',
        },
        {
            year: '2025',
            project: 'Lookbook',
            brand: 'Befree',
            role: 'Предметная и модельная съёмка',
        },
        {
            year: '2024',
            project: 'Beauty-съёмка',
            brand: 'CHARUEL',
            role: 'Главный фотограф',
        },
    ],
    rating: '4,6',
}

// ── Портфолио (Figma 129:7213) ──────────────────────────────────────────────
export const PORTFOLIO_TABS = [
    { key: 'all', label: 'Все', count: 45 },
    { key: 'wedding', label: 'Свадебный', count: 8 },
    { key: 'portrait', label: 'Портрет', count: 6 },
    { key: 'commercial', label: 'Коммерческая', count: 3 },
    { key: 'content', label: 'Контент', count: 4 },
    { key: 'advertising', label: 'Реклама', count: 7 },
    { key: 'product', label: 'Предметная съёмка', count: 7 },
]

export const PORTFOLIO_ITEMS = PORTFOLIO_TABS.reduce((acc, tab) => {
    acc[tab.key] = Array.from({ length: tab.count }, (_, i) => ({
        id: `${tab.key}-${i}`,
        image: PHOTOGRAPHER_IMAGE,
    }))
    return acc
}, {})

// Figma'da bir marta 16 ta ish ko'rsatiladi (4 qator × 4 ustun).
export const PORTFOLIO_STEP = 16

// ── Отзывы (Figma 320:8474) ─────────────────────────────────────────────────
const REVIEW_TEXTS = [
    {
        author: 'Анна Смирнова',
        text: 'Отличный фотограф. Помог с позированием, быстро нашёл удачные ракурсы и уже во время съёмки подсказывал, как сделать кадры лучше.',
    },
    {
        author: 'LUMEN Agency',
        text: 'Работать было комфортно на всех этапах. Фотограф соблюдал договорённости, оперативно передал готовый материал и полностью выполнил задачи проекта.',
    },
    {
        author: 'Дмитрий Волков',
        text: 'Профессиональный подход к работе. Съёмка прошла организованно, фотографии получились качественными, а обработка была выполнена в оговорённые сроки.',
    },
]

export const REVIEWS = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    ...REVIEW_TEXTS[i % REVIEW_TEXTS.length],
    rating: 5,
    date: '23.04.2026',
}))

export const REVIEWS_STEP = 6
