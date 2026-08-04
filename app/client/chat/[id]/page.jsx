'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import ClientConversation from '@/components/client/chat/[id]/conversation-view'

export default function ClientConversationPage() {
    const { id } = useParams()
    return <ClientConversation id={id} />
}
