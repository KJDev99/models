'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminClientProfile from '@/components/admin/clients/client-profile'
import { COMPANY_PROFILE, EMPTY_PROFILE } from '@/components/admin/clients/clients-data'

export default function AdminClientDetailPage() {
    const { id } = useParams()
    // Figma'da ikki holat chizilgan: to'ldirilgan kompaniya profili va bo'sh profil.
    return <AdminClientProfile profile={id === EMPTY_PROFILE.id ? EMPTY_PROFILE : COMPANY_PROFILE} />
}
