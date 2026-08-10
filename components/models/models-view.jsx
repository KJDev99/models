'use client'

import React from 'react'
import CatalogView, { inRange } from '@/components/shared/catalog/catalog-view'
import ModelCard from '@/components/models/model-card'
import ModelRowCard from '@/components/models/model-row-card'
import {
    EMPTY_MODEL_FILTERS,
    FILTER_FIELDS,
    GRID_PAGE_SIZE,
    LIST_PAGE_SIZE,
    MODELS,
    MODELS_FAQ,
    SORT_OPTIONS,
} from '@/components/models/models-data'

// ─────────────────────────────────────────────────────────────────────────────
// Модели katalogi.
// Figma: setka 81:2586 · ro'yxat 96:4188 · mobil 353:21270 / 360:22463 ·
// mobil filtrlar 360:22138 · 360:21739 · 360:23274.
//
// Umumiy qolip — `components/shared/catalog/catalog-view.jsx`; bu yerda faqat
// Моделиga xos ma'lumot, filtr mantiqi va kartochkalar.
// ─────────────────────────────────────────────────────────────────────────────

const BREADCRUMB = [{ name: 'Главная', href: '/' }, { name: 'Модели' }]

function matchFilters(model, filters) {
    if (!inRange(model.age, filters.ageFrom, filters.ageTo)) return false
    if (!inRange(model.height, filters.heightFrom, filters.heightTo)) return false
    if (!inRange(model.weight, filters.weightFrom, filters.weightTo)) return false
    return true
}

function sortItems(list, sort) {
    if (sort === 'age-asc') return [...list].sort((a, b) => a.age - b.age)
    if (sort === 'age-desc') return [...list].sort((a, b) => b.age - a.age)
    if (sort === 'new') return [...list].reverse()
    return list
}

export default function ModelsView() {
    return (
        <CatalogView
            title="Модели"
            breadcrumb={BREADCRUMB}
            items={MODELS}
            fields={FILTER_FIELDS}
            emptyFilters={EMPTY_MODEL_FILTERS}
            sortOptions={SORT_OPTIONS}
            searchPlaceholder="Имя модели / ключевые слова"
            faq={MODELS_FAQ}
            gridPageSize={GRID_PAGE_SIZE}
            listPageSize={LIST_PAGE_SIZE}
            matchFilters={matchFilters}
            sortItems={sortItems}
            renderCard={(model) => <ModelCard key={model.id} model={model} />}
            renderRow={(model) => <ModelRowCard key={model.id} model={model} />}
        />
    )
}
