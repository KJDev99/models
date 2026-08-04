'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminComplaintDetail from '@/components/admin/complaints/[id]/complaint-detail-view'

export default function AdminComplaintDetailPage() {
    const { id } = useParams()
    return <AdminComplaintDetail id={id} />
}
