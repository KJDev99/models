'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import ClientEditVenue from '@/components/client/venues/[id]/edit/edit-venue-form'

export default function ClientEditVenuePage() {
    const { id } = useParams()
    return <ClientEditVenue id={id} />
}
