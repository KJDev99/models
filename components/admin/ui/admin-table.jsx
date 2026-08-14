'use client'

import React from 'react'
import Link from 'next/link'
import { AdminEmpty } from '@/components/admin/ui/admin-ui'

// ─────────────────────────────────────────────────────────────────────────────
// Adminka jadvali — Figma 321:12979 (desktop) / 440:19109 (mobil).
//
// Desktopda oddiy jadval: light-white sarlavha qatori + #e5e5e5 chiziqli
// qatorlar. Mobilda har bir qator kartochkaga aylanadi: chapda ustun nomi,
// o'ngda qiymat, pastda tugmalar qatori.
//
// columns: [{ key, label, width?, render?(row), hideOnMobile? }]
//   width — Tailwind klassi to'liq yoziladi (`lg:w-[133px]`), chunki Tailwind
//   klass nomlarini manbadan o'qiydi va yig'ib bo'lmaydi.
// actions: (row) => [{ key, icon, label, tone?, onClick?, href? }]
// ─────────────────────────────────────────────────────────────────────────────

const ACTION_TONES = {
    default: 'text-black',
    success: 'text-[#44a400]',
    danger: 'text-[#e53b35]',
}

export default function AdminTable({
    columns,
    rows,
    actions,
    actionsWidth = 'lg:w-[104px]',
    actionsHeader = null,
    rowKey = (row, i) => row.id ?? i,
    empty,
}) {
    if (!rows.length) return <AdminEmpty>{empty}</AdminEmpty>

    return (
        <div className="flex flex-col">
            {/* Sarlavha qatori — faqat desktopda */}
            <div className="hidden items-center gap-[16px] rounded-[6px] bg-light-white p-[16px] lg:flex">
                {columns.map((col) => (
                    <span
                        key={col.key}
                        className={`text-[18px] font-medium text-black ${
                            col.width ? `${col.width} shrink-0` : 'min-w-0 flex-1'
                        }`}
                    >
                        {col.label}
                    </span>
                ))}
                {actions && (
                    <span className={`flex shrink-0 items-center justify-end ${actionsWidth}`}>
                        {actionsHeader}
                    </span>
                )}
            </div>

            {rows.map((row, i) => {
                const rowActions = actions?.(row) || []
                return (
                    <div
                        key={rowKey(row, i)}
                        className="flex flex-col gap-[12px] border-b border-[#e5e5e5] p-[12px] lg:flex-row lg:items-center lg:gap-[16px] lg:p-[16px]"
                    >
                        {columns.map((col) => (
                            <div
                                key={col.key}
                                className={`flex items-center gap-[16px] lg:block ${
                                    col.hideOnMobile ? 'hidden lg:flex' : ''
                                } ${col.width ? `${col.width} lg:shrink-0` : 'lg:min-w-0 lg:flex-1'}`}
                            >
                                <span className="min-w-0 flex-1 text-[12px] font-medium text-black lg:hidden">
                                    {col.label}
                                </span>
                                <div className="min-w-0 flex-1 text-[12px] text-grey lg:flex-none lg:text-[16px]">
                                    {col.render ? col.render(row) : row[col.key]}
                                </div>
                            </div>
                        ))}

                        {rowActions.length > 0 && (
                            <div
                                className={`flex items-center gap-[8px] text-black lg:shrink-0 lg:justify-end lg:gap-[16px] ${actionsWidth}`}
                            >
                                {rowActions.map((action) => (
                                    <AdminAction key={action.key} action={action} />
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

// Qator tugmasi: mobilda light-white fonli keng tugma, desktopda toza ikonka.
// `render` berilgan bo'lsa (masalan «⋮» menyusi) o'sha element chiziladi.
function AdminAction({ action }) {
    if (action.render) return action.render

    const Icon = action.icon
    const tone = ACTION_TONES[action.tone || 'default']
    const className = `flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-[6px] bg-light-white p-[8px] transition-opacity hover:opacity-70 lg:flex-none lg:bg-transparent lg:p-0 ${tone}`

    const inner = (
        <>
            <Icon size={24} strokeWidth={2} className="shrink-0" />
            <span className="sr-only">{action.label}</span>
        </>
    )

    if (action.href) {
        return (
            <Link href={action.href} aria-label={action.label} className={className}>
                {inner}
            </Link>
        )
    }

    return (
        <button type="button" onClick={action.onClick} aria-label={action.label} className={className}>
            {inner}
        </button>
    )
}
