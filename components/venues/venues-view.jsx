'use client'

import React from 'react'
import CatalogView from '@/components/shared/catalog/catalog-view'
import VenueCard from '@/components/venues/venue-card'
import VenueRowCard from '@/components/venues/venue-row-card'
import {
    EMPTY_VENUE_FILTERS,
    FILTER_FIELDS,
    GRID_PAGE_SIZE,
    LIST_PAGE_SIZE,
    SORT_OPTIONS,
} from '@/components/venues/venues-data'
import { fetchVenues, venueParams } from '@/components/shared/catalog/catalog-fetchers'

// ─────────────────────────────────────────────────────────────────────────────
// Площадки katalogi.
// Figma: setka 120:1121 · ro'yxat 128:3387 · mobil 373:12458 / 373:12970.
//
// Umumiy qolip — `components/shared/catalog/catalog-view.jsx`; bu yerda faqat
// Площадкиga xos ma'lumot, filtr mantiqi va kartochkalar.
// ─────────────────────────────────────────────────────────────────────────────

const BREADCRUMB = [{ name: 'Главная', href: '/' }, { name: 'Площадки' }]

export default function VenuesView() {
    return (
        <CatalogView
            title="Площадки"
            breadcrumb={BREADCRUMB}
            fields={FILTER_FIELDS}
            emptyFilters={EMPTY_VENUE_FILTERS}
            sortOptions={SORT_OPTIONS}
            searchPlaceholder="Название площадки / ключевые слова"
            faqType="venues"
            gridPageSize={GRID_PAGE_SIZE}
            listPageSize={LIST_PAGE_SIZE}
            fetcher={fetchVenues}
            buildParams={venueParams}
            renderCard={(item) => <VenueCard key={item.id} venue={item} />}
            renderRow={(item) => <VenueRowCard key={item.id} venue={item} />}
        />
    )
}
