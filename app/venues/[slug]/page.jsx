'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import VenuePage from '@/components/venues/[slug]/venue-page'

export default function VenueDetailPage() {
    const { slug } = useParams()
    return <VenuePage slug={slug} />
}
