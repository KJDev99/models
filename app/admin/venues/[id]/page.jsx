'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminVenueDetail from '@/components/admin/venues/[id]/venue-detail-view'

export default function AdminVenueDetailPage() {
    const { id } = useParams()
    return <AdminVenueDetail id={id} />
}
