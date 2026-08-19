// ─────────────────────────────────────────────────────────────────────────────
// «Заказчик» kabinetining bosh sahifasi uchun statik kontent.
// Figma: «Пустой профиль» 260:12521 · «Профиль компании - проекты» 208:4733 /
// 208:6961 · «Профиль компании - площадки» 208:5773 / 208:8098.
//
// Backend ulanganda `COMPANY_PROFILE` va `PUBLICATIONS` store javobi bilan
// almashtiriladi — maydon nomlari o'zgarmaydi.
// ─────────────────────────────────────────────────────────────────────────────

export const COMPANY_LOGO = '/img/companies/lime.svg'
const PROJECT_IMAGE = '/img/projects/project.jpg'
const VENUE_IMAGE = '/img/venues/venue.jpg'

// To'ldirilgan profil (Figma 208:4747).
export const COMPANY_PROFILE = {
    name: 'LIME',
    note: 'Российский бренд одежды',
    city: 'Санкт-Петербург',
    logo: COMPANY_LOGO,
    about:
        'LIME — российский бренд одежды, организующий рекламные, каталожные и имиджевые ' +
        'съёмки. Компания размещает проекты, сотрудничает с профессиональными исполнителями ' +
        'и подбирает площадки для реализации творческих задач.',
    phone: '+ 7 (000)-000-00-00',
    email: 'po4ta@mail.ru',
    site: 'lime.ru',
    stats: [
        { value: '11', label: 'Проектов' },
        { value: '11', label: 'Площадок' },
        { value: '24', label: 'Отклика' },
        { value: '5', label: 'Новые заявки' },
    ],
}

// Bo'sh profil (Figma 260:12530) — rasm o'rnida joy egallovchi, matnlar «пока не…».
export const EMPTY_PROFILE = {
    name: 'LIME',
    note: '',
    city: 'Санкт-Петербург',
    logo: null,
    about: 'Информация о компании пока не заполнена',
    phone: '',
    email: '',
    site: '',
    stats: [
        { value: '0', label: 'Проектов' },
        { value: '0', label: 'Площадок' },
        { value: '0', label: 'Отклика' },
        { value: '0', label: 'Новые заявки' },
    ],
}

// «Мои публикации» — Figma'da 8 ta loyiha va 4 ta maydon, holatlari har xil.
const PROJECT_STATUSES = [
    'active',
    'moderation',
    'paused',
    'active',
    'archive',
    'draft',
    'rejected',
    'done',
]

const VENUE_STATUSES = ['active', 'moderation', 'paused', 'rejected']

export const PUBLICATIONS = [
    ...PROJECT_STATUSES.map((status, i) => ({
        id: `p-${i + 1}`,
        kind: 'projects',
        status,
        title: 'Съёмка для fashion-бренда',
        description: 'Требуется модель для новой коллекции одежды и рекламных материалов',
        date: '18 июля',
        city: 'Санкт-Петербург',
        price: 'от 2 500 ₽/час',
        image: PROJECT_IMAGE,
        comments: 45,
        views: 45,
        href: `/client/projects/p-${i + 1}`,
        editHref: `/client/projects/p-${i + 1}/edit`,
    })),
    ...VENUE_STATUSES.map((status, i) => ({
        id: `v-${i + 1}`,
        kind: 'venues',
        status,
        title: 'Studio Loft 21',
        description: 'Просторная студия с панорамными окнами и профессиональным светом',
        date: '18 июля',
        city: 'Санкт-Петербург',
        price: 'от 2 500 ₽/час',
        image: VENUE_IMAGE,
        comments: 45,
        views: 45,
        href: `/client/venues/v-${i + 1}`,
        editHref: `/client/venues/v-${i + 1}/edit`,
    })),
]

export const PUBLICATION_TABS = [
    {
        key: 'projects',
        label: 'Проекты',
        count: PUBLICATIONS.filter((p) => p.kind === 'projects').length,
    },
    {
        key: 'venues',
        label: 'Площадки',
        count: PUBLICATIONS.filter((p) => p.kind === 'venues').length,
    },
]
