'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import CompanyConversation from '@/components/company/chat/[id]/conversation-view'

export default function CompanyConversationPage() {
    const { id } = useParams()
    return <CompanyConversation id={id} />
}
