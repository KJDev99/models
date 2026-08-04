'use client'

import React, { useEffect } from 'react'
import Card from '@/components/ui/card'
import ChatList from '@/components/shared/chat-list'
import { useChatStore } from '@/store/useChatStore'

// Figma: Чаты (344:16231) — admin barcha suhbatlarni ko'radi.
export default function AdminChats() {
    const chats = useChatStore((s) => s.chats)
    const loading = useChatStore((s) => s.loading)
    const fetchChats = useChatStore((s) => s.fetchChats)

    useEffect(() => {
        fetchChats()
    }, [fetchChats])

    return (
        <Card title="Чаты" padded={false} className="border-0 bg-transparent">
            <ChatList chats={chats} loading={loading} basePath="/admin/chats" />
        </Card>
    )
}
