'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import ClientEditProject from '@/components/client/projects/[id]/edit/edit-project-form'

export default function ClientEditProjectPage() {
    const { id } = useParams()
    return <ClientEditProject id={id} />
}
