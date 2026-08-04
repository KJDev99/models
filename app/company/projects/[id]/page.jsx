'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import CompanyProjectDetail from '@/components/company/projects/[id]/project-detail-view'

export default function CompanyProjectDetailPage() {
    const { id } = useParams()
    return <CompanyProjectDetail id={id} />
}
