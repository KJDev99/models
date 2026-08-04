'use client'

import React from 'react'
import ProjectDetail from '@/components/shared/project-detail'

export default function ProjectPage({ slug }) {
    return <ProjectDetail slug={slug} basePath="/projects" />
}
