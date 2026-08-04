'use client'

import React, { useEffect } from 'react'
import ChatWindow from '@/components/shared/chat-window'
import { useChatStore } from '@/store/useChatStore'

// Figma: "Переписка участников" (344:17016) — admin faqat o'qiydi.
export default function AdminConversation({ id }) {
    const chats = useChatStore((s) => s.chats)
    const messages = useChatStore((s) => s.messages)
    const loading = useChatStore((s) => s.loading)
    const fetchChats = useChatStore((s) => s.fetchChats)
    const openChat = useChatStore((s) => s.openChat)

    useEffect(() => {
        fetchChats()
    }, [fetchChats])

    useEffect(() => {
        if (id) openChat(id)
    }, [id, openChat])

    const chat = chats.find((c) => String(c.id) === String(id))

    return (
        <ChatWindow
            messages={messages}
            companion={chat?.companion}
            loading={loading}
            readOnly
        />
    )
}
