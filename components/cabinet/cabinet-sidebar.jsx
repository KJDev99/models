'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IoIosArrowDown } from 'react-icons/io'
import { cabinetNav } from '@/lib/nav'
import { ROLE_META } from '@/lib/roles'
import { useAuth } from '@/lib/use-auth'
import Avatar from '@/components/ui/avatar'
import LogoutModal from '@/components/cabinet/logout-modal'

// Mobil ekranda menyu yig'iladi — Figma'dagi "меню" (270:18052) kabi.
export default function CabinetSidebar({ role }) {
    const pathname = usePathname()
    const { user } = useAuth()
    const [openMobile, setOpenMobile] = useState(false)
    const [logoutOpen, setLogoutOpen] = useState(false)

    const items = cabinetNav(role)
    const active = items.find((i) =>
        i.exact ? pathname === i.href : pathname.startsWith(i.href)
    )

    return (
        <>
            <div className="rounded-[16px] border border-black/8 bg-white p-5 lg:p-6">
                <div className="flex items-center gap-3 border-b border-black/8 pb-5">
                    <Avatar src={user?.avatar} name={user?.name} size="lg" />
                    <div className="min-w-0">
                        <p className="truncate text-base text-black">{user?.name || 'Профиль'}</p>
                        <p className="text-sm text-grey">{ROLE_META[role]?.label}</p>
                    </div>
                </div>

                {/* Mobil: faol bo'limni ko'rsatib, bosilganda ochiladi */}
                <button
                    type="button"
                    onClick={() => setOpenMobile((v) => !v)}
                    className="mt-5 flex w-full items-center justify-between gap-2 rounded-[12px] bg-light-white px-4 py-3 text-base text-black lg:hidden"
                >
                    {active?.label || 'Меню'}
                    <IoIosArrowDown
                        className={`transition-transform duration-200 ${openMobile ? 'rotate-180' : ''}`}
                    />
                </button>

                <nav className={`mt-5 flex-col gap-1 ${openMobile ? 'flex' : 'hidden'} lg:flex`}>
                    {items.map((item) => {
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`rounded-[12px] px-4 py-3 text-base transition-colors duration-150 ${
                                    isActive
                                        ? 'bg-gold text-white'
                                        : 'text-grey hover:bg-light-white hover:text-black'
                                }`}
                            >
                                {item.label}
                            </Link>
                        )
                    })}

                    <button
                        type="button"
                        onClick={() => setLogoutOpen(true)}
                        className="mt-2 rounded-[12px] border border-danger/30 px-4 py-3 text-left text-base text-danger transition-colors duration-150 hover:bg-danger hover:text-white"
                    >
                        Выйти
                    </button>
                </nav>
            </div>

            <LogoutModal open={logoutOpen} onClose={() => setLogoutOpen(false)} />
        </>
    )
}
