// ─────────────────────────────────────────────────────────────────────────────
// Контакты sahifasining statik qismi.
// Figma: desktop 164:14294, mobil 377:16389.
//
// Telefon, pochta, manzil va ijtimoiy tarmoqlar backenddan keladi
// (GET /site/contacts — adminkadagi «Контакты сайта» bo'limi). Bu yerda faqat
// ikonkalar qoladi: backend `{ url, title }` beradi, belgi esa lokal fayl.
// ─────────────────────────────────────────────────────────────────────────────

// Sarlavha bo'yicha ikonka (Figma 164:14768 — MAX · VK · Telegram).
export const SOCIAL_ICONS = {
    max: '/img/contacts/max.svg',
    vk: '/img/contacts/vk.svg',
    telegram: '/img/contacts/telegram.svg',
    default: '/img/contacts/telegram.svg',
}

// Backend bo'sh ro'yxat qaytarsa ko'rsatiladigan zaxira havolalar.
export const SOCIALS = [
    { key: 'max', label: 'MAX', href: 'https://max.ru/', icon: SOCIAL_ICONS.max },
    { key: 'vk', label: 'ВКонтакте', href: 'https://vk.com/', icon: SOCIAL_ICONS.vk },
    { key: 'telegram', label: 'Telegram', href: 'https://t.me/', icon: SOCIAL_ICONS.telegram },
]

// «MAX» / «ВКонтакте» / «Telegram» → ikonka kaliti.
export function normalizeSocial(title = '') {
    const t = String(title).toLowerCase()
    if (t.includes('max')) return 'max'
    if (t.includes('вконтакте') || t.includes('vk')) return 'vk'
    if (t.includes('telegram') || t.includes('телеграм')) return 'telegram'
    return 'default'
}
