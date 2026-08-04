'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Модели / Фотографы / Видеографы o'rtasidagi almashinuv — uchala katalog
// sahifasida bir xil.
const TABS = [
    { label: 'Модели', href: '/models' },
    { label: 'Фотографы', href: '/photographers' },
    { label: 'Видеографы', href: '/videographers' },
]

export default function ExecutorTypeTabs({ className = '' }) {
    const pathname = usePathname()

    return (
        <div className={`scrollbar-hide flex gap-2 overflow-x-auto ${className}`}>
            {TABS.map((tab) => {
                const active = pathname.startsWith(tab.href)
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`shrink-0 rounded-full px-5 py-2.5 text-base whitespace-nowrap transition-colors duration-150 ${
                            active ? 'bg-gold text-white' : 'bg-light-white text-grey hover:text-black'
                        }`}
                    >
                        {tab.label}
                    </Link>
                )
            })}
        </div>
    )
}
