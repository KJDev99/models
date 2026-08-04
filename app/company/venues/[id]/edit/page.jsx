'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import CompanyEditVenue from '@/components/company/venues/[id]/edit/edit-venue-form'

export default function CompanyEditVenuePage() {
    const { id } = useParams()
    return <CompanyEditVenue id={id} />
}
