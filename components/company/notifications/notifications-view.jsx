'use client'

import React, { useEffect } from 'react'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import NotificationList from '@/components/shared/notification-list'
import { useNotificationStore } from '@/store/useNotificationStore'

export default function CompanyNotifications() {
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
        <Card
            title="Уведомления"
            padded={false}
            className="border-0 bg-transparent"
            action={
                unread > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllRead}>
                        Прочитать все
                    </Button>
                )
            }
        >
            <NotificationList items={items} loading={loading} onRead={markRead} />
        </Card>
    )
}
