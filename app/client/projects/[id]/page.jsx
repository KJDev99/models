'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import ClientProjectDetail from '@/components/client/projects/[id]/project-detail-view'

export default function ClientProjectDetailPage() {
    const { id } = useParams()
    return <ClientProjectDetail id={id} />
}
