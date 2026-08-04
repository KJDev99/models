'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AgencyPage from '@/components/agencies/[slug]/agency-page'

export default function AgencyDetailPage() {
    const { slug } = useParams()
    return <AgencyPage slug={slug} />
}
