'use client'

import React, { useEffect } from 'react'
import Container from '@/components/ui/container'
import PageHeader from '@/components/ui/page-header'
import ChatList from '@/components/shared/chat-list'
import ChatWindow from '@/components/shared/chat-window'
import ComplaintModal from '@/components/shared/complaint-modal'
import { useAuth } from '@/lib/use-auth'
import { useChatStore } from '@/store/useChatStore'

// Figma: сообщение (193:3489) — chapda dialoglar, o'ngda yozishmalar.
export default function ConversationView({ id, basePath = '/chat' }) {
    const { user } = useAuth()
    const chats = useChatStore((s) => s.chats)
    const messages = useChatStore((s) => s.messages)
    const loading = useChatStore((s) => s.loading)
    const sending = useChatStore((s) => s.sending)
    const fetchChats = useChatStore((s) => s.fetchChats)
    const openChat = useChatStore((s) => s.openChat)
    const sendMessage = useChatStore((s) => s.sendMessage)

    const [complaintOpen, setComplaintOpen] = React.useState(false)

    useEffect(() => {
        fetchChats()
    }, [fetchChats])

    const reset = useChatStore((s) => s.reset)

    useEffect(() => {
        if (!id) return undefined
        openChat(id)
        // Sahifadan chiqilganda WebSocket yopiladi.
        return () => reset()
    }, [id, openChat, reset])

    const chat = chats.find((c) => String(c.id) === String(id))

    return (
        <Container className="my-8 lg:my-12">
            <PageHeader
                breadcrumb={[
                    { name: 'Главная', href: '/' },
                    { name: 'Сообщения', href: basePath },
                    { name: chat?.companion?.name || 'Диалог' },
                ]}
                title="Сообщения"
            />

            <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:gap-8">
                <div className="hidden lg:block">
                    <ChatList chats={chats} basePath={basePath} activeId={id} />
                </div>

                <div className="min-w-0">
                    <ChatWindow
                        messages={messages}
                        companion={chat?.companion}
                        loading={loading}
                        sending={sending}
                        currentUserId={user?.id}
                        onSend={sendMessage}
                    />

                    <button
                        type="button"
                        onClick={() => setComplaintOpen(true)}
                        className="mt-4 text-sm text-grey underline-offset-4 transition-colors hover:text-danger hover:underline"
                    >
                        Пожаловаться на собеседника
                    </button>
                </div>
            </div>

            <ComplaintModal
                open={complaintOpen}
                onClose={() => setComplaintOpen(false)}
                target={{
                    conversationId: id,
                    accusedId: chat?.peerId,
                    name: chat?.companion?.name,
                }}
            />
        </Container>
    )
}
