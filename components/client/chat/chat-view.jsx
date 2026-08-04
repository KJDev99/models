'use client'

import React, { useEffect } from 'react'
import Card from '@/components/ui/card'
import ChatList from '@/components/shared/chat-list'
import { useChatStore } from '@/store/useChatStore'

export default function ClientChat() {
    const chats = useChatStore((s) => s.chats)
    const loading = useChatStore((s) => s.loading)
    const fetchChats = useChatStore((s) => s.fetchChats)

    useEffect(() => {
        fetchChats()
    }, [fetchChats])

    return (
        <Card title="Сообщения" padded={false} className="border-0 bg-transparent">
            <ChatList chats={chats} loading={loading} basePath="/client/chat" />
        </Card>
    )
}
