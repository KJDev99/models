'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AuthGuard from '@/components/guards/auth-guard'
import ConversationView from '@/components/chat/[id]/conversation-view'

export default function ConversationPage() {
    const { id } = useParams()
    return (
        <AuthGuard>
            <ConversationView id={id} basePath="/chat" />
        </AuthGuard>
    )
}
