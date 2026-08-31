'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PUBLIC_NAV } from '@/lib/nav'
import { roleFromPathname } from '@/lib/roles'
import { useAuth } from '@/lib/use-auth'
import { SKIP_GUARDS } from '@/lib/dev-preview'
import { useAuthModalStore } from '@/store/useAuthModalStore'
import Button from '@/components/ui/button'
import { primaryCta } from '@/components/layout/navbar'
import Container from '@/components/ui/container'
import { LOGO } from '@/lib/assets'

// ─────────────────────────────────────────────────────────────────────────────
// Figma: футер — desktop 247:4966, mobil 373:17216.
// Desktop: bitta qatorda logo + menyu + tugmalar, ostida huquqiy matnlar.
// Mobil: hammasi ustma-ust va markazda (mijoz izohi 30.08), tugmalar to'liq
// kenglikda. Desktopda joylashuv o'zgarmaydi — markazlash faqat `lg:` gacha.
// ─────────────────────────────────────────────────────────────────────────────

const LEGAL_LEFT = ['@ Все права защищены 2026', 'Разработано в Usertech']

const LEGAL_RIGHT = [
    { label: 'Пользовательское соглашение', href: '/terms' },
    { label: 'Политика конфиденциальности', href: '/privacy' },
]

export default function Footer() {
    const pathname = usePathname()
    const { authed: signedIn, role, ready } = useAuth()

    // Kabinetni tokensiz ko'rish rejimida (lib/dev-preview.js) futer ham
    // avtorizatsiyalangan ko'rinishda bo'ladi — heder bilan bir xil.
    const cabinetRole = roleFromPathname(pathname)
    const authed = (ready && signedIn) || (SKIP_GUARDS && Boolean(cabinetRole))
    const cta = primaryCta(role || cabinetRole)

    // «Войти» — Авторизация oynasini ochadi, sahifaga o'tmaydi.
    const openAuth = useAuthModalStore((s) => s.openAuth)

    // Заказчик (/client), Исполнитель (/executor) va Агентство (/agency)
    // kabinetlari ochiq saytning heder va futerida turadi
    // (Figma 260:12521 / 270:22815 / 270:20517), shuning uchun ular yo'q.
    if (['/admin', '/auth', '/company'].some((p) => pathname.startsWith(p))) {
        return null
    }

    return (
        <footer className="w-full bg-black">
            <Container className="flex flex-col items-center gap-[16px] py-[20px] text-center lg:items-stretch lg:gap-[24px] lg:py-[50px] lg:text-left">
                <div className="flex w-full flex-col items-center gap-[16px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
                    <div className="flex flex-col items-center gap-[16px] lg:flex-row lg:items-center lg:gap-[50px]">
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

                        <nav className="flex flex-col items-center justify-center gap-[16px] lg:flex-row lg:items-center lg:gap-[24px]">
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

                    <div className="flex w-full flex-col gap-[12px] lg:w-auto lg:flex-row lg:items-center lg:gap-[16px]">
                        {/* Figma 270:21696: kirgan foydalanuvchida futerda faqat bitta
                            tugma qoladi — «Войти» ko'rsatilmaydi. */}
                        {!authed && (
                            <Button
                                onClick={() => openAuth()}
                                variant="gold"
                                full
                                className="lg:w-auto"
                            >
                                Войти
                            </Button>
                        )}

                        {cta && (
                            <Button href={cta.href} variant="whiteStroke" full className="lg:w-auto">
                                {cta.label}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex w-full flex-col items-center gap-[12px] text-[12px] text-[#b3b3b3] lg:flex-row lg:items-center lg:justify-between lg:gap-0 lg:text-[14px]">
                    <div className="flex flex-col items-center gap-[12px] lg:flex-row lg:items-center lg:gap-[24px]">
                        {LEGAL_LEFT.map((text) => (
                            <span key={text}>{text}</span>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-[12px] lg:flex-row lg:items-center lg:gap-[24px]">
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
