'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import CompanyVenueDetail from '@/components/company/venues/[id]/venue-detail-view'

export default function CompanyVenueDetailPage() {
    const { id } = useParams()
    return <CompanyVenueDetail id={id} />
}
