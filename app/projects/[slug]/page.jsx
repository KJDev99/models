'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import ProjectPage from '@/components/projects/[slug]/project-page'

export default function ProjectDetailPage() {
    const { slug } = useParams()
    return <ProjectPage slug={slug} />
}
