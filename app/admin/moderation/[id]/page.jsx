'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminModerationDetail from '@/components/admin/moderation/[id]/moderation-detail-view'

export default function AdminModerationDetailPage() {
    const { id } = useParams()
    return <AdminModerationDetail id={id} />
}
