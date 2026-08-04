'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminConversation from '@/components/admin/chats/[id]/conversation-view'

export default function AdminConversationPage() {
    const { id } = useParams()
    return <AdminConversation id={id} />
}
