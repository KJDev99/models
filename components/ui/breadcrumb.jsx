import Link from 'next/link'
import React from 'react'

// items: [{ name, href? }] — oxirgi element havolasiz.
export default function Breadcrumb({ items = [] }) {
    return (
        // Figma 120:1151: 16px, barcha elementlar grey (#666), oralig'i 12px.
        <nav className="flex flex-wrap items-center gap-x-[12px] gap-y-[4px] text-[14px] text-grey lg:text-[16px]">
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
                            <span>{item.name}</span>
                        )}
                        {/* Figma 93:8226 — ajratkich «>» */}
                        {!isLast && <span aria-hidden>&gt;</span>}
                    </React.Fragment>
                )
            })}
        </nav>
    )
}
