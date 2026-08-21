// ─────────────────────────────────────────────────────────────────────────────
// Loyihaning 5 ta roli. Barcha guard, sidebar va redirect logikasi shu
// jadvaldan oziqlanadi — rol qo'shish/olib tashlash faqat shu faylda bo'ladi.
//
// Figma: "Знакомство" (390:21023) ekranidagi rol kartochkalari —
// Заказчик (345:18920) / Исполнитель (345:18940) / Агентство (345:19007).
// ─────────────────────────────────────────────────────────────────────────────

export const ROLES = {
    CLIENT: 'client',     // Заказчик — частное лицо
    COMPANY: 'company',   // Заказчик — компания
    EXECUTOR: 'executor', // Исполнитель — модель / фотограф / видеограф
    AGENCY: 'agency',     // Агентство
    ADMIN: 'admin',       // Администратор платформы
}

export const ROLE_LIST = [
    ROLES.CLIENT,
    ROLES.COMPANY,
    ROLES.EXECUTOR,
    ROLES.AGENCY,
    ROLES.ADMIN,
]

// Har bir rolning ko'rinadigan nomi, kabinet ildizi va ro'yxatdan o'tishda
// ko'rsatiladimi (admin — faqat backend tomonidan beriladi).
export const ROLE_META = {
    [ROLES.CLIENT]: {
        key: ROLES.CLIENT,
        label: 'Заказчик',
        sublabel: 'Частное лицо',
        description: 'Ищу исполнителей и площадки для своих съёмок',
        home: '/client/dashboard',
        selectable: true,
    },
    [ROLES.COMPANY]: {
        key: ROLES.COMPANY,
        label: 'Компания',
        sublabel: 'Заказчик — юридическое лицо',
        description: 'Публикую проекты, площадки и нанимаю исполнителей',
        home: '/company/dashboard',
        selectable: true,
    },
    [ROLES.EXECUTOR]: {
        key: ROLES.EXECUTOR,
        label: 'Исполнитель',
        sublabel: 'Модель, фотограф, видеограф',
        description: 'Заполняю анкету и откликаюсь на проекты',
        home: '/executor/dashboard',
        selectable: true,
    },
    [ROLES.AGENCY]: {
        key: ROLES.AGENCY,
        label: 'Агентство',
        sublabel: 'Модельное агентство',
        description: 'Веду своих исполнителей и работаю с заказчиками',
        home: '/agency/dashboard',
        selectable: true,
    },
    [ROLES.ADMIN]: {
        key: ROLES.ADMIN,
        label: 'Администратор',
        sublabel: 'Панель управления',
        description: 'Модерация анкет, проектов, площадок и жалоб',
        home: '/admin/dashboard',
        selectable: false,
    },
}

// Ro'yxatdan o'tishda tanlanadigan rollar (Figma: "Знакомство").
export const SELECTABLE_ROLES = ROLE_LIST.filter((r) => ROLE_META[r].selectable)

// Ijrochi turlari — Figma: "Исполнитель" анкетаси ичидаги
// Модель / Фотограф (265:16499) / Видеограф (265:17127).
export const EXECUTOR_TYPES = {
    MODEL: 'model',
    PHOTOGRAPHER: 'photographer',
    VIDEOGRAPHER: 'videographer',
}

export const EXECUTOR_TYPE_META = {
    [EXECUTOR_TYPES.MODEL]: { label: 'Модель', catalog: '/models' },
    [EXECUTOR_TYPES.PHOTOGRAPHER]: { label: 'Фотограф', catalog: '/photographers' },
    [EXECUTOR_TYPES.VIDEOGRAPHER]: { label: 'Видеограф', catalog: '/videographers' },
}

// URL prefiksi bo'yicha rolni aniqlash — RoleGuard va navbar shundan foydalanadi.
export const ROLE_BY_PREFIX = {
    client: ROLES.CLIENT,
    company: ROLES.COMPANY,
    executor: ROLES.EXECUTOR,
    agency: ROLES.AGENCY,
    admin: ROLES.ADMIN,
}

export function roleFromPathname(pathname = '') {
    const first = pathname.split('/').filter(Boolean)[0]
    return ROLE_BY_PREFIX[first] || null
}

// Login/registratsiyadan keyin qayerga tashlash kerak.
export function homeForRole(role) {
    return ROLE_META[role]?.home || '/'
}

export function isRole(role, ...allowed) {
    return allowed.includes(role)
}

// ─────────────────────────────────────────────────────────────────────────────
// Backend rollari frontend rollaridan farq qiladi (backend/auth.md):
//   customer  → client (customer_type=individual) yoki company (=company)
//   performer → executor
//   agency / admin — bir xil
//
// API bilan gaplashganda doim `toApiRole`, UI'da `fromApiUser` ishlatiladi.
// ─────────────────────────────────────────────────────────────────────────────

export const API_ROLES = {
    CUSTOMER: 'customer',
    PERFORMER: 'performer',
    AGENCY: 'agency',
    ADMIN: 'admin',
}

export const CUSTOMER_TYPES = {
    INDIVIDUAL: 'individual',
    COMPANY: 'company',
}

// Frontend roli → backend roli.
export function toApiRole(role) {
    if (role === ROLES.CLIENT || role === ROLES.COMPANY) return API_ROLES.CUSTOMER
    if (role === ROLES.EXECUTOR) return API_ROLES.PERFORMER
    if (role === ROLES.AGENCY) return API_ROLES.AGENCY
    if (role === ROLES.ADMIN) return API_ROLES.ADMIN
    return API_ROLES.CUSTOMER
}

// Backend `user` obyekti → frontend roli.
export function roleFromApiUser(user) {
    if (!user) return null
    if (user.role === API_ROLES.PERFORMER) return ROLES.EXECUTOR
    if (user.role === API_ROLES.AGENCY) return ROLES.AGENCY
    if (user.role === API_ROLES.ADMIN) return ROLES.ADMIN
    if (user.role === API_ROLES.CUSTOMER) {
        // Figma'da zakazchik kabineti bitta: xoh jismoniy shaxs, xoh kompaniya
        // (208:4747 — «Профиль компании» va 260:12521 — «Пустой профиль» bir xil
        // ekran). `customerProfile()` adapteri `company_name` va «Компания»
        // yorlig'ini o'zi qo'yadi, shuning uchun ikkalasi ham `/client/*` ga
        // tushadi. `ROLES.COMPANY` faqat eski `/company/*` sahifalari uchun
        // qolgan — ular menyudan olib tashlangan.
        return ROLES.CLIENT
    }
    return null
}

// Sessiyada saqlanadigan user — backend maydonlari + frontend `role`si.
// Butun UI `user.role` ni shu ko'rinishda kutadi (navbar, guard, sidebar).
export function normalizeUser(user) {
    if (!user) return null
    return {
        ...user,
        apiRole: user.role,
        role: roleFromApiUser(user),
        name:
            user.agency_name ||
            user.company_name ||
            [user.first_name, user.last_name].filter(Boolean).join(' ') ||
            user.representative_name ||
            '',
    }
}

// Ijrochi ixtisosligi → katalog manzili (Figma menyusi bilan mos).
export const SPECIALTY_CATALOG = {
    [EXECUTOR_TYPES.MODEL]: '/models',
    [EXECUTOR_TYPES.PHOTOGRAPHER]: '/photographers',
    [EXECUTOR_TYPES.VIDEOGRAPHER]: '/videographers',
}
