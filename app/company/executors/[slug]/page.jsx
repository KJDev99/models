'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import CompanyExecutorView from '@/components/company/executors/[slug]/executor-view'

export default function CompanyExecutorViewPage() {
    const { slug } = useParams()
    return <CompanyExecutorView slug={slug} />
}
