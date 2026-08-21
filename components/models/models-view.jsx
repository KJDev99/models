'use client'

import React from 'react'
import CatalogView from '@/components/shared/catalog/catalog-view'
import ModelCard from '@/components/models/model-card'
import ModelRowCard from '@/components/models/model-row-card'
import {
    EMPTY_MODEL_FILTERS,
    FILTER_FIELDS,
    GRID_PAGE_SIZE,
    LIST_PAGE_SIZE,
    SORT_OPTIONS,
} from '@/components/models/models-data'
import { fetchModels, performerParams } from '@/components/shared/catalog/performer-catalog'

// ─────────────────────────────────────────────────────────────────────────────
// Модели katalogi.
// Figma: setka 81:2586 · ro'yxat 96:4188 · mobil 353:21270 / 360:22463 ·
// mobil filtrlar 360:22138 · 360:21739 · 360:23274.
//
// Ma'lumot: GET /site/performers?specialty=model (backend/site.md).
// Umumiy qolip — `components/shared/catalog/catalog-view.jsx`.
// ─────────────────────────────────────────────────────────────────────────────

const BREADCRUMB = [{ name: 'Главная', href: '/' }, { name: 'Модели' }]

export default function ModelsView() {
    return (
        <CatalogView
            title="Модели"
            breadcrumb={BREADCRUMB}
            fields={FILTER_FIELDS}
            emptyFilters={EMPTY_MODEL_FILTERS}
            sortOptions={SORT_OPTIONS}
            searchPlaceholder="Имя модели / ключевые слова"
            faqType="models"
            gridPageSize={GRID_PAGE_SIZE}
            listPageSize={LIST_PAGE_SIZE}
            fetcher={fetchModels}
            buildParams={performerParams}
            renderCard={(model) => <ModelCard key={model.id} model={model} />}
            renderRow={(model) => <ModelRowCard key={model.id} model={model} />}
        />
    )
}
