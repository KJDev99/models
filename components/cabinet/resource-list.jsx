'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Button from '@/components/ui/button'
import Tabs from '@/components/ui/tabs'
import EmptyState from '@/components/ui/empty-state'
import Pagination from '@/components/ui/pagination'
import { SkeletonGrid, SkeletonRows } from '@/components/ui/skeleton'

// ─────────────────────────────────────────────────────────────────────────────
// Kabinet ichidagi har qanday ro'yxat (проекты, площадки, исполнители,
// приглашения, отзывы) uchun umumiy blok: tab'lar → yuklash → bo'sh holat →
// to'r yoki jadval → sahifalash.
//
// `fetcher({ status, page, limit })` — chaqiruv joyidan beriladigan barqaror
// funksiya (`lib/api/*` modullaridan). U `{ items, meta }` yoki oddiy massiv
// qaytarishi mumkin. `adapt` berilsa, har bir element shundan o'tkaziladi.
// ─────────────────────────────────────────────────────────────────────────────
export default function ResourceList({
    fetcher,
    adapt,
    tabs = [],
    defaultTab,
    renderItem,
    renderTable,
    columns = 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    limit = 12,
    createText,
    createHref,
    emptyTitle = 'Пока пусто',
    emptyDescription,
    emptyActionText,
    emptyActionHref,
}) {
    const [tab, setTab] = useState(defaultTab || tabs[0]?.value || '')
    const [items, setItems] = useState([])
    const [count, setCount] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = useCallback(() => {
        let cancelled = false

        Promise.resolve()
            .then(() => fetcher({ status: tab || undefined, page, limit }))
            .then((res) => {
                if (cancelled) return
                const list = Array.isArray(res) ? res : res?.items || []
                setItems(adapt ? list.map(adapt).filter(Boolean) : list)
                setCount(Array.isArray(res) ? res.length : (res?.meta?.total ?? list.length))
                setError(null)
                setLoading(false)
            })
            .catch((e) => {
                if (cancelled) return
                setItems([])
                setError(e)
                setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [fetcher, adapt, tab, page, limit])

    useEffect(() => load(), [load])

    // Tab yoki sahifa foydalanuvchi tomonidan almashtirilganda skeleton qaytadi
    // (bu — hodisa ishlovchisi, effekt emas, shuning uchun setState ruxsat etiladi).
    function changeTab(value) {
        setTab(value)
        setPage(1)
        setLoading(true)
    }

    function changePage(value) {
        setPage(value)
        setLoading(true)
    }

    const totalPages = Math.max(1, Math.ceil((count || items.length) / limit))

    return (
        <div className="flex flex-col gap-6">
            {(tabs.length > 0 || createText) && (
                <div className="flex flex-wrap items-center justify-between gap-4">
                    {tabs.length > 0 && <Tabs items={tabs} value={tab} onChange={changeTab} />}
                    {createText && createHref && (
                        <Button href={createHref} size="sm">
                            {createText}
                        </Button>
                    )}
                </div>
            )}

            {loading && (renderTable ? <SkeletonRows count={6} /> : <SkeletonGrid count={6} />)}

            {!loading && items.length === 0 && (
                <EmptyState
                    title={error ? 'Не удалось загрузить' : emptyTitle}
                    description={error ? error.message : emptyDescription}
                    actionText={error ? undefined : emptyActionText || createText}
                    actionHref={error ? undefined : emptyActionHref || createHref}
                />
            )}

            {!loading && items.length > 0 && (
                <>
                    {renderTable ? (
                        renderTable(items, load)
                    ) : (
                        <div className={`grid gap-4 lg:gap-6 ${columns}`}>
                            {items.map((item) => renderItem(item, load))}
                        </div>
                    )}
                    <Pagination page={page} totalPages={totalPages} onChange={changePage} />
                </>
            )}
        </div>
    )
}
