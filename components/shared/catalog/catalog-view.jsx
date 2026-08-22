'use client'

import React, { useCallback, useMemo, useState } from 'react'
import Container from '@/components/ui/container'
import Breadcrumb from '@/components/ui/breadcrumb'
import CatalogFilters from '@/components/shared/catalog/catalog-filters'
import CatalogToolbar from '@/components/shared/catalog/catalog-toolbar'
import CatalogPagination from '@/components/shared/catalog/catalog-pagination'
import CatalogFaq from '@/components/shared/catalog/catalog-faq'
import { AllFiltersSheet, FieldSheet } from '@/components/shared/catalog/catalog-mobile-filters'
import { useApi } from '@/lib/use-api'
import * as site from '@/lib/api/site'
import { useDictionaries, withDictionary } from '@/lib/use-dictionaries'
import { faqItem } from '@/lib/adapters'

// ─────────────────────────────────────────────────────────────────────────────
// Katalog sahifalarining umumiy qolipi.
// Figma: Модели 81:2586 / 96:4188, Фотографы 93:6605 / 102:2652,
// Проекты 141:8989 / 145:11176 — tuzilishi bir xil, faqat filtr maydonlari,
// kartochka, setka ustunlari va matnlar farq qiladi.
//
// Ma'lumot backenddan keladi (backend/site.md → GET /site/…):
//   `fetcher({ search, sort, page, pageSize, filters })` → { items, meta }
// Filtrlash, saralash va sahifalash — server tomonida. Har o'zgarishda
// `useApi` yangi so'rov yuboradi.
//
// FAQ ham backenddan: GET /site/faqs?type=<faqType>.
// ─────────────────────────────────────────────────────────────────────────────

// Raqamli chegara: sahifalar `buildParams` ichida ishlatadi.
export function inRange(value, from, to) {
    if (from && value < Number(from)) return false
    if (to && value > Number(to)) return false
    return true
}

