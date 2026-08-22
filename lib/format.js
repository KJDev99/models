// Umumiy formatlash yordamchilari — kartochkalar, jadvallar va profillar uchun.

const RU = 'ru-RU'

export function formatPrice(value, currency = '₽') {
    if (value == null || value === '') return '—'
    return `${new Intl.NumberFormat(RU).format(Math.round(Number(value)))} ${currency}`
}

// «от 6 000 ₽/час» — maydon kartochkalari uchun. Narx hali kiritilmagan
// bo'lishi mumkin (yangi maydon), shunda o'rniga izoh chiqadi.
export function pricePerHour(value) {
    if (value == null || value === '') return 'Цена не указана'
    return `от ${new Intl.NumberFormat(RU).format(Math.round(Number(value)))} ₽/час`
}

export function formatNumber(value) {
    if (value == null) return '—'
    return new Intl.NumberFormat(RU).format(Number(value))
}

export function formatDate(value) {
    if (!value) return '—'
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleDateString(RU, { day: '2-digit', month: 'long', year: 'numeric' })
}

export function formatDateTime(value) {
    if (!value) return '—'
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleString(RU, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

// "лет" / "года" / "год" — yosh uchun to'g'ri qo'shimcha.
export function plural(count, one, few, many) {
    const n = Math.abs(count) % 100
    const n1 = n % 10
    if (n > 10 && n < 20) return many
    if (n1 > 1 && n1 < 5) return few
    if (n1 === 1) return one
    return many
}

export function formatAge(age) {
    if (age == null) return '—'
    return `${age} ${plural(age, 'год', 'года', 'лет')}`
}

// Telefon: +7 (999) 123-45-67
export function formatPhone(raw) {
    if (!raw) return '—'
    const digits = String(raw).replace(/\D/g, '')
    if (digits.length !== 11) return raw
    return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`
}

// Ism-familiyadan avatar uchun bosh harflar.
export function initials(name = '') {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() || '')
        .join('')
}
