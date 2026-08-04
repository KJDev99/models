'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import ClientExecutorView from '@/components/client/models/[slug]/executor-view'

export default function ClientExecutorViewPage() {
    const { slug } = useParams()
    return <ClientExecutorView slug={slug} />
}
