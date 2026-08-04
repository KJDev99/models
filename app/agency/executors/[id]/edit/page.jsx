'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AgencyEditExecutor from '@/components/agency/executors/[id]/edit/edit-executor-form'

export default function AgencyEditExecutorPage() {
    const { id } = useParams()
    return <AgencyEditExecutor id={id} />
}
