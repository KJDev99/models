'use client'

import React from 'react'
import CatalogPage from '@/components/shared/catalog-page'
import ProjectCard from '@/components/shared/project-card'

// Figma: Проекты katalogi.
export default function ProjectsView() {
    return (
        <CatalogPage
            resource="projects"
            title="Проекты"
            description="Открытые кастинги и съёмки: требования, гонорар, даты."
            breadcrumb={[{ name: 'Главная', href: '/' }, { name: 'Проекты' }]}
            columns={'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}
            filterFields={['city', 'price', 'categories']}
            renderItem={(item) => <ProjectCard key={item.id} project={item} />}
        />
    )
}
