'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminExecutorProfileLoader from '@/components/admin/executors/[id]/executor-profile-loader'

export default function AdminExecutorDetailPage() {
    const { id } = useParams()
    return <AdminExecutorProfileLoader id={id} />
}
