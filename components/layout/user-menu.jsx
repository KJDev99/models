'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Settings, User } from 'lucide-react'
import { clearSession } from '@/lib/auth'
import { homeForRole } from '@/lib/roles'

// ─────────────────────────────────────────────────────────────────────────────
// Avatar ostidan ochiladigan menyu — Figma «меню» 270:18052, mobil 270:24762.
// Oq panel, radius 6, p-24 (24px gap), har bir qatorda 24px ikonka va 18px
// matn. Tashqariga bosilganda yoki Esc bosilganda yopiladi.
// ─────────────────────────────────────────────────────────────────────────────
export default function UserMenu({ role, avatar }) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        if (!open) return

        function onOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        function onKeyDown(e) {
            if (e.key === 'Escape') setOpen(false)
        }

        document.addEventListener('mousedown', onOutside)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('mousedown', onOutside)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [open])

    const home = homeForRole(role)

    // Kabinet «Настройки профиля» oynasini `?settings=1` bilan ochadi
    // (Figma'da bu alohida sahifa emas, oyna — 265:14993).
    const items = [
        { label: 'Личный кабинет', href: home, icon: User },
        { label: 'Настройки профиля', href: `${home}?settings=1`, icon: Settings },
    ]

    function logout() {
        setOpen(false)
        clearSession()
        router.push('/')
    }

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Меню профиля"
                className="relative block size-[24px] shrink-0 cursor-pointer overflow-hidden rounded-full bg-[#787878] lg:size-[54px]"
            >
                {/* Figma'da avatar — bo'sh kulrang doira (164:16136). Backend rasm
                    bergandan keyin `avatar` to'ldiriladi. */}
                {avatar && (
                    <Image src={avatar} alt="" fill sizes="54px" className="object-cover" />
                )}
            </button>

            {open && (
                <div
                    role="menu"
                    className="menu-in absolute top-full right-0 z-50 mt-[12px] flex min-w-[185px] flex-col gap-[16px] rounded-[6px] bg-white p-[16px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] lg:gap-[24px] lg:p-[24px]"
                >
                    {items.map((item) => {
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                role="menuitem"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-[12px] text-[14px] whitespace-nowrap text-black transition-colors hover:text-gold lg:text-[16px]"
                            >
                                <Icon size={24} strokeWidth={2} className="size-[20px] shrink-0 lg:size-[24px]" />
                                {item.label}
                            </Link>
                        )
                    })}

                    <button
                        type="button"
                        role="menuitem"
                        onClick={logout}
                        className="flex cursor-pointer items-center gap-[12px] text-[14px] whitespace-nowrap text-black transition-colors hover:text-gold lg:text-[16px]"
                    >
                        <LogOut size={24} strokeWidth={2} className="size-[20px] shrink-0 lg:size-[24px]" />
                        Выйти
                    </button>
                </div>
            )}
        </div>
    )
}
