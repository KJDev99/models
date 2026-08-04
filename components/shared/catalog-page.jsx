'use client'

import React, { useEffect } from 'react'
import Container from '@/components/ui/container'
import PageHeader from '@/components/ui/page-header'
import CatalogGrid from '@/components/shared/catalog-grid'
import FiltersPanel from '@/components/shared/filters-panel'
import { useCatalogStore } from '@/store/useCatalogStore'

// Barcha ochiq katalog sahifalari (Модели / Фотографы / Видеографы /
// Площадки / Проекты / Агентства) shu komponent orqali quriladi —
// farqi faqat `resource`, kartochka turi va filtr to'plamida.
export default function CatalogPage({
    resource,
    title,
    description,
    breadcrumb,
    renderItem,
    columns,
    filterFields,
    categories = [],
    tabs = null,
}) {
    const items = useCatalogStore((s) => s.items)
    const count = useCatalogStore((s) => s.count)
    const page = useCatalogStore((s) => s.page)
    const limit = useCatalogStore((s) => s.limit)
    const loading = useCatalogStore((s) => s.loading)
    const error = useCatalogStore((s) => s.error)
    const filters = useCatalogStore((s) => s.filters)
    const setResource = useCatalogStore((s) => s.setResource)
    const setFilters = useCatalogStore((s) => s.setFilters)
    const resetFilters = useCatalogStore((s) => s.resetFilters)
    const setPage = useCatalogStore((s) => s.setPage)
    const fetchItems = useCatalogStore((s) => s.fetch)

    // Resurs almashganda filtrlar va sahifa nolga qaytadi.
    useEffect(() => {
        setResource(resource)
    }, [resource, setResource])

    useEffect(() => {
        fetchItems()
    }, [fetchItems, filters, page, resource])

    return (
        <Container className="my-8 lg:my-12">
            <PageHeader
                breadcrumb={breadcrumb}
                title={title}
                count={count || undefined}
                description={description}
            />

            {tabs}

            <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-8">
                <div>
                    <FiltersPanel
                        filters={filters}
                        onChange={setFilters}
                        onReset={resetFilters}
                        categories={categories}
                        fields={filterFields}
                    />
                </div>

                <div className="min-w-0">
                    <CatalogGrid
                        items={items}
                        loading={loading}
                        error={error}
                        page={page}
                        limit={limit}
                        count={count}
                        columns={columns}
                        onPageChange={setPage}
                        onRetry={fetchItems}
                        onReset={resetFilters}
                        renderItem={renderItem}
                    />
                </div>
            </div>
        </Container>
    )
}