export default function CatalogView({
    title,
    breadcrumb,
    fields: staticFields,
    emptyFilters,
    sortOptions,
    searchPlaceholder,
    // FAQ turi — backend/site.md dagi `type` qiymati.
    faqType,
    gridPageSize,
    listPageSize,
    renderCard,
    renderRow,
    // Ma'lumot manbayi va filtrlarni so'rov parametrlariga o'girish.
    fetcher,
    buildParams,
    // Проектыda setka uch ustunli (Figma 141:9060), ijrochilarda to'rtta.
    gridCols = 'lg:grid-cols-4',
    // Агентстваda ko'rinish almashtirgichi yo'q — faqat setka (Figma 155:12806).
    showViewToggle = true,
}) {
    // Filtr variantlari backend lug'atidan olinadi (GET /site/dictionaries) —
    // shunda yuboriladigan qiymat har doim API kutgani bilan mos tushadi.
    const dict = useDictionaries()
    const fields = useMemo(() => withDictionary(staticFields, dict), [staticFields, dict])

    const [filters, setFilters] = useState(emptyFilters)
    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState(sortOptions[0].value)
    const [view, setView] = useState('grid')
    const [page, setPage] = useState(1)

    // Mobil oynalar: 'all' — barcha filtrlar, obyekt — bitta maydon.
    const [sheet, setSheet] = useState(null)

    const pageSize = view === 'grid' ? gridPageSize : listPageSize

    // Parametrlar `useMemo` bilan barqarorlashadi — shunda `useApi` faqat
    // haqiqiy o'zgarishda (filtr, saralash, sahifa) qayta so'rov yuboradi.
    const params = useMemo(
        () => buildParams({ search, sort, page, pageSize, filters }),
        [buildParams, search, sort, page, pageSize, filters],
    )

    const listFetcher = useCallback(() => fetcher(params), [fetcher, params])
    const faqFetcher = useCallback(() => site.faqs(faqType), [faqType])

    const { data, loading, error, reload } = useApi(listFetcher)
    const { data: faqData } = useApi(faqFetcher, { enabled: Boolean(faqType) })

    const visible = data?.items || []
    const totalPages = data?.meta?.pages || 1
    const faq = useMemo(() => (faqData || []).map(faqItem), [faqData])

    function patchFilters(patch) {
        setFilters((v) => ({ ...v, ...patch }))
        setPage(1)
    }

    function resetFilters() {
        setFilters(emptyFilters)
        setSearchInput('')
        setSearch('')
        setPage(1)
    }

    function submitSearch() {
        setSearch(searchInput)
        setPage(1)
    }

    // Chipdagi ✕ — maydonni tozalaydi.
    function clearField(field) {
        if (field.from && field.to) {
            patchFilters({ [field.from.key]: '', [field.to.key]: '' })
        } else {
            patchFilters({ [field.key]: '' })
        }
    }

    function changeView(next) {
        setView(next)
        setPage(1)
    }

    return (
        <div className="flex flex-col gap-[40px] bg-light-white pt-[16px] lg:pt-[24px] pb-[40px] lg:gap-[100px] lg:pb-[100px]">
            <div className="flex flex-col gap-[16px] lg:gap-[24px]">
                <Container className="flex flex-col gap-[16px] lg:gap-[24px]">
                    <Breadcrumb items={breadcrumb} />
                    <h1 className="font-display text-[24px] leading-none tracking-[0.48px] text-black uppercase lg:text-[48px] lg:tracking-[0.96px]">
                        {title}
                    </h1>
                </Container>

                <Container className="flex items-start gap-[16px]">
                    <CatalogFilters
                        fields={fields}
                        values={filters}
                        onChange={patchFilters}
                        onSubmit={submitSearch}
                        onReset={resetFilters}
                    />

                    <div className="flex min-w-0 flex-1 flex-col gap-[16px] lg:gap-[24px]">
                        <CatalogToolbar
                            fields={fields}
                            sortOptions={sortOptions}
                            searchPlaceholder={searchPlaceholder}
                            search={searchInput}
                            onSearchChange={setSearchInput}
                            onSearchSubmit={submitSearch}
                            sort={sort}
                            onSortChange={setSort}
                            view={view}
                            onViewChange={changeView}
                            values={filters}
                            onClearField={clearField}
                            onOpenAllFilters={() => setSheet('all')}
                            onOpenField={(field) => setSheet(field)}
                            showViewToggle={showViewToggle}
                        />

                        {error ? (
                            <CatalogMessage
                                title="Не удалось загрузить"
                                text={error.message}
                                actionLabel="Повторить"
                                onAction={reload}
                            />
                        ) : loading ? (
                            <CatalogSkeleton view={view} gridCols={gridCols} count={pageSize} />
                        ) : visible.length === 0 ? (
                            <CatalogMessage
                                title="Ничего не найдено"
                                text="Попробуйте изменить параметры поиска или сбросить фильтры."
                                actionLabel="Сбросить фильтры"
                                onAction={resetFilters}
                            />
                        ) : view === 'grid' ? (
                            <div
                                className={`grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:gap-[16px] ${gridCols}`}
                            >
                                {visible.map(renderCard)}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                                {visible.map(renderRow)}
                            </div>
                        )}

                        <CatalogPagination page={page} total={totalPages} onChange={setPage} />
                    </div>
                </Container>
            </div>

            <CatalogFaq items={faq} />

            {sheet === 'all' && (
                <AllFiltersSheet
                    fields={fields}
                    values={filters}
                    onChange={patchFilters}
                    onSubmit={submitSearch}
                    onReset={resetFilters}
                    onClose={() => setSheet(null)}
                />
            )}

            {sheet && sheet !== 'all' && (
                <FieldSheet
                    field={sheet}
                    values={filters}
                    onChange={patchFilters}
                    onClose={() => setSheet(null)}
                />
            )}
        </div>
    )
}

// Bo'sh natija va xato uchun bitta blok (Figma'da matn markazda, oq kartochka).
function CatalogMessage({ title, text, actionLabel, onAction }) {
    return (
        <div className="flex flex-col items-center gap-[12px] rounded-[6px] bg-white p-[40px] text-center">
            <p className="text-[16px] font-medium text-black lg:text-[18px]">{title}</p>
            <p className="text-[14px] text-grey lg:text-[16px]">{text}</p>
            {onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="mt-[4px] cursor-pointer rounded-[6px] bg-gold/15 px-[24px] py-[12px] text-[14px] font-medium text-gold transition-colors hover:bg-gold/25 lg:text-[16px]"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    )
}

// Yuklanish paytida kartochka o'lchamidagi kulrang joy egallovchilar.
function CatalogSkeleton({ view, gridCols, count = 8 }) {
    const items = Array.from({ length: Math.min(count, 12) })
    if (view === 'grid') {
        return (
            <div className={`grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:gap-[16px] ${gridCols}`}>
                {items.map((_, i) => (
                    <div
                        key={i}
                        className="h-[348px] animate-pulse rounded-[6px] bg-black/5 lg:h-[400px]"
                    />
                ))}
            </div>
        )
    }
    return (
        <div className="flex flex-col gap-[12px] lg:gap-[16px]">
            {items.slice(0, 6).map((_, i) => (
                <div key={i} className="h-[220px] animate-pulse rounded-[6px] bg-black/5" />
            ))}
        </div>
    )
}
