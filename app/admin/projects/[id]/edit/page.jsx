'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import AdminProjectFormLoader from '@/components/admin/projects/[id]/edit/project-form-loader'

export default function AdminEditProjectPage() {
    const { id } = useParams()
    return <AdminProjectFormLoader id={id} />
}
