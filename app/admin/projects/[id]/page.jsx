'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminProjectDetailLoader from '@/components/admin/projects/[id]/project-detail-loader'

export default function AdminProjectDetailPage() {
    const { id } = useParams()
    return <AdminProjectDetailLoader id={id} />
}
