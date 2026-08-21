// Sayt bo'ylab ishlatiladigan doimiy rasm yo'llari.
// Sahifaga tegishli rasmlar `components/<route>/...-data.js` ichida turadi.

export const LOGO = '/img/logo.svg'
export const OG_DEFAULT = '/img/og-default.png'

// Backend rasm bermagan holatlar uchun joy egallovchi (kulrang fon ustida
// ko'rinmaydi, lekin `next/image` `src` talab qiladi).
export const PLACEHOLDER = '/img/placeholder.svg'

// `src` bo'sh bo'lsa joy egallovchi qaytaradi — kartochkalar shu orqali
// backenddagi bo'sh `logo_url` / `cover_url` dan himoyalanadi.
export function imageSrc(src) {
    return src || PLACEHOLDER
}
