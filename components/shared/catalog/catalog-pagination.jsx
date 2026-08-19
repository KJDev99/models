'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Sahifalash. Figma: 96:873 — chetlarida 24px strelkalar (gold 20%),
// o'rtada 40×40 tugmalar; joriy sahifa gold fonda oq raqam bilan.
// Ko'p sahifada o'rtasi «…» bilan qisqartiriladi: 1 2 3 4 5 … 100
// ─────────────────────────────────────────────────────────────────────────────

// Ko'rsatiladigan raqamlar ro'yxati (`null` — ellipsis).
function buildPages(page, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    if (page <= 5) return [1, 2, 3, 4, 5, null, total]
    if (page >= total - 4) return [1, null, total - 4, total - 3, total - 2, total - 1, total]
    return [1, null, page - 1, page, page + 1, null, total]
}

function Arrow({ direction, onClick, disabled, label }) {
    const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className="flex size-[24px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] ui-icon-btn disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Icon size={16} strokeWidth={2} />
        </button>
    )
}

export default function CatalogPagination({ page, total, onChange }) {
    if (total <= 1) return null

    return (
        <nav
            aria-label="Страницы каталога"
            className="flex items-center justify-center gap-[8px] lg:gap-[16px]"
        >
            <Arrow
                direction="prev"
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
                label="Предыдущая страница"
            />

            <div className="flex items-center gap-[8px] lg:gap-[16px]">
                {buildPages(page, total).map((p, i) =>
                    p === null ? (
                        <span
                            key={`gap-${i}`}
                            className="flex size-[32px] items-center justify-center text-[14px] text-grey lg:size-[40px] lg:text-[16px]"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            type="button"
                            onClick={() => onChange(p)}
                            aria-current={p === page ? 'page' : undefined}
                            className={`flex size-[32px] cursor-pointer items-center justify-center rounded-[6px] text-[14px] transition-colors lg:size-[40px] lg:text-[16px] ${
                                p === page
                                    ? 'bg-gold font-medium text-white'
                                    : 'text-grey hover:bg-gold hover:text-white'
                            }`}
                        >
                            {p}
                        </button>
                    ),
                )}
            </div>

            <Arrow
                direction="next"
                onClick={() => onChange(page + 1)}
                disabled={page === total}
                label="Следующая страница"
            />
        </nav>
    )
}
