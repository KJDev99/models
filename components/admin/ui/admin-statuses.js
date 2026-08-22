// Adminka bo'ylab bir xil holat nomlari va ranglari.
// Figma: «Исполнители» 321:13203 · «Проекты» 338:19284 · «Модерация» 343:14293.

export const USER_STATUS = {
    active: { label: 'Активен', tone: 'success' },
    paused: { label: 'На паузе', tone: 'warning' },
    blocked: { label: 'Заблокирован', tone: 'danger' },
    moderation: { label: 'На модерации', tone: 'pending' },
}

// Loyiha/e'lon holatlari — Figma «Профиль компании» 338:16570…338:16768.
export const PROJECT_STATUS = {
    active: { label: 'Активен', tone: 'success' },
    moderation: { label: 'На модерации', tone: 'pending' },
    paused: { label: 'На паузе', tone: 'warning' },
    archive: { label: 'Архив', tone: 'archive' },
    draft: { label: 'Черновик', tone: 'draft' },
    rejected: { label: 'Отклонен', tone: 'danger' },
    done: { label: 'Завершен', tone: 'info' },
}

// ─────────────────────────────────────────────────────────────────────────────
// Xavfsiz qidiruv. Backend yangi holat qo'shsa yoki `status` bo'sh kelsa,
// to'g'ridan-to'g'ri `USER_STATUS[x].tone` o'qish sahifani yiqitadi —
// shuning uchun kartochkalarda faqat shu funksiyalar ishlatiladi.
// ─────────────────────────────────────────────────────────────────────────────
const FALLBACK = { label: '—', tone: 'muted' }

export function userStatus(status) {
    return USER_STATUS[status] || FALLBACK
}

export function projectStatus(status) {
    return PROJECT_STATUS[status] || FALLBACK
}
