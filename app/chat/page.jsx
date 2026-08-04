'use client'

import React from 'react'
import AuthGuard from '@/components/guards/auth-guard'
import ChatView from '@/components/chat/chat-view'

export default function ChatPage() {
    return (
        <AuthGuard>
            <ChatView basePath="/chat" />
        </AuthGuard>
    )
}
