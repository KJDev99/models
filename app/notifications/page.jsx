'use client'

import React from 'react'
import AuthGuard from '@/components/guards/auth-guard'
import NotificationsView from '@/components/notifications/notifications-view'

export default function NotificationsPage() {
    return (
        <AuthGuard>
            <NotificationsView />
        </AuthGuard>
    )
}
