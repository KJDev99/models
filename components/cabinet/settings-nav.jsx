'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { settingsNav } from '@/lib/nav'

// Sozlamalar bo'limining ichki gorizontal menyusi (barcha rollarda bir xil).
export default function SettingsNav({ rolePrefix }) {
    const pathname = usePathname()
    const items = settingsNav(rolePrefix)

    return (
        <nav className="scrollbar-hide mb-6 flex gap-2 overflow-x-auto">
            {items.map((item) => {
                const active = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href)
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={[
                            'shrink-0 rounded-full px-5 py-2.5 text-base whitespace-nowrap transition-colors duration-150',
                            active
                                ? 'bg-gold text-white'
                                : item.danger
                                  ? 'bg-light-white text-danger hover:bg-danger/10'
                                  : 'bg-light-white text-grey hover:text-black',
                        ].join(' ')}
                    >
                        {item.label}
                    </Link>
                )
            })}
        </nav>
    )
}
