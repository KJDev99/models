'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminExecutorDetail from '@/components/admin/executors/[id]/executor-detail-view'

export default function AdminExecutorDetailPage() {
    const { id } = useParams()
    return <AdminExecutorDetail id={id} />
}
