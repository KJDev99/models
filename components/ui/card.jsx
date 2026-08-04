import React from 'react'

// Kabinet ichidagi oq blok — Figma'dagi barcha "карточка" konteynerlari.
export default function Card({ title, action, children, className = '', padded = true }) {
    return (
        <section
            className={`rounded-[16px] border border-black/8 bg-white ${padded ? 'p-6 lg:p-8' : ''} ${className}`}
        >
            {(title || action) && (
                <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    {title && <h2 className="text-xl font-medium text-black lg:text-2xl">{title}</h2>}
                    {action}
                </header>
            )}
            {children}
        </section>
    )
}
