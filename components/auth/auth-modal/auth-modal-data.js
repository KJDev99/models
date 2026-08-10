// ─────────────────────────────────────────────────────────────────────────────
// Авторизация oynasining statik kontenti.
// Figma: ВХОД 75:677 · Заказчик 75:1133 · Введите пароль 85:1660 ·
// Войти через 85:3045 · Регистрация 85:3801 · Знакомство 85:4848 / 85:5241 /
// 85:5592 · Аккаунт заблокирован 345:18815.
// ─────────────────────────────────────────────────────────────────────────────

import { ROLES } from '@/lib/roles'

// «ВХОД» oynasidagi uchta rol kartochkasi (Figma 75:681).
// Ikonkalar Figma'dan eksport qilingan (54px).
export const ROLE_CARDS = [
    {
        key: ROLES.CLIENT,
        title: 'Я заказчик',
        description: 'Ищу моделей, фотографов, видеографов или площадку',
        icon: '/img/auth/role-client.svg',
    },
    {
        key: ROLES.EXECUTOR,
        title: 'Я исполнитель',
        description: 'Хочу получать проекты и отклики',
        icon: '/img/auth/role-executor.svg',
    },
    {
        key: ROLES.AGENCY,
        title: 'Агентство',
        description: 'Размещаю моделей и специалистов',
        icon: '/img/auth/role-agency.svg',
    },
]

// Kirish/ro'yxat oynasining sarlavhasi tanlangan rolga qarab o'zgaradi
// (Figma'da «ЗАКАЗЧИК» varianti chizilgan).
export const ROLE_TITLES = {
    [ROLES.CLIENT]: 'Заказчик',
    [ROLES.EXECUTOR]: 'Исполнитель',
    [ROLES.AGENCY]: 'Агентство',
}

// «Войти через» — Figma 85:3139. Ranglar Figma'dan aynan olingan, ikonkalar
// rangli tugma ustida turgani uchun oq variantda.
export const SERVICES = [
    { key: 'vk', label: 'ВКонтакте', color: '#0077FF', icon: '/img/auth/vk-white.svg' },
    { key: 'yandex', label: 'Яндекс', color: '#FC3F1D', icon: '/img/auth/yandex-white.svg' },
    { key: 'ok', label: 'Одноклассники', color: '#F79A38', icon: '/img/auth/ok-white.svg' },
]

// «Войти с помощью» qatoridagi kichik ikonkalar (Figma 81:2564) — tartibi
// Яндекс · ВКонтакте · Одноклассники.
export const SOCIAL_ICONS = [
    { key: 'yandex', label: 'Яндекс', icon: '/img/auth/yandex.svg' },
    { key: 'vk', label: 'ВКонтакте', icon: '/img/auth/vk.svg' },
    { key: 'ok', label: 'Одноклассники', icon: '/img/auth/ok.svg' },
]

export const FLAG_RU = '/img/auth/flag-ru.svg'

// «Знакомство» oynasidagi tablar (Figma 85:4927 / 85:5250).
export const CLIENT_TABS = [
    { key: 'person', label: 'Частное лицо' },
    { key: 'company', label: 'Компания' },
]

export const EXECUTOR_TABS = [
    { key: 'model', label: 'Модель' },
    { key: 'photographer', label: 'Фотограф' },
    { key: 'videographer', label: 'Видеограф' },
]

export const GENDER_OPTIONS = [
    { value: '', label: 'Выберите пол' },
    { value: 'female', label: 'Женский' },
    { value: 'male', label: 'Мужской' },
]

// «Аккаунт заблокирован» — Figma 345:18815. Backend javobi kelganda shu
// qiymatlar `login()` xatosidan olinadi.
export const BLOCKED_FALLBACK = {
    description: 'Доступ к аккаунту ограничен за нарушение правил платформы.',
    measure: 'Заблокировать на 1 день',
    reason: 'Неоднократное нарушение правил общения и оскорбительное поведение в переписке.',
}
