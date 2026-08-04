'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import PhotographerDetail from '@/components/photographers/[slug]/photographer-detail'

export default function PhotographerDetailPage() {
    const { slug } = useParams()
    return <PhotographerDetail slug={slug} />
}
