'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import PersonPage from '@/components/persons/[slug]/person-page'

export default function PersonDetailPage() {
    const { slug } = useParams()
    return <PersonPage slug={slug} />
}
