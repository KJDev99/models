'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Button from '@/components/ui/button'
import Tabs from '@/components/ui/tabs'
import EmptyState from '@/components/ui/empty-state'
import Pagination from '@/components/ui/pagination'
import { SkeletonGrid, SkeletonRows } from '@/components/ui/skeleton'
import { useApiStore } from '@/store/useApiStore'

// Kabinet ichidagi har qanday ro'yxat (проекты, площадки, исполнители,
// приглашения, отзывы) uchun umumiy blok: tab'lar → yuklash → bo'sh holat →
// to'r yoki jadval → sahifalash.
export default function ResourceList({
    endpoint,
    params = {},
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
    const getDataToken = useApiStore((s) => s.getDataToken)

    const [tab, setTab] = useState(defaultTab || tabs[0]?.value || '')
    const [items, setItems] = useState([])
    const [count, setCount] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)

    // setState `.then()` ichida chaqiriladi — effekt tanasida sinxron holat
    // o'zgartirish React Compiler qoidalarini buzadi.
    const load = useCallback(() => {
        getDataToken(endpoint, {
            ...params,
            status: tab || undefined,
            page,
            limit,
        }).then((res) => {
            const raw = res.data
            setItems(raw?.results || raw?.data || raw || [])
            setCount(raw?.count ?? (Array.isArray(raw) ? raw.length : 0))
            setLoading(false)
        })
        // `params` har renderda yangi obyekt bo'ladi — qasddan bog'liqlikdan chiqarilgan.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endpoint, getDataToken, tab, page, limit])

    useEffect(() => {
        load()
    }, [load])

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
                    title={emptyTitle}
                    description={emptyDescription}
                    actionText={emptyActionText || createText}
                    actionHref={emptyActionHref || createHref}
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
