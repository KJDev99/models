'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PUBLIC_NAV } from '@/lib/nav'
import { homeForRole } from '@/lib/roles'
import { useAuth } from '@/lib/use-auth'
import { useAuthModalStore } from '@/store/useAuthModalStore'
import Button from '@/components/ui/button'
import Container from '@/components/ui/container'
import { LOGO } from '@/lib/assets'

// ─────────────────────────────────────────────────────────────────────────────
// Figma: футер — desktop 247:4966, mobil 373:17216.
// Desktop: bitta qatorda logo + menyu + tugmalar, ostida huquqiy matnlar.
// Mobil: hammasi ustma-ust, tugmalar to'liq kenglikda.
// ─────────────────────────────────────────────────────────────────────────────

const LEGAL_LEFT = ['@ Все права защищены 2026', 'Разработано в Usertech']

const LEGAL_RIGHT = [
    { label: 'Пользовательское соглашение', href: '/terms' },
    { label: 'Политика конфиденциальности', href: '/privacy' },
]

export default function Footer() {
    const pathname = usePathname()
    const { authed, role, ready } = useAuth()

    // «Войти» — Авторизация oynasini ochadi, sahifaga o'tmaydi.
    const openAuth = useAuthModalStore((s) => s.openAuth)

    if (
        ['/admin', '/auth', '/client', '/company', '/executor', '/agency'].some((p) =>
            pathname.startsWith(p)
        )
    ) {
        return null
    }

    return (
        <footer className="w-full bg-black">
            <Container className="flex flex-col gap-[16px] py-[20px] lg:gap-[24px] lg:py-[50px]">
                <div className="flex flex-col gap-[16px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
                    <div className="flex flex-col gap-[16px] lg:flex-row lg:items-center lg:gap-[50px]">
                        <Link
                            href="/"
                            className="relative block h-[60px] w-[54px] shrink-0 lg:h-[64px] lg:w-[58px]"
                        >
                            <Image
                                src={LOGO}
                                alt="База моделей"
                                fill
                                sizes="58px"
                                className="object-contain"
                            />
                        </Link>

                        <nav className="flex flex-col justify-center gap-[16px] lg:flex-row lg:items-center lg:gap-[24px]">
                            {PUBLIC_NAV.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-[14px] text-white transition-opacity hover:opacity-70 lg:text-[18px]"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex flex-col gap-[12px] lg:flex-row lg:items-center lg:gap-[16px]">
                        {ready && authed ? (
                            <Button href={homeForRole(role)} variant="gold" full className="lg:w-auto">
                                Кабинет
                            </Button>
                        ) : (
                            <Button
                                onClick={() => openAuth()}
                                variant="gold"
                                full
                                className="lg:w-auto"
                            >
                                Войти
                            </Button>
                        )}

                        <Button
                            href="/company/projects/new"
                            variant="whiteStroke"
                            full
                            className="lg:w-auto"
                        >
                            Разместить проект
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-[12px] text-[12px] text-[#b3b3b3] lg:flex-row lg:items-center lg:justify-between lg:gap-0 lg:text-[14px]">
                    <div className="flex flex-col gap-[12px] lg:flex-row lg:items-center lg:gap-[24px]">
                        {LEGAL_LEFT.map((text) => (
                            <span key={text}>{text}</span>
                        ))}
                    </div>

                    <div className="flex flex-col gap-[12px] lg:flex-row lg:items-center lg:gap-[24px]">
                        {LEGAL_RIGHT.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="transition-colors hover:text-white"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </Container>
        </footer>
    )
}
