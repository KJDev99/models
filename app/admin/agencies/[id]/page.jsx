'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminAgencyProfileLoader from '@/components/admin/agencies/[id]/agency-profile-loader'

export default function AdminAgencyDetailPage() {
    const { id } = useParams()
    return <AdminAgencyProfileLoader id={id} />
}
