'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import CompanyEditProject from '@/components/company/projects/[id]/edit/edit-project-form'

export default function CompanyEditProjectPage() {
    const { id } = useParams()
    return <CompanyEditProject id={id} />
}
