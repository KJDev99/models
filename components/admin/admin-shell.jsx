'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Mail } from 'lucide-react'
import Container from '@/components/ui/container'
import { LOGO } from '@/lib/assets'
import { ADMIN_NAV, activeNavItem } from '@/components/admin/admin-nav'

// ─────────────────────────────────────────────────────────────────────────────
// Adminka karkasi — Figma «Дашборд» 321:12629 (desktop) / 438:18788 (mobil).
//
// Desktop: sahifa foni light-white, tepada 1340px kontentli heder (pastida
// #dcdcdc chiziq), keyin 24px oraliq bilan 210px menyu + kontent.
// Mobil: heder p-12, menyu o'rniga oq ochiladigan qator (chevron-down).
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminShell({ children }) {
    const pathname = usePathname()

    // Ro'yxat sahifalarida chap menyu turadi; ichki sahifalarda (yaratish,
    // anketa, jalob va h.k.) uning o'rniga sahifa o'zining «Административная
    // панель > …» yo'lakchasini chizadi (Figma 335:14805).
    const withNav = ADMIN_NAV.some((item) => item.href === pathname)

    return (
        <div className="flex min-h-screen flex-col bg-light-white pb-[16px] lg:pb-[100px]">
            <AdminHeader />

            <div className="flex flex-col gap-[16px] lg:gap-[24px]">
                {withNav && <AdminMobileNav />}

                <Container className="flex items-start gap-[24px]">
                    {withNav && <AdminSidebar />}
                    {/* Dashbordda bloklar orasi 32px (Figma 321:12948),
                        ichki sahifalarda 24px (Figma 335:14803). */}
                    <div
                        className={`flex min-w-0 flex-1 flex-col gap-[16px] ${
                            withNav ? 'lg:gap-[32px]' : 'lg:gap-[24px]'
                        }`}
                    >
                        {children}
                    </div>
                </Container>
            </div>
        </div>
    )
}

// Heder — logotip, xat ikonkasi va avatar (Figma 321:12634 / 438:18791).
function AdminHeader() {
    return (
        <header className="border-b border-[#dcdcdc]">
            <Container className="flex items-center justify-between py-[12px] lg:py-[24px]">
                <Link
                    href="/admin/dashboard"
                    className="relative block h-[41px] w-[37px] lg:h-[64px] lg:w-[58px]"
                >
                    <Image
                        src={LOGO}
                        alt="База моделей"
                        fill
                        priority
                        sizes="58px"
                        className="object-contain"
                    />
                </Link>

                <div className="flex items-center gap-[16px]">
                    <Link
                        href="/admin/chats"
                        aria-label="Чаты"
                        className="text-black transition-opacity hover:opacity-70"
                    >
                        <Mail size={24} strokeWidth={2} />
                    </Link>
                    <span className="block size-[24px] shrink-0 rounded-full bg-[#7d7d7d] lg:size-[54px]" />
                </div>
            </Container>
        </header>
    )
}

// Chap menyu (Figma 321:13354) — faqat desktopda.
function AdminSidebar() {
    const pathname = usePathname()
    const active = activeNavItem(pathname)

    return (
        <aside className="hidden w-[210px] shrink-0 flex-col lg:flex">
            {ADMIN_NAV.map((item) => {
                const Icon = item.icon
                const on = active?.href === item.href
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex w-full items-center gap-[12px] rounded-[6px] p-[16px] text-[18px] font-medium transition-colors ${
                            on ? 'bg-white text-black' : 'text-grey hover:text-black'
                        }`}
                    >
                        <Icon size={24} strokeWidth={2} className="shrink-0" />
                        {item.label}
                    </Link>
                )
            })}
        </aside>
    )
}

// Mobil menyu (Figma 438:19097) — joriy bo'limni ko'rsatuvchi oq qator,
// bosilganda ro'yxat ochiladi.
function AdminMobileNav() {
    const pathname = usePathname()
    const active = activeNavItem(pathname) || ADMIN_NAV[0]
    const [open, setOpen] = useState(false)
    const box = useRef(null)

    // Menyudan tashqariga bosilsa yopiladi.
    useEffect(() => {
        if (!open) return

        function onDown(e) {
            if (!box.current?.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', onDown)
        return () => document.removeEventListener('mousedown', onDown)
    }, [open])

    const ActiveIcon = active.icon

    return (
        <Container className="lg:hidden">
            <div ref={box} className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    className="flex w-full cursor-pointer items-center justify-between rounded-[6px] bg-white px-[16px] py-[12px]"
                >
                    <span className="flex items-center gap-[8px] text-[14px] font-medium text-grey">
                        <ActiveIcon size={24} strokeWidth={2} className="shrink-0" />
                        {active.label}
                    </span>
                    <ChevronDown
                        size={24}
                        strokeWidth={2}
                        className={`shrink-0 text-black transition-transform ${
                            open ? 'rotate-180' : ''
                        }`}
                    />
                </button>

                {open && (
                    <div className="fade-in absolute top-[calc(100%+4px)] right-0 left-0 z-30 flex flex-col overflow-hidden rounded-[6px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                        {ADMIN_NAV.map((item) => {
                            const Icon = item.icon
                            const on = item.href === active.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={`flex items-center gap-[8px] px-[16px] py-[12px] text-[14px] font-medium transition-colors ${
                                        on ? 'bg-light-white text-black' : 'text-grey'
                                    }`}
                                >
                                    <Icon size={24} strokeWidth={2} className="shrink-0" />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </Container>
    )
}
