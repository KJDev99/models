// Dashbord ma'lumotlari — Figma «Дашборд» 321:12629 / 438:18788.
// Backend ulanganda shu obyektlar `store/useAdminStore.js` orqali keladi.

export const DASHBOARD_STATS = [
    { value: '28', label: 'На модерации' },
    { value: '2 300', label: 'Пользователи' },
    { value: '426', label: 'Активные проекты' },
    { value: '94', label: 'Площадки' },
]

// «Последние заявки на модерацию» (Figma 321:12979).
export const MODERATION_REQUESTS = [
    {
        id: 'm-1',
        name: 'Анна Смирнова',
        type: 'Модель',
        email: 'почта@mail.ru',
        date: '17.07.2026, 14:34',
        status: 'На модерации',
    },
    {
        id: 'm-2',
        name: 'Studio Loft 21',
        type: 'Площадка',
        email: 'почта@mail.ru',
        date: '17.07.2026, 14:34',
        status: 'На модерации',
    },
    {
        id: 'm-3',
        name: 'Съёмка для fashion-бренда',
        type: 'Проект',
        email: 'почта@mail.ru',
        date: '17.07.2026, 14:34',
        status: 'На модерации',
    },
    {
        id: 'm-4',
        name: 'Studio Loft 21',
        type: 'Площадка',
        email: 'почта@mail.ru',
        date: '17.07.2026, 14:34',
        status: 'На модерации',
    },
]

// «Последние зарегистрированные пользователи» (Figma 321:13076).
export const LATEST_USERS = [
    {
        id: 'u-1',
        name: 'Анна Смирнова',
        type: 'Модель',
        email: 'почта@mail.ru',
        date: '17.07.2026, 14:34',
        href: '/admin/executors/u-1',
    },
    {
        id: 'u-2',
        name: 'Дмитрий Волков',
        type: 'Заказчик',
        email: 'почта@mail.ru',
        date: '17.07.2026, 14:34',
        href: '/admin/clients/u-2',
    },
    {
        id: 'u-3',
        name: 'Иван Петров',
        type: 'Фотограф',
        email: 'почта@mail.ru',
        date: '17.07.2026, 14:34',
        href: '/admin/executors/u-3',
    },
    {
        id: 'u-4',
        name: 'Анна Смирнова',
        type: 'Модель',
        email: 'почта@mail.ru',
        date: '17.07.2026, 14:34',
        href: '/admin/executors/u-4',
    },
]
