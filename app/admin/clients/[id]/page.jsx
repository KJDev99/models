'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminClientProfileLoader from '@/components/admin/clients/[id]/client-profile-loader'

export default function AdminClientDetailPage() {
    const { id } = useParams()
    return <AdminClientProfileLoader id={id} />
}
