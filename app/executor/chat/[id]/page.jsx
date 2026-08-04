'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import ExecutorConversation from '@/components/executor/chat/[id]/conversation-view'

export default function ExecutorConversationPage() {
    const { id } = useParams()
    return <ExecutorConversation id={id} />
}
