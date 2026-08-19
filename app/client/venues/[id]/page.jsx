'use client'

import React from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import ClientVenueDetail from '@/components/client/venues/[id]/venue-detail-view'

export default function ClientVenueDetailPage() {
    const { id } = useParams()
    const params = useSearchParams()
    // `?status=rejected` — Figma'dagi «Отклонен» holatini ko'rish uchun.
    return <ClientVenueDetail id={id} initialStatus={params.get('status') || 'active'} />
}
