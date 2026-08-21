'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import RoleGuard from '@/components/guards/role-guard'
import AdminShell from '@/components/admin/admin-shell'
import { ROLES } from '@/lib/roles'

// Adminka bo'limi — Figma «Административная панель» 321:12608.
// Karkas ochiq saytdan butunlay boshqacha: o'z hederi va 210px chap menyusi bor.
//
// `/admin/login` — yagona istisno: kirish sahifasi `RoleGuard`ning ichida
// bo'lsa, mehmon cheksiz qayta yo'naltiriladi. Ichki `layout.jsx` bu yerdan
// qutqarmaydi (Next'da layoutlar bir-birining ustiga qo'shiladi), shuning
// uchun tekshiruv shu yerda.
const GUEST_PATHS = ['/admin/login']

export default function AdminLayout({ children }) {
    const pathname = usePathname()

    if (GUEST_PATHS.includes(pathname)) return children

    return (
        <RoleGuard allow={ADMIN_ONLY}>
            <AdminShell>{children}</AdminShell>
        </RoleGuard>
    )
}

// Modul darajasida — har renderda yangi massiv `RoleGuard` effektini
// qayta ishga tushirmasligi uchun.
const ADMIN_ONLY = [ROLES.ADMIN]
