'use client'

import React, { useEffect } from 'react'
import Container from '@/components/ui/container'
import PageHeader from '@/components/ui/page-header'
import ChatList from '@/components/shared/chat-list'
import SupportButton from '@/components/shared/support-button'
import { useChatStore } from '@/store/useChatStore'

// Figma: Чаты (382:17332).
export default function ChatView({ basePath = '/chat', activeId }) {
    const chats = useChatStore((s) => s.chats)
    const loading = useChatStore((s) => s.loading)
    const fetchChats = useChatStore((s) => s.fetchChats)

    useEffect(() => {
        fetchChats()
    }, [fetchChats])

    return (
        <Container className="my-8 lg:my-12">
            <PageHeader
                breadcrumb={[{ name: 'Главная', href: '/' }, { name: 'Сообщения' }]}
                title="Сообщения"
                action={<SupportButton basePath={basePath} />}
            />
            <ChatList chats={chats} loading={loading} basePath={basePath} activeId={activeId} />
        </Container>
    )
}
