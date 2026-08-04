'use client'

import React, { useEffect } from 'react'
import Container from '@/components/ui/container'
import PageHeader from '@/components/ui/page-header'
import Button from '@/components/ui/button'
import NotificationList from '@/components/shared/notification-list'
import { useNotificationStore } from '@/store/useNotificationStore'

// Figma: уведомление (173:6099).
export default function NotificationsView() {
    const items = useNotificationStore((s) => s.items)
    const loading = useNotificationStore((s) => s.loading)
    const unread = useNotificationStore((s) => s.unread)
    const fetchItems = useNotificationStore((s) => s.fetch)
    const markRead = useNotificationStore((s) => s.markRead)
    const markAllRead = useNotificationStore((s) => s.markAllRead)

    useEffect(() => {
        fetchItems()
    }, [fetchItems])

    return (
        <Container className="my-8 lg:my-12">
            <PageHeader
                breadcrumb={[{ name: 'Главная', href: '/' }, { name: 'Уведомления' }]}
                title="Уведомления"
                count={unread || undefined}
                action={
                    unread > 0 && (
                        <Button variant="ghost" onClick={markAllRead}>
                            Прочитать все
                        </Button>
                    )
                }
            />

            <NotificationList items={items} loading={loading} onRead={markRead} />
        </Container>
    )
}
