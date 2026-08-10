import Link from 'next/link'
import React from 'react'

// items: [{ name, href? }] — oxirgi element havolasiz.
export default function Breadcrumb({ items = [] }) {
    return (
        <nav className="flex flex-wrap items-center gap-x-2 text-sm text-grey">
            {items.map((item, idx) => {
                const isLast = idx === items.length - 1
                return (
                    <React.Fragment key={item.href || item.name}>
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="transition-colors duration-150 hover:text-black"
                            >
                                {item.name}
                            </Link>
                        ) : (
                            <span className={isLast ? 'text-black' : ''}>{item.name}</span>
                        )}
                        {/* Figma 93:8226 — ajratkich «>» */}
                        {!isLast && <span className="text-grey/60">&gt;</span>}
                    </React.Fragment>
                )
            })}
        </nav>
    )
}
