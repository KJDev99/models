'use client'

import React from 'react'
import CatalogView from '@/components/shared/catalog/catalog-view'
import AgencyCard from '@/components/agencies/agency-card'
import {
    AGENCIES,
    AGENCIES_FAQ,
    GRID_PAGE_SIZE,
    SORT_OPTIONS,
} from '@/components/agencies/agencies-data'

// ─────────────────────────────────────────────────────────────────────────────
// Агентства katalogi.
// Figma: desktop 155:12722, mobil 375:14414.
//
// Umumiy qolip — `components/shared/catalog/catalog-view.jsx`. Boshqa
// kataloglardan farqi: filtrlar paneli yo'q (faqat qidiruv va saralash) va
// ko'rinish almashtirgichi yo'q — doim to'rt ustunli setka.
// ─────────────────────────────────────────────────────────────────────────────

const BREADCRUMB = [{ name: 'Главная', href: '/' }, { name: 'Агентства' }]

function sortItems(list, sort) {
    if (sort === 'name-asc') return [...list].sort((a, b) => a.name.localeCompare(b.name, 'ru'))
    if (sort === 'executors-desc') return [...list].sort((a, b) => b.executors - a.executors)
    if (sort === 'new') return [...list].reverse()
    return list
}

export default function AgenciesView() {
    return (
        <CatalogView
            title="Агентства"
            breadcrumb={BREADCRUMB}
            items={AGENCIES}
            fields={[]}
            emptyFilters={{}}
            sortOptions={SORT_OPTIONS}
            searchPlaceholder="Название агенство / ключевые слова"
            faq={AGENCIES_FAQ}
            gridPageSize={GRID_PAGE_SIZE}
            listPageSize={GRID_PAGE_SIZE}
            showViewToggle={false}
            sortItems={sortItems}
            renderCard={(agency) => (
                <AgencyCard key={agency.id} agency={agency} className="h-full" />
            )}
            renderRow={(agency) => (
                <AgencyCard key={agency.id} agency={agency} className="h-full" />
            )}
        />
    )
}
