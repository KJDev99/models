// «Агентства» — Figma 338:17586 (ro'yxat) va 338:18370 (LUMEN AGENCY profili).

export const AGENCIES_PAGE_SIZE = 9

const STATUSES = ['active', 'active', 'active', 'blocked', 'active', 'active', 'active', 'blocked', 'active']

export const AGENCIES = Array.from({ length: 45 }, (_, i) => ({
    id: `a-${i + 1}`,
    name: 'LUMEN Agency',
    manager: 'Анна Смирнова',
    email: 'почта@mail.ru',
    date: '17.07.2026 14:34',
    status: STATUSES[i % STATUSES.length],
}))

export const AGENCY_STATUS_FILTER = [
    { value: '', label: 'Все статусы' },
    { value: 'active', label: 'Активен' },
    { value: 'blocked', label: 'Заблокирован' },
]

// ── Profil (Figma 338:18370) ─────────────────────────────────────────────────
const EXECUTOR_TEMPLATES = [
    {
        type: 'Модель',
        kind: 'models',
        name: 'Катерина Журавлева',
        chips: ['24 лет', '170 см'],
        image: '/img/models/model.jpg',
    },
    {
        type: 'Фотограф',
        kind: 'photographers',
        name: 'Алексей Миронов',
        chips: ['5 лет опыта', '120 съёмок'],
        image: '/img/photographers/photographer.jpg',
    },
    {
        type: 'Видеограф',
        kind: 'videographers',
        name: 'Илья Воронов',
        chips: ['4 года опыта', '45 кейсов'],
        image: '/img/videographers/videographer.jpg',
    },
    {
        type: 'Модель',
        kind: 'models',
        name: 'София Лебедева',
        chips: ['24 лет', '170 см'],
        image: '/img/models/model.jpg',
    },
]

export const AGENCY_PROFILE = {
    id: 'a-1',
    name: 'LUMEN AGENCY',
    logo: '/img/agencies/agency.svg',
    status: 'active',
    field: 'Модельное и креативное агентство',
    city: 'Санкт-Петербург',
    manager: 'Алексей',
    about: 'LUMEN Agency — агентство, представляющее моделей, фотографов и видеографов для рекламных, коммерческих и творческих проектов. Подбираем специалистов под задачи заказчика и сопровождаем проекты на всех этапах сотрудничества.',
    phone: '+ 7 (000)-000-00-00',
    email: 'po4ta@mail.ru',
    stats: [
        { value: '68', label: 'Исполнителей' },
        { value: '48', label: 'Моделей' },
        { value: '12', label: 'Фотографов' },
        { value: '8', label: 'Видеографов' },
    ],
    executorTabs: [
        { key: 'all', label: 'Все', count: 68 },
        { key: 'models', label: 'Модели', count: 48 },
        { key: 'photographers', label: 'Фотографы', count: 12 },
        { key: 'videographers', label: 'Видеографы', count: 8 },
    ],
    executors: Array.from({ length: 16 }, (_, i) => ({
        ...EXECUTOR_TEMPLATES[i % EXECUTOR_TEMPLATES.length],
        id: `ae-${i + 1}`,
        status: 'active',
        comments: 45,
        views: 45,
    })),
}
