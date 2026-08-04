'use client'

import React from 'react'
import VenueDetail from '@/components/shared/venue-detail'

export default function VenuePage({ slug }) {
    return <VenueDetail slug={slug} basePath="/venues" />
}
