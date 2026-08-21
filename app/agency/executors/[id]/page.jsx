'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AgencyExecutorDetail from '@/components/agency/executors/[id]/executor-detail-view'

export default function AgencyExecutorPage() {
    const { id } = useParams()
    return <AgencyExecutorDetail id={id} />
}
