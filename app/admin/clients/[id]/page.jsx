'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminClientDetail from '@/components/admin/clients/[id]/client-detail-view'

export default function AdminClientDetailPage() {
    const { id } = useParams()
    return <AdminClientDetail id={id} />
}
