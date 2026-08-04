'use client'

import React from 'react'
import { SkeletonGrid } from '@/components/ui/skeleton'
import EmptyState from '@/components/ui/empty-state'
import Pagination from '@/components/ui/pagination'

// Barcha katalog sahifalari uchun umumiy o'ram: yuklanish → xato → bo'sh → to'r.
export default function CatalogGrid({
    items = [],
    loading,
    error,
    page = 1,
    limit = 12,
    count = 0,
    onPageChange,
    onRetry,
    renderItem,
    columns = 'grid-cols-2 lg:grid-cols-4',
    emptyTitle = 'Ничего не найдено',
    emptyDescription = 'Попробуйте изменить фильтры или сбросить их.',
    onReset,
}) {
    if (loading) return <SkeletonGrid count={limit} />

    if (error) {
        return (
            <EmptyState
                title="Не удалось загрузить"
                description={error}
                actionText="Повторить"
                onAction={onRetry}
            />
        )
    }

    if (!items.length) {
        return (
            <EmptyState
                title={emptyTitle}
                description={emptyDescription}
                actionText={onReset ? 'Сбросить фильтры' : undefined}
                onAction={onReset}
            />
        )
    }

    const totalPages = Math.max(1, Math.ceil((count || items.length) / limit))

    return (
        <>
            <div className={`grid gap-3 lg:gap-6 ${columns}`}>{items.map(renderItem)}</div>
            <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
        </>
    )
}
