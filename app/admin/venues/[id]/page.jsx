'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminVenueDetailLoader from '@/components/admin/venues/[id]/venue-detail-loader'

export default function AdminVenueDetailPage() {
    const { id } = useParams()
    return <AdminVenueDetailLoader id={id} />
}
