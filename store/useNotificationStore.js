import { create } from 'zustand'
import * as site from '@/lib/api/site'
import { notificationItem } from '@/lib/adapters'
import { isAuthenticated } from '@/lib/auth'

// ─────────────────────────────────────────────────────────────────────────────
// Уведомления (Figma: уведомление 173:6099) — navbar'dagi gold nuqta va
// /notifications sahifasi shu store'dan oziqlanadi.
//
// Backend: GET /site/notifications → { items, unread }
//          POST /site/notifications/read  (ids berilmasa — hammasi)
// `ntype` qiymatlari backend/site.md da sanab o'tilgan.
// ─────────────────────────────────────────────────────────────────────────────
export const useNotificationStore = create((set, get) => ({
    items: [],
    unread: 0,
    loading: false,

    fetch: async () => {
        if (!isAuthenticated()) return
        set({ loading: true })
        try {
            const data = await site.notifications()
            set({
                items: (data.items || []).map(notificationItem).filter(Boolean),
                unread: data.unread ?? 0,
            })
        } catch {
            set({ items: [], unread: 0 })
        } finally {
            set({ loading: false })
        }
    },

    markRead: async (id) => {
        // Optimistik: nuqta darhol so'nadi, xato bo'lsa keyingi `fetch` tuzatadi.
        set({
            items: get().items.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
            unread: Math.max(0, get().unread - 1),
        })
        try {
            await site.markNotificationsRead([id])
        } catch {
            await get().fetch()
        }
    },

    markAllRead: async () => {
        set({ items: get().items.map((n) => ({ ...n, isRead: true })), unread: 0 })
        try {
            await site.markNotificationsRead()
        } catch {
            await get().fetch()
        }
    },
}))
