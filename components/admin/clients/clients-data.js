// «Заказчики» — Figma 336:15164 (ro'yxat) va 338:16465 (kompaniya profili).

const SAMPLE = [
    { name: 'Иван Иванов', type: 'Частное лицо', status: 'active' },
    { name: 'ООО «LUMEN»', type: 'Компания', status: 'active' },
    { name: 'LUMEN', type: 'Компания', status: 'active' },
    { name: 'Мария Волкова', type: 'Частное лицо', status: 'blocked' },
    { name: 'Мария Волкова', type: 'Частное лицо', status: 'active' },
    { name: 'Мария Волкова', type: 'Компания', status: 'active' },
    { name: 'Мария Волкова', type: 'Частное лицо', status: 'active' },
    { name: 'Мария Волкова', type: 'Компания', status: 'blocked' },
    { name: 'Мария Волкова', type: 'Частное лицо', status: 'active' },
]

export const CLIENTS_PAGE_SIZE = 9

export const CLIENTS = Array.from({ length: 45 }, (_, i) => ({
    id: `c-${i + 1}`,
    ...SAMPLE[i % SAMPLE.length],
    email: 'почта@mail.ru',
    date: '17.07.2026 14:34',
}))

export const CLIENT_STATUS_FILTER = [
    { value: '', label: 'Все статусы' },
    { value: 'active', label: 'Активен' },
    { value: 'blocked', label: 'Заблокирован' },
]

// ── Kompaniya profili (Figma 338:16474) ──────────────────────────────────────
const PROJECT_IMAGE = '/img/projects/project.jpg'

const PUBLICATION = {
    kind: 'projects',
    title: 'Съёмка для fashion-бренда',
    description: 'Требуется модель для новой коллекции одежды и рекламных материалов',
    date: '18 июля',
    city: 'Санкт-Петербург',
    price: 'от 2 500 ₽/час',
    image: PROJECT_IMAGE,
    comments: 45,
    views: 45,
}

const STATUSES = ['active', 'moderation', 'paused', 'active', 'archive', 'draft', 'rejected', 'done']

export const COMPANY_PROFILE = {
    id: 'c-2',
    name: 'LIME',
    logo: '/img/companies/lime.svg',
    status: 'active',
    field: 'Российский бренд одежды',
    city: 'Санкт-Петербург',
    about: 'LIME — российский бренд одежды, организующий рекламные, каталожные и имиджевые съёмки. Компания размещает проекты, сотрудничает с профессиональными исполнителями и подбирает площадки для реализации творческих задач.',
    phone: '+ 7 (000)-000-00-00',
    email: 'po4ta@mail.ru',
    site: 'lime.ru',
    stats: [
        { value: '11', label: 'Проектов' },
        { value: '11', label: 'Площадок' },
        { value: '24', label: 'Отклика' },
        { value: '5', label: 'Новые заявки' },
    ],
    publicationTabs: [
        { key: 'projects', label: 'Проекты', count: 8 },
        { key: 'venues', label: 'Площадки', count: 4 },
    ],
    publications: [
        ...STATUSES.map((status, i) => ({
            ...PUBLICATION,
            id: `p-${i + 1}`,
            status,
            editHref: `/admin/projects/p-${i + 1}/edit`,
        })),
        ...Array.from({ length: 4 }, (_, i) => ({
            ...PUBLICATION,
            id: `v-${i + 1}`,
            kind: 'venues',
            title: 'Studio Loft 21',
            description: 'Просторная студия с панорамными окнами и естественным светом',
            image: '/img/venues/venue.jpg',
            status: STATUSES[i],
            editHref: `/admin/venues/v-${i + 1}/edit`,
        })),
    ],
}

// «Пустой профиль» (Figma 338:16778) — ma'lumot to'ldirilmagan holat.
export const EMPTY_PROFILE = {
    ...COMPANY_PROFILE,
    id: 'c-1',
    logo: null,
    field: null,
    about: null,
    phone: null,
    email: null,
    site: null,
    stats: COMPANY_PROFILE.stats.map((s) => ({ ...s, value: '0' })),
    publications: [],
}
