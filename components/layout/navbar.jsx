'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { PUBLIC_NAV } from '@/lib/nav'
import { homeForRole } from '@/lib/roles'
import { useAuth } from '@/lib/use-auth'
import Button from '@/components/ui/button'
import Container from '@/components/ui/container'
import { LOGO } from '@/lib/assets'

// ─────────────────────────────────────────────────────────────────────────────
// Figma: heder hero ichida turadi (81:1781 / 373:17017) — shaffof fon,
// oq matn. Mobil menyu tepadan ochiladigan oq panel (373:17349).
//
// Bosh sahifada heder hero ustida (absolute), qolgan sahifalarda —
// oq fonli yopishqoq heder.
// ─────────────────────────────────────────────────────────────────────────────
export default function Navbar() {
    const pathname = usePathname()
    const { authed, role, ready } = useAuth()
    const [open, setOpen] = useState(false)

    // Menyu ochiq bo'lganda sahifa aylanmaydi va Esc bosilsa yopiladi.
    useEffect(() => {
        if (!open) return

        const { overflow } = document.body.style
        document.body.style.overflow = 'hidden'

        function onKeyDown(e) {
            if (e.key === 'Escape') setOpen(false)
        }
        document.addEventListener('keydown', onKeyDown)

        return () => {
            document.body.style.overflow = overflow
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [open])

    // Kabinet va auth bo'limlarida ochiq sayt hederи ko'rsatilmaydi.
    if (
        ['/admin', '/auth', '/client', '/company', '/executor', '/agency'].some((p) =>
            pathname.startsWith(p)
        )
    ) {
        return null
    }

    const overlay = pathname === '/'

    return (
        <header
            className={
                overlay
                    ? 'absolute top-0 right-0 left-0 z-40'
                    : 'sticky top-0 z-40 border-b border-black/8 bg-white'
            }
        >
            {/* Hero ustida turganda mobil maket 12px chekkasi ham hisobga olinadi
                (Figma 353:20607 — freym p-12, ichidagi qator py-12 → logotip 24px'da).
                Desktopda ikkala holatda ham py-24 (Figma 81:1643). */}
            <Container
                className={`flex items-center justify-between lg:py-[24px] ${
                    overlay ? 'pt-[24px] pb-[12px]' : 'py-[12px]'
                }`}
            >
                <Link href="/" className="relative block h-[41px] w-[37px] lg:h-[64px] lg:w-[58px]">
                    <Image
                        src={LOGO}
                        alt="База моделей"
                        fill
                        priority
                        sizes="58px"
                        className="object-contain"
                    />
                </Link>

                {/* Desktop menyu */}
                <nav className="hidden items-center gap-[24px] lg:flex">
                    {PUBLIC_NAV.map((item) => {
                        const active = pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-[18px] transition-opacity hover:opacity-70 ${
                                    overlay ? 'text-white' : 'text-black'
                                } ${active ? 'opacity-100' : 'opacity-90'}`}
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* O'ng tomon */}
                <div className="flex items-center gap-[16px]">
                    {ready && authed ? (
                        <Button href={homeForRole(role)} variant="gold" size="md" className="lg:px-[24px] lg:py-[16px] lg:text-[18px]">
                            Кабинет
                        </Button>
                    ) : (
                        <Button href="/auth/login" variant="gold" size="md" className="lg:px-[24px] lg:py-[16px] lg:text-[18px]">
                            Войти
                        </Button>
                    )}

                    {/* Button'ning bazaviy `inline-flex` klassi CSS'da `hidden`dan
                        keyin turadi va uni yengib qo'yadi, shuning uchun ko'rinishni
                        tashqi o'ram boshqaradi (Figma mobil 353:20611 — bu tugma yo'q). */}
                    <span className="hidden lg:inline-flex">
                        <Button
                            href="/company/projects/new"
                            variant={overlay ? 'whiteStroke' : 'darkStroke'}
                            size="xl"
                        >
                            Разместить проект
                        </Button>
                    </span>

                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        aria-label="Меню"
                        className={`flex cursor-pointer items-center rounded-[6px] p-[4px] backdrop-blur-[2.5px] transition-colors lg:hidden ${
                            overlay
                                ? 'bg-black/25 text-white hover:bg-black/45'
                                : 'bg-black/5 text-black hover:bg-black/10'
                        }`}
                    >
                        <Menu size={24} strokeWidth={2} />
                    </button>
                </div>
            </Container>

            {/* ── Mobil menyu (Figma 373:17349) ──────────────────────────────
                DOM'da doim turadi, ko'rinishi esa `open` bo'yicha animatsiyalanadi:
                fon sekin qorayadi, oq panel tepadan sirg'alib tushadi. Yopiq holatda
                `inert` — fokus va skrinriderlar uchun mavjud emas. */}
            <div
                inert={!open}
                className={`fixed inset-0 z-50 lg:hidden ${
                    open ? '' : 'pointer-events-none'
                }`}
            >
                <button
                    type="button"
                    aria-label="Закрыть меню"
                    tabIndex={open ? 0 : -1}
                    onClick={() => setOpen(false)}
                    className={`absolute inset-0 cursor-default bg-black/25 transition-opacity duration-300 ease-out ${
                        open ? 'opacity-100' : 'opacity-0'
                    }`}
                />

                <div
                    className={`relative flex w-full flex-col gap-[16px] rounded-b-[6px] bg-white p-[12px] transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                        open ? 'translate-y-0' : '-translate-y-full'
                    }`}
                >
                        <div className="flex items-center justify-between">
                            <Link
                                href="/"
                                onClick={() => setOpen(false)}
                                className="relative block h-[41px] w-[37px]"
                            >
                                <Image
                                    src={LOGO}
                                    alt="База моделей"
                                    fill
                                    sizes="37px"
                                    className="object-contain"
                                />
                            </Link>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Закрыть"
                                className="cursor-pointer p-[2px] text-black"
                            >
                                <X size={24} strokeWidth={2} />
                            </button>
                        </div>

                        <nav className="flex flex-col justify-center gap-[16px]">
                            {PUBLIC_NAV.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="text-[14px] text-black transition-colors hover:text-gold"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <Button
                            href="/company/projects/new"
                            variant="goldStroke"
                            size="md"
                            full
                            onClick={() => setOpen(false)}
                        >
                            Разместить проект
                        </Button>
                </div>
            </div>
        </header>
    )
}
