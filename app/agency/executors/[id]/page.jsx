'use client'

import React, { Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import AgencyExecutorDetail from '@/components/agency/executors/[id]/executor-detail-view'

export default function AgencyExecutorPage() {
    return (
        <Suspense fallback={null}>
            <ExecutorWithParams />
        </Suspense>
    )
}

function ExecutorWithParams() {
    const { id } = useParams()
    const params = useSearchParams()
    // `?status=paused | blocked | moderation` — holat variantlarini ko'rish uchun.
    return <AgencyExecutorDetail id={id} initialStatus={params.get('status') || 'active'} />
}
