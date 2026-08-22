import { create } from 'zustand'
import * as site from '@/lib/api/site'
import * as customerApi from '@/lib/api/customer'
import * as performerApi from '@/lib/api/performer'
import * as agencyApi from '@/lib/api/agency'
import { chatListItem, chatMessage } from '@/lib/adapters'
import { getAccessToken, getUser } from '@/lib/auth'
import { ROLES } from '@/lib/roles'
import { toApiError } from '@/lib/api-error'

// ─────────────────────────────────────────────────────────────────────────────
// Чаты — backend/site.md va rol bo'yicha bo'limlar.
//
// O'qish (ro'yxat va tarix) barcha rollarda `/site/chats` orqali ishlaydi;
// yozish esa rolga tegishli endpointda (`/customer|performer|agency/chats/…`),
// chunki backend ruxsatni shu yerda tekshiradi.
//
// Live-chat: `wss://<host>/api/v1/ws/chat/{conversationId}?token=<access>`
// Yuborish: socket.send(JSON.stringify({ body, attachment_url }))
// Kelgan hodisa: { event: 'message', data: … }
// ─────────────────────────────────────────────────────────────────────────────

const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || ''

function roleApi() {
    const role = getUser()?.role
    if (role === ROLES.EXECUTOR) return performerApi
    if (role === ROLES.AGENCY) return agencyApi
    return customerApi
}

export const useChatStore = create((set, get) => ({
    chats: [],
    activeId: null,
    companion: null,
    messages: [],
    loading: false,
    sending: false,
    unread: 0,
    socket: null,

    fetchChats: async () => {
        set({ loading: true })
        try {
            const data = await site.chats()
            const chats = (Array.isArray(data) ? data : data?.items || []).map(chatListItem)
            set({
                chats,
                unread: chats.reduce((sum, c) => sum + (c.unreadCount || 0), 0),
            })
        } catch {
            set({ chats: [] })
        } finally {
            set({ loading: false })
        }
    },

    // Suhbat tarixini ochadi va WebSocket'ga ulanadi.
    openChat: async (id) => {
        const me = getUser()?.id
        get().disconnect()
        set({ activeId: id, loading: true, messages: [], companion: null })

        try {
            const data = await site.chat(id)
            const list = data?.messages || []
            set({
                messages: list.map((m) => chatMessage(m, me)).filter(Boolean),
                companion: get().chats.find((c) => c.id === id)?.companion || null,
            })
        } catch {
            set({ messages: [] })
        } finally {
            set({ loading: false })
        }

        get().connect(id)
    },

    // Yangi suhbat ochish (profil sahifasidagi «Написать сообщение»).
    startChat: async (peerId) => {
        try {
            const data = await roleApi().openChat(peerId)
            const id = data?.conversation?.id || data?.id
            await get().fetchChats()
            return { success: true, id }
        } catch (err) {
            return { success: false, error: toApiError(err) }
        }
    },

    sendMessage: async (text, attachmentUrl = null) => {
        const id = get().activeId
        // Matn yoki fayl — kamida bittasi bo'lishi kerak (backend javobi, 21-band).
        const body = text?.trim() || ''
        if (!id || (!body && !attachmentUrl)) return { success: false }

        set({ sending: true })
        try {
            const created = await roleApi().sendMessage(id, {
                body: body || null,
                attachmentUrl,
            })
            const me = getUser()?.id
            // WebSocket ham xuddi shu xabarni qaytarishi mumkin — `id` bo'yicha
            // takrorlanmasligi `pushMessage` ichida tekshiriladi.
            get().pushMessage(chatMessage(created, me))
            return { success: true, data: created }
        } catch (err) {
            return { success: false, error: toApiError(err) }
        } finally {
            set({ sending: false })
        }
    },

    // WS va REST bir xil xabarni bermasligi uchun `id` bo'yicha filtr.
    pushMessage: (message) => {
        if (!message) return
        const exists = get().messages.some((m) => m.id === message.id)
        if (exists) return
        set({ messages: [...get().messages, message] })
    },

    connect: (id) => {
        if (typeof window === 'undefined' || !WS_BASE) return
        const token = getAccessToken()
        if (!token) return

        try {
            const socket = new WebSocket(
                `${WS_BASE}/api/v1/ws/chat/${id}?token=${encodeURIComponent(token)}`,
            )
            socket.onmessage = (event) => {
                try {
                    const payload = JSON.parse(event.data)
                    if (payload.event !== 'message') return
                    const raw =
                        typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data
                    get().pushMessage(chatMessage(raw, getUser()?.id))
                } catch {
                    /* noto'g'ri paket — e'tiborsiz */
                }
            }
            // Ulanish uzilsa REST baribir ishlaydi, shuning uchun qayta ulanmaymiz.
            socket.onerror = () => {}
            set({ socket })
        } catch {
            /* WS mavjud bo'lmasa chat REST orqali ishlayveradi */
        }
    },

    disconnect: () => {
        const socket = get().socket
        if (socket) {
            socket.onmessage = null
            socket.close()
        }
        set({ socket: null })
    },

    // «Пожаловаться» (Figma 345:20060) — chat ustidan shikoyat.
    report: async ({ accusedId, conversationId, reason, body }) => {
        try {
            const data = await site.complain({ accusedId, conversationId, reason, body })
            return { success: true, data }
        } catch (err) {
            return { success: false, error: toApiError(err) }
        }
    },

    reset: () => {
        get().disconnect()
        set({ activeId: null, messages: [], companion: null })
    },
}))
