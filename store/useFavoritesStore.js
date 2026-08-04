import { create } from 'zustand'
import { apiToken } from '@/lib/axios'
import {
    clearFavorites,
    getFavorites,
    isFavorite,
    toggleFavorite,
} from '@/lib/favorites'
import { isAuthenticated } from '@/lib/auth'

// Избранное: mehmon uchun localStorage, kirgan foydalanuvchi uchun backend.
// Ikkalasi ham bir xil { type, id, slug, title, image } shaklidan foydalanadi.
export const useFavoritesStore = create((set, get) => ({
    items: [],
    loading: false,

    hydrate: () => set({ items: getFavorites() }),

    // Backenddan tortib, lokal ro'yxat bilan birlashtiradi (login'dan keyin).
    sync: async () => {
        if (!isAuthenticated()) {
            set({ items: getFavorites() })
            return
        }
        set({ loading: true })
        try {
            const res = await apiToken.get('/favorites/')
            const server = res.data?.results || res.data || []
            set({ items: server })
        } catch {
            set({ items: getFavorites() })
        } finally {
            set({ loading: false })
        }
    },

    toggle: async (item) => {
        const added = toggleFavorite(item)
        set({ items: getFavorites() })

        if (isAuthenticated()) {
            try {
                if (added) {
                    await apiToken.post('/favorites/', { type: item.type, id: item.id })
                } else {
                    await apiToken.delete(`/favorites/${item.type}/${item.id}/`)
                }
            } catch {
                // Tarmoq xatosi — lokal holat saqlanib qoladi, keyingi sync tuzatadi.
            }
        }
        return added
    },

    has: (type, id) =>
        get().items.some((i) => i.type === type && i.id === id) || isFavorite(type, id),

    clear: async () => {
        clearFavorites()
        set({ items: [] })
        if (isAuthenticated()) {
            try {
                await apiToken.delete('/favorites/')
            } catch {
                // e'tiborsiz
            }
        }
    },
}))
