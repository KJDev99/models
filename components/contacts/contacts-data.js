// ─────────────────────────────────────────────────────────────────────────────
// Контакты sahifasining kontenti.
// Figma: desktop 164:14294, mobil 377:16389.
//
// Backend ulanganda bu qiymatlar sozlamalar (`/settings/contacts/`) javobi
// bilan almashtiriladi — maydon nomlari o'sha holicha qoladi.
// ─────────────────────────────────────────────────────────────────────────────

export const CONTACTS = {
    phone: '+ 7(000)-000-00-00',
    email: 'почта@mail.ru',
    address: 'г. Санкт-Петербург',
}

// Ijtimoiy tarmoqlar — Figma 164:14768 (42px, gold halqa ichida gold belgi).
// Ikonkalar Figma'dan eksport qilingan: MAX · VK · Telegram.
export const SOCIALS = [
    { key: 'max', label: 'MAX', href: 'https://max.ru/', icon: '/img/contacts/max.svg' },
    { key: 'vk', label: 'ВКонтакте', href: 'https://vk.com/', icon: '/img/contacts/vk.svg' },
    { key: 'telegram', label: 'Telegram', href: 'https://t.me/', icon: '/img/contacts/telegram.svg' },
]
