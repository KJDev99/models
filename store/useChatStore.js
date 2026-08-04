import { create } from 'zustand'
import { apiToken } from '@/lib/axios'

// Чаты (Figma: сообщение 193:3022 / 193:3489, Переписка участников 344:17016).
// Bir xil store barcha rollarda ishlaydi — faqat backend ruxsati farq qiladi.
export const useChatStore = create((set, get) => ({
    chats: [],
    activeId: null,
    messages: [],
    loading: false,
    sending: false,
    unread: 0,

    fetchChats: async () => {
        set({ loading: true })
        try {
            const res = await apiToken.get('/chats/')
            const chats = res.data?.results || res.data || []
            set({ chats, unread: chats.reduce((s, c) => s + (c.unreadCount || 0), 0) })
        } catch {
            set({ chats: [] })
        } finally {
            set({ loading: false })
        }
    },

    openChat: async (id) => {
        set({ activeId: id, loading: true, messages: [] })
        try {
            const res = await apiToken.get(`/chats/${id}/messages/`)
            set({ messages: res.data?.results || res.data || [] })
        } catch {
            set({ messages: [] })
        } finally {
            set({ loading: false })
        }
    },

    sendMessage: async (text, attachments = []) => {
        const id = get().activeId
        if (!id || !text?.trim()) return { success: false }
        set({ sending: true })
        try {
            const res = await apiToken.post(`/chats/${id}/messages/`, { text, attachments })
            set({ messages: [...get().messages, res.data] })
            return { success: true, data: res.data }
        } catch (err) {
            return { success: false, error: err?.response?.data || err }
        } finally {
            set({ sending: false })
        }
    },

    // "Пожаловаться" (Figma: 345:20060) — chat yoki profil ustidan shikoyat.
    report: async ({ targetType, targetId, reason, comment }) => {
        try {
            const res = await apiToken.post('/complaints/', {
                targetType,
                targetId,
                reason,
                comment,
            })
            return { success: true, data: res.data }
        } catch (err) {
            return { success: false, error: err?.response?.data || err }
        }
    },

    reset: () => set({ activeId: null, messages: [] }),
}))
