'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import VideographerDetail from '@/components/videographers/[slug]/videographer-detail'

export default function VideographerDetailPage() {
    const { slug } = useParams()
    return <VideographerDetail slug={slug} />
}
