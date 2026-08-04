// ─────────────────────────────────────────────────────────────────────────────
// Избранное — localStorage'da. Bir nechta tur saqlanadi: executor / venue /
// project / agency. Har element: { type, id, slug, title, image }.
// O'zgarganda `favorites-updated` hodisasi yuboriladi.
//
// Foydalanuvchi kirgan bo'lsa, store bu ro'yxatni backend bilan sinxronlaydi
// (useFavoritesStore.sync()) — localStorage esa mehmon uchun ishlaydi.
// ─────────────────────────────────────────────────────────────────────────────

const KEY = 'favorites'

export const FAVORITE_TYPES = {
    EXECUTOR: 'executor',
    VENUE: 'venue',
    PROJECT: 'project',
    AGENCY: 'agency',
}

function emit() {
    window.dispatchEvent(new Event('favorites-updated'))
}

export function getFavorites() {
    if (typeof window === 'undefined') return []
    try {
        return JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
        return []
    }
}

function keyOf(item) {
    return `${item.type}::${item.id}`
}

export function isFavorite(type, id) {
    return getFavorites().some((i) => i.type === type && i.id === id)
}

// Bor bo'lsa olib tashlaydi, yo'q bo'lsa qo'shadi. Qo'shilganda `true` qaytaradi.
export function toggleFavorite(item) {
    const list = getFavorites()
    const idx = list.findIndex((i) => keyOf(i) === keyOf(item))
    if (idx !== -1) {
        list.splice(idx, 1)
    } else {
        list.push(item)
    }
    localStorage.setItem(KEY, JSON.stringify(list))
    emit()
    return idx === -1
}

export function removeFavorite(type, id) {
    const list = getFavorites().filter((i) => !(i.type === type && i.id === id))
    localStorage.setItem(KEY, JSON.stringify(list))
    emit()
}

export function clearFavorites() {
    localStorage.setItem(KEY, '[]')
    emit()
}

export function favoritesByType(type) {
    return getFavorites().filter((i) => i.type === type)
}
