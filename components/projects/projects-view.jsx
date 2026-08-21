'use client'

import React from 'react'
import CatalogView from '@/components/shared/catalog/catalog-view'
import ProjectCard from '@/components/projects/project-card'
import ProjectRowCard from '@/components/projects/project-row-card'
import {
    EMPTY_PROJECT_FILTERS,
    FILTER_FIELDS,
    GRID_PAGE_SIZE,
    LIST_PAGE_SIZE,
    SORT_OPTIONS,
} from '@/components/projects/projects-data'
import { fetchProjects, projectParams } from '@/components/shared/catalog/catalog-fetchers'

// ─────────────────────────────────────────────────────────────────────────────
// Проекты katalogi.
// Figma: setka 141:8989 · ro'yxat 145:11176 · mobil 373:16436 / 373:17675 ·
// mobil filtrlar 360:22138 · 360:21739 · 360:23274.
//
// Umumiy qolip — `components/shared/catalog/catalog-view.jsx`. Ijrochilar
// katalogidan farqi: setka uch ustunli, kartochka boshqacha va filtrlarda
// sanalar oralig'i bor.
// ─────────────────────────────────────────────────────────────────────────────

const BREADCRUMB = [{ name: 'Главная', href: '/' }, { name: 'Проекты' }]

export default function ProjectsView() {
    return (
        <CatalogView
            title="Проекты"
            breadcrumb={BREADCRUMB}
            fields={FILTER_FIELDS}
            emptyFilters={EMPTY_PROJECT_FILTERS}
            sortOptions={SORT_OPTIONS}
            searchPlaceholder="Название проекта / ключевые слова"
            faqType="projects"
            gridPageSize={GRID_PAGE_SIZE}
            listPageSize={LIST_PAGE_SIZE}
            gridCols="lg:grid-cols-3"
            fetcher={fetchProjects}
            buildParams={projectParams}
            renderCard={(project) => (
                <ProjectCard key={project.id} project={project} className="h-full" />
            )}
            renderRow={(project) => <ProjectRowCard key={project.id} project={project} />}
        />
    )
}
