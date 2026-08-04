'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminEditExecutor from '@/components/admin/executors/[id]/edit/edit-executor-form'

export default function AdminEditExecutorPage() {
    const { id } = useParams()
    return <AdminEditExecutor id={id} />
}
