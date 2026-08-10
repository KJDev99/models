'use client'

import React from 'react'
import CatalogView, { inRange } from '@/components/shared/catalog/catalog-view'
import ProjectCard from '@/components/projects/project-card'
import ProjectRowCard from '@/components/projects/project-row-card'
import {
    EMPTY_PROJECT_FILTERS,
    FILTER_FIELDS,
    GRID_PAGE_SIZE,
    LIST_PAGE_SIZE,
    PROJECTS,
    PROJECTS_FAQ,
    SORT_OPTIONS,
} from '@/components/projects/projects-data'

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

const CITY_LABELS = {
    moscow: 'Москва',
    spb: 'Санкт-Петербург',
    kazan: 'Казань',
    ekb: 'Екатеринбург',
}

function matchFilters(project, filters) {
    if (filters.city && CITY_LABELS[filters.city] !== project.city) return false
    if (filters.lookingFor && filters.lookingFor !== project.lookingFor) return false
    if (filters.category && filters.category !== project.category) return false
    // «Количество исполнителей» — tanlangan qiymat yuqori chegara.
    if (filters.performers && project.performers > Number(filters.performers)) return false
    if (!inRange(project.pricePerHour, filters.priceFrom, filters.priceTo)) return false
    // Sanalar ISO ko'rinishida (YYYY-MM-DD) — satr sifatida solishtirsa ham to'g'ri.
    if (filters.dateFrom && project.dateISO < filters.dateFrom) return false
    if (filters.dateTo && project.dateISO > filters.dateTo) return false
    return true
}

function sortItems(list, sort) {
    if (sort === 'date-asc')
        return [...list].sort((a, b) => a.dateISO.localeCompare(b.dateISO))
    if (sort === 'price-asc') return [...list].sort((a, b) => a.pricePerHour - b.pricePerHour)
    if (sort === 'price-desc') return [...list].sort((a, b) => b.pricePerHour - a.pricePerHour)
    if (sort === 'new') return [...list].reverse()
    return list
}

export default function ProjectsView() {
    return (
        <CatalogView
            title="Проекты"
            breadcrumb={BREADCRUMB}
            items={PROJECTS}
            fields={FILTER_FIELDS}
            emptyFilters={EMPTY_PROJECT_FILTERS}
            sortOptions={SORT_OPTIONS}
            searchPlaceholder="Название проекта / ключевые слова"
            faq={PROJECTS_FAQ}
            gridPageSize={GRID_PAGE_SIZE}
            listPageSize={LIST_PAGE_SIZE}
            gridCols="lg:grid-cols-3"
            getSearchText={(project) => project.title}
            matchFilters={matchFilters}
            sortItems={sortItems}
            renderCard={(project) => (
                <ProjectCard key={project.id} project={project} className="h-full" />
            )}
            renderRow={(project) => <ProjectRowCard key={project.id} project={project} />}
        />
    )
}
