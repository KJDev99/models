'use client'

import React from 'react'
import { SkeletonRows } from '@/components/ui/skeleton'
import EmptyState from '@/components/ui/empty-state'

// Admin ro'yxatlari uchun (Исполнители / Заказчики / Агентства / Проекты...).
// columns: [{ key, title, width?, render?(row) }]
export default function DataTable({
    columns = [],
    rows = [],
    loading,
    emptyTitle = 'Ничего не найдено',
    emptyDescription,
    onRowClick,
}) {
    if (loading) return <SkeletonRows count={6} />
    if (!rows.length) return <EmptyState title={emptyTitle} description={emptyDescription} />

    return (
        <div className="custom-scrollbar w-full overflow-x-auto rounded-[16px] border border-black/8 bg-white">
            <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                    <tr className="border-b border-black/8">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                style={col.width ? { width: col.width } : undefined}
                                className="px-5 py-4 text-sm font-normal text-grey"
                            >
                                {col.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr
                            key={row.id ?? idx}
                            onClick={() => onRowClick?.(row)}
                            className={`border-b border-black/5 last:border-0 ${
                                onRowClick ? 'cursor-pointer transition-colors hover:bg-light-white' : ''
                            }`}
                        >
                            {columns.map((col) => (
                                <td key={col.key} className="px-5 py-4 text-base text-black">
                                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
