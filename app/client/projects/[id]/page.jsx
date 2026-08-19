'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import ClientProjectDetail from '@/components/client/projects/[id]/project-detail-view'

export default function ClientProjectDetailPage() {
    const params = useSearchParams()
    // `?status=rejected` — Figma'dagi «отклонен» holatini ko'rish uchun.
    return <ClientProjectDetail initialStatus={params.get('status') || 'active'} />
}
