'use client'

import React from 'react'
import Link from 'next/link'
import { formatDateTime } from '@/lib/format'
import EmptyState from '@/components/ui/empty-state'
import { SkeletonRows } from '@/components/ui/skeleton'

// Figma: уведомление (173:6099).
export default function NotificationList({ items = [], loading, onRead }) {
    if (loading) return <SkeletonRows count={5} />

    if (!items.length) {
        return (
            <EmptyState
                title="Уведомлений нет"
                description="Здесь появятся приглашения в проекты, отклики и решения модерации."
            />
        )
    }

    return (
        <ul className="divide-y divide-black/8 overflow-hidden rounded-[16px] border border-black/8 bg-white">
            {items.map((n) => {
                const body = (
                    <div className="flex items-start gap-3 p-4">
                        <span
                            className={`mt-2 h-2 w-2 shrink-0 rounded-full ${n.isRead ? 'bg-transparent' : 'bg-gold'}`}
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-base text-black">{n.title}</p>
                            {n.text && <p className="mt-1 text-sm text-grey">{n.text}</p>}
                            <p className="mt-2 text-sm text-grey/80">{formatDateTime(n.createdAt)}</p>
                        </div>
                    </div>
                )

                return (
                    <li key={n.id} onClick={() => !n.isRead && onRead?.(n.id)}>
                        {n.href ? (
                            <Link href={n.href} className="block transition-colors hover:bg-light-white">
                                {body}
                            </Link>
                        ) : (
                            <div className="cursor-default">{body}</div>
                        )}
                    </li>
                )
            })}
        </ul>
    )
}
