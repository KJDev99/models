'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import ModelDetail from '@/components/models/[slug]/model-detail'

export default function ModelDetailPage() {
    const { slug } = useParams()
    return <ModelDetail slug={slug} />
}
