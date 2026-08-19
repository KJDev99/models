'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Container from '@/components/ui/container'

// ─────────────────────────────────────────────────────────────────────────────
// Kabinetlarning Figma bo'yicha qayta chizilgan sahifalari o'z konteynerini
// o'zi beradi (masalan `/agency/dashboard`). Qolgan eski bo'limlar esa ilgari
// `CabinetLayout` ichida turgan va konteynerni o'shandan olgan edi — u olib
// tashlangach ular sahifa chetiga yopishib qolgan. Shu sababli faqat o'sha eski
// bo'limlar shu yerda o'raladi. Backendga ulashda ular qayta chizilgach, bu
// o'ram ham keraksiz bo'ladi.
// ─────────────────────────────────────────────────────────────────────────────

const REDESIGNED = [
    '/client/dashboard',
    '/client/projects',
    '/client/venues',
    '/executor/dashboard',
    '/executor/questionnaire',
    '/agency/dashboard',
    '/agency/executors',
]

export default function LegacyPageFrame({ children }) {
    const pathname = usePathname() || ''

    if (REDESIGNED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
        return children
    }

    return (
        <Container className="py-[24px] lg:py-[40px]">{children}</Container>
    )
}
