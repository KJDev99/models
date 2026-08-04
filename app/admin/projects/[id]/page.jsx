'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminProjectDetail from '@/components/admin/projects/[id]/project-detail-view'

export default function AdminProjectDetailPage() {
    const { id } = useParams()
    return <AdminProjectDetail id={id} />
}
