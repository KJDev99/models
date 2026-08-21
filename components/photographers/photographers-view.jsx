'use client'

import React from 'react'
import CatalogView from '@/components/shared/catalog/catalog-view'
import PhotographerCard from '@/components/photographers/photographer-card'
import PhotographerRowCard from '@/components/photographers/photographer-row-card'
import {
    EMPTY_PHOTOGRAPHER_FILTERS,
    FILTER_FIELDS,
    GRID_PAGE_SIZE,
    LIST_PAGE_SIZE,
    SORT_OPTIONS,
} from '@/components/photographers/photographers-data'
import {
    fetchPhotographers,
    performerParams,
} from '@/components/shared/catalog/performer-catalog'

// ─────────────────────────────────────────────────────────────────────────────
// Фотографы katalogi.
// Figma: setka 93:6605 · ro'yxat 102:2652 · mobil 364:14179 / 364:14752.
//
// Umumiy qolip — `components/shared/catalog/catalog-view.jsx`; bu yerda faqat
// Фотографыga xos ma'lumot, filtr mantiqi va kartochkalar.
// ─────────────────────────────────────────────────────────────────────────────

const BREADCRUMB = [{ name: 'Главная', href: '/' }, { name: 'Фотографы' }]

// Statik ma'lumotda barcha anketalar bir xil, shuning uchun filtrlar faqat
// tanlangan kategoriya bo'yicha tekshiriladi — backend ulanganda bu funksiya
// server javobi bilan almashtiriladi.
function matchFilters(photographer, filters) {
    if (!filters.category) return true
    const option = FILTER_FIELDS.find((f) => f.key === 'category').options.find(
        (o) => o.value === filters.category,
    )
    return option ? photographer.tags.includes(option.label) : true
}

function sortItems(list, sort) {
    if (sort === 'experience-asc') {
        return [...list].sort((a, b) => a.experienceYears - b.experienceYears)
    }
    if (sort === 'experience-desc') {
        return [...list].sort((a, b) => b.experienceYears - a.experienceYears)
    }
    if (sort === 'new') return [...list].reverse()
    return list
}

export default function PhotographersView() {
    return (
        <CatalogView
            title="Фотографы"
            breadcrumb={BREADCRUMB}
            fields={FILTER_FIELDS}
            emptyFilters={EMPTY_PHOTOGRAPHER_FILTERS}
            sortOptions={SORT_OPTIONS}
            searchPlaceholder="Имя фотографа / ключевые слова"
            faqType="photographers"
            gridPageSize={GRID_PAGE_SIZE}
            listPageSize={LIST_PAGE_SIZE}
            fetcher={fetchPhotographers}
            buildParams={performerParams}
            renderCard={(item) => <PhotographerCard key={item.id} photographer={item} />}
            renderRow={(item) => <PhotographerRowCard key={item.id} photographer={item} />}
        />
    )
}
