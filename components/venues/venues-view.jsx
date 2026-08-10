'use client'

import React from 'react'
import CatalogView, { inRange } from '@/components/shared/catalog/catalog-view'
import VenueCard from '@/components/venues/venue-card'
import VenueRowCard from '@/components/venues/venue-row-card'
import {
    EMPTY_VENUE_FILTERS,
    FILTER_FIELDS,
    GRID_PAGE_SIZE,
    LIST_PAGE_SIZE,
    SORT_OPTIONS,
    VENUES,
    VENUES_FAQ,
} from '@/components/venues/venues-data'

// ─────────────────────────────────────────────────────────────────────────────
// Площадки katalogi.
// Figma: setka 120:1121 · ro'yxat 128:3387 · mobil 373:12458 / 373:12970.
//
// Umumiy qolip — `components/shared/catalog/catalog-view.jsx`; bu yerda faqat
// Площадкиga xos ma'lumot, filtr mantiqi va kartochkalar.
// ─────────────────────────────────────────────────────────────────────────────

const BREADCRUMB = [{ name: 'Главная', href: '/' }, { name: 'Площадки' }]

function matchFilters(venue, filters) {
    if (!inRange(venue.area, filters.areaFrom, filters.areaTo)) return false
    if (!inRange(venue.pricePerHour, filters.priceFrom, filters.priceTo)) return false

    if (filters.venueType) {
        const option = FILTER_FIELDS.find((f) => f.key === 'venueType').options.find(
            (o) => o.value === filters.venueType,
        )
        if (option && venue.type !== option.label) return false
    }

    // «до N человек» — maydon sig'imi tanlangan chegaradan oshmasligi kerak.
    if (filters.capacity && venue.capacity > Number(filters.capacity)) return false

    return true
}

function sortItems(list, sort) {
    if (sort === 'price-asc') return [...list].sort((a, b) => a.pricePerHour - b.pricePerHour)
    if (sort === 'price-desc') return [...list].sort((a, b) => b.pricePerHour - a.pricePerHour)
    if (sort === 'new') return [...list].reverse()
    return list
}

export default function VenuesView() {
    return (
        <CatalogView
            title="Площадки"
            breadcrumb={BREADCRUMB}
            items={VENUES}
            fields={FILTER_FIELDS}
            emptyFilters={EMPTY_VENUE_FILTERS}
            sortOptions={SORT_OPTIONS}
            searchPlaceholder="Название площадки / ключевые слова"
            faq={VENUES_FAQ}
            gridPageSize={GRID_PAGE_SIZE}
            listPageSize={LIST_PAGE_SIZE}
            matchFilters={matchFilters}
            sortItems={sortItems}
            renderCard={(item) => <VenueCard key={item.id} venue={item} />}
            renderRow={(item) => <VenueRowCard key={item.id} venue={item} />}
        />
    )
}
