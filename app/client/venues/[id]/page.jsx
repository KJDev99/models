'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import ClientVenueDetail from '@/components/client/venues/[id]/venue-detail-view'

export default function ClientVenueDetailPage() {
    const { id } = useParams()
    return <ClientVenueDetail id={id} />
}
