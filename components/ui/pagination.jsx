'use client'

import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Pagination({ page, totalPages, onChange }) {
    if (!totalPages || totalPages < 2) return null

    const windowSize = 5
    let start = Math.max(1, page - Math.floor(windowSize / 2))
    const end = Math.min(totalPages, start + windowSize - 1)
    if (end - start < windowSize - 1) start = Math.max(1, end - windowSize + 1)

    const pages = []
    for (let p = start; p <= end; p++) pages.push(p)

    const btn =
        'flex h-10 w-10 items-center justify-center rounded-[12px] text-base transition-colors duration-150'

    return (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button
                type="button"
                onClick={() => onChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`${btn} border border-black/10 text-black hover:bg-light-white disabled:opacity-40`}
                aria-label="Предыдущая страница"
            >
                <FiChevronLeft />
            </button>

            {start > 1 && (
                <>
                    <button type="button" onClick={() => onChange(1)} className={`${btn} border border-black/10 hover:bg-light-white`}>
                        1
                    </button>
                    {start > 2 && <span className="px-1 text-grey">...</span>}
                </>
            )}

            {pages.map((p) => (
                <button
                    key={p}
                    type="button"
                    onClick={() => onChange(p)}
                    className={`${btn} ${
                        p === page
                            ? 'bg-gold text-white'
                            : 'border border-black/10 text-black hover:bg-light-white'
                    }`}
                >
                    {p}
                </button>
            ))}

            {end < totalPages && (
                <>
                    {end < totalPages - 1 && <span className="px-1 text-grey">...</span>}
                    <button
                        type="button"
                        onClick={() => onChange(totalPages)}
                        className={`${btn} border border-black/10 hover:bg-light-white`}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                type="button"
                onClick={() => onChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`${btn} border border-black/10 text-black hover:bg-light-white disabled:opacity-40`}
                aria-label="Следующая страница"
            >
                <FiChevronRight />
            </button>
        </div>
    )
}
