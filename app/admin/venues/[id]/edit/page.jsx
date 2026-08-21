'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminVenueFormLoader from '@/components/admin/venues/[id]/edit/venue-form-loader'

export default function AdminEditVenuePage() {
    const { id } = useParams()
    return <AdminVenueFormLoader id={id} />
}
