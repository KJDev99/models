'use client'

import React, { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { LifeBuoy } from 'lucide-react'
import Container from '@/components/ui/container'
import PageHeader from '@/components/ui/page-header'
import ChatList from '@/components/shared/chat-list'
import { useChatStore } from '@/store/useChatStore'
import { useApi, useAction } from '@/lib/use-api'
import * as site from '@/lib/api/site'

// Figma: Чаты (382:17332).
export default function ChatView({ basePath = '/chat', activeId }) {
    const router = useRouter()
    const chats = useChatStore((s) => s.chats)
    const loading = useChatStore((s) => s.loading)
    const fetchChats = useChatStore((s) => s.fetchChats)
    const startChat = useChatStore((s) => s.startChat)

    useEffect(() => {
        fetchChats()
    }, [fetchChats])

    // «Поддержка» — GET /site/support beradigan tizim foydalanuvchisi bilan
    // oddiy suhbat. Ruchka hali yo'q (404) — shunda tugma chizilmaydi.
    const fetchSupport = useCallback(() => site.support(), [])
    const { data: support } = useApi(fetchSupport)
    const open = useAction(startChat)

    async function openSupport() {
        const peer = support?.user_id || support?.id
        if (!peer) return
        const res = await open.run(peer)
        if (!res.success || !res.data?.id) {
            toast.error(res.error?.message || 'Не удалось открыть чат поддержки')
            return
        }
        router.push(`${basePath}/${res.data.id}`)
    }

    return (
        <Container className="my-8 lg:my-12">
            <PageHeader
                breadcrumb={[{ name: 'Главная', href: '/' }, { name: 'Сообщения' }]}
                title="Сообщения"
                action={
                    support ? (
                        <button
                            type="button"
                            onClick={openSupport}
                            disabled={open.loading}
                            className="flex cursor-pointer items-center gap-[8px] rounded-[6px] border border-gold px-[16px] py-[10px] text-[14px] font-medium text-gold transition-colors hover:bg-gold hover:text-white disabled:opacity-50 lg:px-[24px] lg:py-[12px] lg:text-[16px]"
                        >
                            <LifeBuoy size={20} strokeWidth={2} />
                            {support.name || 'Поддержка'}
                        </button>
                    ) : null
                }
            />
            <ChatList chats={chats} loading={loading} basePath={basePath} activeId={activeId} />
        </Container>
    )
}
