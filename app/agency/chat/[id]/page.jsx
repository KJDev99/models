'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AgencyConversation from '@/components/agency/chat/[id]/conversation-view'

export default function AgencyConversationPage() {
    const { id } = useParams()
    return <AgencyConversation id={id} />
}
