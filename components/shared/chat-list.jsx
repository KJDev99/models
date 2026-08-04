'use client'

import React from 'react'
import Link from 'next/link'
import { formatDateTime } from '@/lib/format'
import Avatar from '@/components/ui/avatar'
import EmptyState from '@/components/ui/empty-state'
import { SkeletonRows } from '@/components/ui/skeleton'

// Figma: Чаты (382:17332) — suhbatlar ro'yxati. basePath rolga qarab o'zgaradi.
export default function ChatList({ chats = [], loading, basePath = '/chat', activeId }) {
    if (loading) return <SkeletonRows count={5} />

    if (!chats.length) {
        return (
            <EmptyState
                title="Сообщений пока нет"
                description="Напишите исполнителю или заказчику из его профиля — переписка появится здесь."
            />
        )
    }

    return (
        <ul className="divide-y divide-black/8 overflow-hidden rounded-[16px] border border-black/8 bg-white">
            {chats.map((chat) => (
                <li key={chat.id}>
                    <Link
                        href={`${basePath}/${chat.id}`}
                        className={`flex items-center gap-4 p-4 transition-colors hover:bg-light-white ${
                            String(activeId) === String(chat.id) ? 'bg-light-white' : ''
                        }`}
                    >
                        <Avatar src={chat.companion?.avatar} name={chat.companion?.name} size="lg" />
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                                <p className="truncate text-base text-black">
                                    {chat.companion?.name || 'Диалог'}
                                </p>
                                <span className="shrink-0 text-sm text-grey">
                                    {formatDateTime(chat.lastMessage?.createdAt)}
                                </span>
                            </div>
                            <p className="mt-1 truncate text-sm text-grey">
                                {chat.lastMessage?.text || 'Нет сообщений'}
                            </p>
                        </div>
                        {chat.unreadCount > 0 && (
                            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-gold px-2 text-xs text-white">
                                {chat.unreadCount}
                            </span>
                        )}
                    </Link>
                </li>
            ))}
        </ul>
    )
}
