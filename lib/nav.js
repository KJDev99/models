// ─────────────────────────────────────────────────────────────────────────────
// Barcha navigatsiya shu yerda. Navbar, footer, mobil menyu va har bir rolning
// kabinet sidebar'i shu jadvallardan o'qiydi — yangi sahifa qo'shilganda
// faqat shu fayl tahrirlanadi.
// ─────────────────────────────────────────────────────────────────────────────

import { ROLES } from '@/lib/roles'

// ─── Ochiq sayt (Figma: хедер 164:16136) ─────────────────────────────────────
export const PUBLIC_NAV = [
    { label: 'Модели', href: '/models' },
    { label: 'Фотографы', href: '/photographers' },
    { label: 'Видеографы', href: '/videographers' },
    { label: 'Площадки', href: '/venues' },
    { label: 'Проекты', href: '/projects' },
    { label: 'Агентства', href: '/agencies' },
    { label: 'Контакты', href: '/contacts' },
]

// ─── Footer (Figma: футер 270:21696) ─────────────────────────────────────────
export const FOOTER_NAV = [
    {
        title: 'Каталог',
        links: [
            { label: 'Модели', href: '/models' },
            { label: 'Фотографы', href: '/photographers' },
            { label: 'Видеографы', href: '/videographers' },
            { label: 'Площадки', href: '/venues' },
        ],
    },
    {
        title: 'Платформа',
        links: [
            { label: 'Проекты', href: '/projects' },
            { label: 'Агентства', href: '/agencies' },
            { label: 'Как это работает', href: '/onboarding' },
            { label: 'Контакты', href: '/contacts' },
        ],
    },
    {
        title: 'Аккаунт',
        links: [
            { label: 'Вход', href: '/auth/login' },
            { label: 'Регистрация', href: '/auth/register' },
            { label: 'Избранное', href: '/favorites' },
            { label: 'Сообщения', href: '/chat' },
        ],
    },
]

// ─── Mobil pastki panel (Figma: меню 373:17004) ──────────────────────────────
export const MOBILE_TABS = [
    { label: 'Главная', href: '/', icon: 'home' },
    { label: 'Каталог', href: '/models', icon: 'search' },
    { label: 'Проекты', href: '/projects', icon: 'projects' },
    { label: 'Избранное', href: '/favorites', icon: 'heart' },
    { label: 'Профиль', href: '/auth/login', icon: 'user', authHref: 'ROLE_HOME' },
]

// ─── Kabinet menyulari ───────────────────────────────────────────────────────
// `exact: true` — faqat aynan shu manzilda faol bo'ladi (dashboard uchun).

export const CABINET_NAV = {
    // Заказчик — частное лицо
    [ROLES.CLIENT]: [
        { label: 'Личные данные', href: '/client/dashboard', exact: true },
        { label: 'Мои проекты', href: '/client/projects' },
        { label: 'Исполнители', href: '/client/models' },
        { label: 'Приглашения', href: '/client/invites' },
        { label: 'Избранное', href: '/client/favorites' },
        { label: 'Отзывы', href: '/client/reviews' },
        { label: 'Сообщения', href: '/client/chat' },
        { label: 'Уведомления', href: '/client/notifications' },
        { label: 'Настройки', href: '/client/settings' },
    ],

    // Заказчик — компания
    [ROLES.COMPANY]: [
        { label: 'Профиль компании', href: '/company/dashboard', exact: true },
        { label: 'Проекты', href: '/company/projects' },
        { label: 'Площадки', href: '/company/venues' },
        { label: 'Исполнители', href: '/company/executors' },
        { label: 'Приглашения', href: '/company/invites' },
        { label: 'Избранное', href: '/company/favorites' },
        { label: 'Отзывы', href: '/company/reviews' },
        { label: 'Сообщения', href: '/company/chat' },
        { label: 'Уведомления', href: '/company/notifications' },
        { label: 'Настройки', href: '/company/settings' },
    ],

    // Исполнитель
    [ROLES.EXECUTOR]: [
        { label: 'Моя анкета', href: '/executor/dashboard', exact: true },
        { label: 'Портфолио', href: '/executor/portfolio' },
        { label: 'Мои проекты', href: '/executor/projects' },
        { label: 'Приглашения', href: '/executor/invites' },
        { label: 'Избранное', href: '/executor/favorites' },
        { label: 'Отзывы', href: '/executor/reviews' },
        { label: 'Сообщения', href: '/executor/chat' },
        { label: 'Уведомления', href: '/executor/notifications' },
        { label: 'Настройки', href: '/executor/settings' },
    ],

    // Агентство
    [ROLES.AGENCY]: [
        { label: 'Профиль агентства', href: '/agency/dashboard', exact: true },
        { label: 'Исполнители', href: '/agency/executors' },
        { label: 'Проекты', href: '/agency/projects' },
        { label: 'Приглашения', href: '/agency/invites' },
        { label: 'Избранное', href: '/agency/favorites' },
        { label: 'Отзывы', href: '/agency/reviews' },
        { label: 'Сообщения', href: '/agency/chat' },
        { label: 'Уведомления', href: '/agency/notifications' },
        { label: 'Настройки', href: '/agency/settings' },
    ],

    // Администратор (Figma: Дашборд 321:12629)
    [ROLES.ADMIN]: [
        { label: 'Дашборд', href: '/admin/dashboard', exact: true },
        { label: 'Исполнители', href: '/admin/executors' },
        { label: 'Заказчики', href: '/admin/clients' },
        { label: 'Агентства', href: '/admin/agencies' },
        { label: 'Проекты', href: '/admin/projects' },
        { label: 'Площадки', href: '/admin/venues' },
        { label: 'Отзывы', href: '/admin/reviews' },
        { label: 'Модерация', href: '/admin/moderation' },
        { label: 'Жалобы', href: '/admin/complaints' },
        { label: 'Чаты', href: '/admin/chats' },
        { label: 'Настройки', href: '/admin/settings' },
    ],
}

// Sozlamalar bo'limining ichki menyusi — barcha rollarda bir xil ko'rinish
// (Figma: Редактировать профиль / Изменить пароль / почту / телефон / Удалить аккаунт).
export function settingsNav(rolePrefix) {
    return [
        { label: 'Редактировать профиль', href: `/${rolePrefix}/settings`, exact: true },
        { label: 'Изменить пароль', href: `/${rolePrefix}/settings/password` },
        { label: 'Изменить почту', href: `/${rolePrefix}/settings/email` },
        { label: 'Изменить телефон', href: `/${rolePrefix}/settings/phone` },
        { label: 'Удалить аккаунт', href: `/${rolePrefix}/settings/delete`, danger: true },
    ]
}

export function cabinetNav(role) {
    return CABINET_NAV[role] || []
}
