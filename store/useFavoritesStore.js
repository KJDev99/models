import { create } from 'zustand'
import * as site from '@/lib/api/site'
import { FAVORITE_TARGET, favoriteItem } from '@/lib/adapters'
import {
    clearFavorites,
    getFavorites,
    isFavorite,
    toggleFavorite,
} from '@/lib/favorites'
import { isAuthenticated } from '@/lib/auth'

// ─────────────────────────────────────────────────────────────────────────────
// Избранное: mehmon uchun localStorage, kirgan foydalanuvchi uchun backend
// (backend/site.md → GET/POST/DELETE /site/favorites).
//
// Ikkala manba ham bir xil `{ type, id, slug, title, image }` shaklidan
// foydalanadi; serverdan kelgan elementda qo'shimcha `favoriteId` bo'ladi —
// u o'chirish uchun kerak.
// ─────────────────────────────────────────────────────────────────────────────
export const useFavoritesStore = create((set, get) => ({
    items: [],
    counts: {},
    loading: false,

    hydrate: () => set({ items: getFavorites() }),

    // Serverdan to'liq ro'yxatni oladi; mehmon bo'lsa localStorage'dan.
    sync: async () => {
        if (!isAuthenticated()) {
            set({ items: getFavorites(), counts: {} })
            return
        }
        set({ loading: true })
        try {
            const data = await site.favorites('all')
            set({
                items: (data.items || []).map(favoriteItem).filter(Boolean),
                counts: data.counts || {},
            })
        } catch {
            // Tarmoq xatosi — lokal ro'yxat ko'rsatiladi.
            set({ items: getFavorites() })
        } finally {
            set({ loading: false })
        }
    },

    // `item`: { type, id, slug, title, image }
    toggle: async (item) => {
        if (!isAuthenticated()) {
            const added = toggleFavorite(item)
            set({ items: getFavorites() })
            return added
        }

        const existing = get().items.find((i) => i.type === item.type && i.id === item.id)

        // Optimistik yangilash — tugma darhol javob beradi.
        if (existing) {
            set({ items: get().items.filter((i) => i !== existing) })
            try {
                await site.removeFavorite(existing.favoriteId)
            } catch {
                await get().sync()
            }
            return false
        }

        set({ items: [...get().items, { ...item, favoriteId: null }] })
        try {
            const created = await site.addFavorite({
                targetType: FAVORITE_TARGET[item.type] || 'user',
                targetId: item.id,
            })
            // Yaratilgan yozuvning `id` si keyingi o'chirish uchun saqlanadi.
            set({
                items: get().items.map((i) =>
                    i.type === item.type && i.id === item.id
                        ? { ...i, favoriteId: created?.id || null }
                        : i,
                ),
            })
        } catch {
            await get().sync()
        }
        return true
    },

    has: (type, id) =>
        get().items.some((i) => i.type === type && i.id === id) ||
        (!isAuthenticated() && isFavorite(type, id)),

    clear: async () => {
        if (!isAuthenticated()) {
            clearFavorites()
            set({ items: [] })
            return
        }
        // Backendda «hammasini tozalash» endpointi yo'q — birma-bir o'chiriladi.
        const items = get().items
        set({ items: [] })
        await Promise.all(
            items.filter((i) => i.favoriteId).map((i) => site.removeFavorite(i.favoriteId).catch(() => {})),
        )
        await get().sync()
    },
}))
