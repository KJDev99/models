'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Heart, Mail, Menu, X } from 'lucide-react'
import { PUBLIC_NAV } from '@/lib/nav'
import { ROLES, roleFromPathname } from '@/lib/roles'
import { useAuth } from '@/lib/use-auth'
import { SKIP_GUARDS } from '@/lib/dev-preview'
import { useAuthModalStore } from '@/store/useAuthModalStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import Button from '@/components/ui/button'
import Container from '@/components/ui/container'
import UserMenu from '@/components/layout/user-menu'
import { LOGO } from '@/lib/assets'

// ─────────────────────────────────────────────────────────────────────────────
// Figma: heder hero ichida turadi (81:1781 / 373:17017) — shaffof fon,
// oq matn. Mobil menyu tepadan ochiladigan oq panel (373:17349).
//
// Bosh sahifada heder hero ustida (absolute), qolgan sahifalarda —
// oq fonli yopishqoq heder.
// ─────────────────────────────────────────────────────────────────────────────
// Avtorizatsiyadan keyingi ikonkalar (Figma 164:16185 / 164:16186 / 164:16187).
const AUTHED_ICONS = [
    { href: '/chat', label: 'Сообщения', icon: Mail },
    { href: '/favorites', label: 'Избранное', icon: Heart },
    // Faqat qo'ng'iroqda o'qilmagan bildirishnoma nuqtasi bor
    // (Figma «хедер» Variant3 — 193:2974: 13.5px gold doira, oq halqa).
    { href: '/notifications', label: 'Уведомления', icon: Bell, badge: true },
]

// Figma'da avatar bo'sh kulrang doira (164:16136) — rasm backenddan keladi.
const AVATAR = null

// Ochiq sayt hederi ostida turadigan kabinetlar
// (Figma 260:12525 / 260:11721 / 270:20520).
const CABINETS = ['/client', '/executor', '/agency']

// O'ng tomondagi asosiy tugma rolga qarab o'zgaradi: agentlik anketa qo'shadi
// (Figma 270:20523 — «Добавить анкету»), zakazchik loyiha joylashtiradi.
// Ijrochida bunday tugma yo'q — heder ham, futer ham tugmasiz (Figma 260:11717).
export function primaryCta(role) {
    if (role === ROLES.EXECUTOR) return null
    return role === ROLES.AGENCY
        ? { label: 'Добавить анкету', href: '/agency/executors/new' }
        : { label: 'Разместить проект', href: '/client/projects/new' }
}

export default function Navbar() {
    const pathname = usePathname()
    const { authed: signedIn, role, ready } = useAuth()

    // Kabinet sahifalarini tokensiz ko'rish rejimida (lib/dev-preview.js)
    // heder ham avtorizatsiyalangan ko'rinishda bo'lishi kerak.
    const inCabinet = CABINETS.some((p) => pathname.startsWith(p))
    const authed = (ready && signedIn) || (SKIP_GUARDS && inCabinet)
    const currentRole = role || roleFromPathname(pathname)
    const cta = primaryCta(currentRole)
    const [open, setOpen] = useState(false)

    // «Войти» sahifaga o'tmaydi — Авторизация oynasini ochadi (Figma 75:171).
    const openAuth = useAuthModalStore((s) => s.openAuth)

    // Bildirishnoma nuqtasi backend ma'lumotidan chiqadi: 0 bo'lsa Variant2,
    // 0 dan katta bo'lsa Variant3 ko'rinishi.
    const unread = useNotificationStore((s) => s.unread)

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
    // Istisno — `CABINETS` ro'yxatidagi kabinetlar: Figma'da (260:12525 /
    // 260:11721 / 270:20520) ular aynan shu heder ostida turadi, faqat o'ng
    // tomoni avtorizatsiya holatiga o'tadi.
    if (['/admin', '/auth', '/company'].some((p) => pathname.startsWith(p))) {
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

                {/* O'ng tomon.
                    Kirmagan holat (Figma 164:16136): «Войти» + «Разместить проект».
                    Kirgan holat (Figma 260:12525): xat / sevimlilar / bildirishnoma
                    ikonkalari, gold konturli «Разместить проект» va 54px avatar. */}
                <div className="flex items-center gap-[16px]">
                    {/* Mobilda ham xuddi shu ikonkalar turadi
                        (Figma 415:17509 / 434:17271 — ✉ ♡ 🔔 avatar ☰). */}
                    {authed ? (
                        <div className="flex items-center gap-[16px]">
                            {AUTHED_ICONS.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        aria-label={item.label}
                                        className={`relative transition-opacity hover:opacity-70 ${
                                            overlay ? 'text-white' : 'text-black'
                                        }`}
                                    >
                                        <Icon size={24} strokeWidth={2} />
                                        {item.badge && unread > 0 && (
                                            <span className="absolute -top-[3px] left-[11px] size-[13.5px] rounded-full border-[1.5px] border-white bg-gold" />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    ) : (
                        <Button
                            onClick={() => openAuth()}
                            variant="gold"
                            size="lg"
                        >
                            Войти
                        </Button>
                    )}

                    {/* Button'ning bazaviy `inline-flex` klassi CSS'da `hidden`dan
                        keyin turadi va uni yengib qo'yadi, shuning uchun ko'rinishni
                        tashqi o'ram boshqaradi (Figma mobil 353:20611 — bu tugma yo'q). */}
                    {cta && (
                        <span className="hidden lg:inline-flex">
                            <Button
                                href={cta.href}
                                variant={
                                    authed ? 'goldStroke' : overlay ? 'whiteStroke' : 'darkStroke'
                                }
                                size="xl"
                            >
                                {cta.label}
                            </Button>
                        </span>
                    )}

                    {/* Avatar bosilganda menyu ochiladi (Figma 270:18052).
                        Tokensiz ko'rish rejimida rol manzildan aniqlanadi. */}
                    {authed && (
                        <UserMenu role={currentRole} avatar={AVATAR} />
                    )}

                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        aria-label="Меню"
                        // `p-4 -m-4` — ikonka Figma'dagidek 24px joyda turadi,
                        // ammo bosish/hover maydoni 32×32 bo'ladi (373:17034).
                        className={`-m-[4px] flex cursor-pointer items-center rounded-[6px] p-[4px] transition-colors lg:hidden ${
                            overlay
                                ? 'text-white hover:bg-white/20'
                                : 'text-black hover:bg-black/10'
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
                                className="cursor-pointer text-black"
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

                        {cta && (
                            <Button
                                href={cta.href}
                                variant="goldStroke"
                                size="md"
                                full
                                onClick={() => setOpen(false)}
                            >
                                {cta.label}
                            </Button>
                        )}
                </div>
            </div>
        </header>
    )
}
