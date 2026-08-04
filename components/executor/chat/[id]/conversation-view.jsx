'use client'

import React, { useEffect } from 'react'
import ChatWindow from '@/components/shared/chat-window'
import { useAuth } from '@/lib/use-auth'
import { useChatStore } from '@/store/useChatStore'

export default function ExecutorConversation({ id }) {
    const { user } = useAuth()
    const chats = useChatStore((s) => s.chats)
    const messages = useChatStore((s) => s.messages)
    const loading = useChatStore((s) => s.loading)
    const sending = useChatStore((s) => s.sending)
    const fetchChats = useChatStore((s) => s.fetchChats)
    const openChat = useChatStore((s) => s.openChat)
    const sendMessage = useChatStore((s) => s.sendMessage)

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
            sending={sending}
            currentUserId={user?.id}
            onSend={sendMessage}
            readOnly={false}
        />
    )
}
