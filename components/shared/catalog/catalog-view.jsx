'use client'

import React, { useMemo, useState } from 'react'
import Container from '@/components/ui/container'
import Breadcrumb from '@/components/ui/breadcrumb'
import CatalogFilters from '@/components/shared/catalog/catalog-filters'
import CatalogToolbar from '@/components/shared/catalog/catalog-toolbar'
import CatalogPagination from '@/components/shared/catalog/catalog-pagination'
import CatalogFaq from '@/components/shared/catalog/catalog-faq'
import { AllFiltersSheet, FieldSheet } from '@/components/shared/catalog/catalog-mobile-filters'

// ─────────────────────────────────────────────────────────────────────────────
// Katalog sahifalarining umumiy qolipi.
// Figma: Модели 81:2586 / 96:4188, Фотографы 93:6605 / 102:2652,
// Проекты 141:8989 / 145:11176 — tuzilishi bir xil, faqat filtr maydonlari,
// kartochka, setka ustunlari va matnlar farq qiladi.
//
// Sahifaga xos qismlar prop orqali beriladi:
//   items · fields · emptyFilters · sortOptions · searchPlaceholder · faq
//   renderCard (setka) · renderRow (ro'yxat) · matchFilters · sortItems
//
// Backend ulanganda `items` `useCatalogStore.fetch()` javobi bilan
// almashtiriladi — saralash, sahifalash va filtrlash mantiqi o'sha holicha
// qoladi.
// ─────────────────────────────────────────────────────────────────────────────

// Raqamli chegara: bo'sh qiymat cheklamaydi. Sahifalar `matchFilters` ichida
// ishlatadi, shuning uchun tashqariga chiqarilgan.
export function inRange(value, from, to) {
    if (from && value < Number(from)) return false
    if (to && value > Number(to)) return false
    return true
}

export default function CatalogView({
    title,
    breadcrumb,
    items,
    fields,
    emptyFilters,
    sortOptions,
    searchPlaceholder,
    faq,
    gridPageSize,
    listPageSize,
    renderCard,
    renderRow,
    matchFilters,
    sortItems,
    // Проектыda setka uch ustunli (Figma 141:9060), ijrochilarda to'rtta.
    gridCols = 'lg:grid-cols-4',
    // Агентстваda ko'rinish almashtirgichi yo'q — faqat setka (Figma 155:12806).
    showViewToggle = true,
    // Qidiruv qaysi maydon bo'yicha ketadi: anketalarda `name`, loyihalarda `title`.
    getSearchText = (item) => item.name,
}) {
    const [filters, setFilters] = useState(emptyFilters)
    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState(sortOptions[0].value)
    const [view, setView] = useState('grid')
    const [page, setPage] = useState(1)

    // Mobil oynalar: 'all' — barcha filtrlar, obyekt — bitta maydon.
    const [sheet, setSheet] = useState(null)

    const pageSize = view === 'grid' ? gridPageSize : listPageSize

    const found = useMemo(() => {
        const query = search.trim().toLowerCase()
        const list = items.filter((item) => {
            if (query && !getSearchText(item).toLowerCase().includes(query)) return false
            return matchFilters ? matchFilters(item, filters) : true
        })
        return sortItems ? sortItems(list, sort) : list
    }, [items, filters, search, sort, matchFilters, sortItems, getSearchText])

    const totalPages = Math.max(1, Math.ceil(found.length / pageSize))
    const currentPage = Math.min(page, totalPages)
    const visible = found.slice((currentPage - 1) * pageSize, currentPage * pageSize)

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
        <div className="flex flex-col gap-[40px] bg-light-white pt-[24px] pb-[40px] lg:gap-[100px] lg:pb-[100px]">
            <div className="flex flex-col gap-[16px] lg:gap-[24px]">
                <Container className="flex flex-col gap-[16px] lg:gap-[24px]">
                    <Breadcrumb items={breadcrumb} />
                    <h1 className="font-display text-[30px] leading-none tracking-[0.6px] text-black uppercase lg:text-[48px] lg:tracking-[0.96px]">
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

                        {visible.length === 0 ? (
                            <div className="flex flex-col items-center gap-[12px] rounded-[6px] bg-white p-[40px] text-center">
                                <p className="text-[16px] font-medium text-black lg:text-[18px]">
                                    Ничего не найдено
                                </p>
                                <p className="text-[14px] text-grey lg:text-[16px]">
                                    Попробуйте изменить параметры поиска или сбросить фильтры.
                                </p>
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="mt-[4px] cursor-pointer rounded-[6px] bg-gold/15 px-[24px] py-[12px] text-[14px] font-medium text-gold transition-colors hover:bg-gold/25 lg:text-[16px]"
                                >
                                    Сбросить фильтры
                                </button>
                            </div>
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

                        <CatalogPagination
                            page={currentPage}
                            total={totalPages}
                            onChange={setPage}
                        />
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
