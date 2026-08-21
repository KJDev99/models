'use client'

import React from 'react'
import CatalogView from '@/components/shared/catalog/catalog-view'
import AgencyCard from '@/components/agencies/agency-card'
import {
    GRID_PAGE_SIZE,
    SORT_OPTIONS,
} from '@/components/agencies/agencies-data'
import { agencyParams, fetchAgencies } from '@/components/shared/catalog/catalog-fetchers'

// ─────────────────────────────────────────────────────────────────────────────
// Агентства katalogi.
// Figma: desktop 155:12722, mobil 375:14414.
//
// Umumiy qolip — `components/shared/catalog/catalog-view.jsx`. Boshqa
// kataloglardan farqi: filtrlar paneli yo'q (faqat qidiruv va saralash) va
// ko'rinish almashtirgichi yo'q — doim to'rt ustunli setka.
// ─────────────────────────────────────────────────────────────────────────────

const BREADCRUMB = [{ name: 'Главная', href: '/' }, { name: 'Агентства' }]

export default function AgenciesView() {
    return (
        <CatalogView
            title="Агентства"
            breadcrumb={BREADCRUMB}
            fields={[]}
            emptyFilters={{}}
            sortOptions={SORT_OPTIONS}
            searchPlaceholder="Название агенство / ключевые слова"
            faqType="agencies"
            gridPageSize={GRID_PAGE_SIZE}
            listPageSize={GRID_PAGE_SIZE}
            showViewToggle={false}
            fetcher={fetchAgencies}
            buildParams={agencyParams}
            renderCard={(agency) => (
                <AgencyCard key={agency.id} agency={agency} className="h-full" />
            )}
            renderRow={(agency) => (
                <AgencyCard key={agency.id} agency={agency} className="h-full" />
            )}
        />
    )
}
