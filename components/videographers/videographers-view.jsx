'use client'

import React from 'react'
import CatalogView from '@/components/shared/catalog/catalog-view'
import VideographerCard from '@/components/videographers/videographer-card'
import VideographerRowCard from '@/components/videographers/videographer-row-card'
import {
    EMPTY_VIDEOGRAPHER_FILTERS,
    FILTER_FIELDS,
    GRID_PAGE_SIZE,
    LIST_PAGE_SIZE,
    SORT_OPTIONS,
    VIDEOGRAPHERS,
    VIDEOGRAPHERS_FAQ,
} from '@/components/videographers/videographers-data'

// ─────────────────────────────────────────────────────────────────────────────
// Видеографы katalogi.
// Figma: setka 96:2049 · ro'yxat 102:4056 · mobil 366:16479 / 366:17007.
//
// Umumiy qolip — `components/shared/catalog/catalog-view.jsx`; bu yerda faqat
// Видеографыga xos ma'lumot, filtr mantiqi va kartochkalar.
// ─────────────────────────────────────────────────────────────────────────────

const BREADCRUMB = [{ name: 'Главная', href: '/' }, { name: 'Видеографы' }]

// Statik ma'lumotda barcha anketalar bir xil, shuning uchun filtrlar faqat
// tanlangan kategoriya bo'yicha tekshiriladi — backend ulanganda bu funksiya
// server javobi bilan almashtiriladi.
function matchFilters(videographer, filters) {
    if (!filters.category) return true
    const option = FILTER_FIELDS.find((f) => f.key === 'category').options.find(
        (o) => o.value === filters.category,
    )
    return option ? videographer.tags.includes(option.label) : true
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

export default function VideographersView() {
    return (
        <CatalogView
            title="Видеографы"
            breadcrumb={BREADCRUMB}
            items={VIDEOGRAPHERS}
            fields={FILTER_FIELDS}
            emptyFilters={EMPTY_VIDEOGRAPHER_FILTERS}
            sortOptions={SORT_OPTIONS}
            searchPlaceholder="Имя видеографа / ключевые слова"
            faq={VIDEOGRAPHERS_FAQ}
            gridPageSize={GRID_PAGE_SIZE}
            listPageSize={LIST_PAGE_SIZE}
            matchFilters={matchFilters}
            sortItems={sortItems}
            renderCard={(item) => <VideographerCard key={item.id} videographer={item} />}
            renderRow={(item) => <VideographerRowCard key={item.id} videographer={item} />}
        />
    )
}
