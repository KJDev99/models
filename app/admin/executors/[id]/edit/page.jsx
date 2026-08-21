'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminExecutorFormLoader from '@/components/admin/executors/[id]/edit/executor-form-loader'

export default function AdminEditExecutorPage() {
    const { id } = useParams()
    return <AdminExecutorFormLoader id={id} />
}
