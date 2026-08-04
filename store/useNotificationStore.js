import { create } from 'zustand'
import { apiToken } from '@/lib/axios'
import { isAuthenticated } from '@/lib/auth'

// Уведомления (Figma: уведомление 173:6099) — navbar'dagi qizil nuqta va
// /notifications sahifasi shu store'dan oziqlanadi.
export const useNotificationStore = create((set, get) => ({
    items: [],
    unread: 0,
    loading: false,

    fetch: async () => {
        if (!isAuthenticated()) return
        set({ loading: true })
        try {
            const res = await apiToken.get('/notifications/')
            const items = res.data?.results || res.data || []
            set({ items, unread: items.filter((n) => !n.isRead).length })
        } catch {
            set({ items: [], unread: 0 })
        } finally {
            set({ loading: false })
        }
    },

    markRead: async (id) => {
        set({
            items: get().items.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
            unread: Math.max(0, get().unread - 1),
        })
        try {
            await apiToken.post(`/notifications/${id}/read/`)
        } catch {
            // e'tiborsiz — keyingi fetch to'g'rilaydi
        }
    },

    markAllRead: async () => {
        set({ items: get().items.map((n) => ({ ...n, isRead: true })), unread: 0 })
        try {
            await apiToken.post('/notifications/read-all/')
        } catch {
            // e'tiborsiz
        }
    },
}))
