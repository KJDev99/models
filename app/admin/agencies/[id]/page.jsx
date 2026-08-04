'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminAgencyDetail from '@/components/admin/agencies/[id]/agency-detail-view'

export default function AdminAgencyDetailPage() {
    const { id } = useParams()
    return <AdminAgencyDetail id={id} />
}
