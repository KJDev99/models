'use client'

import React from 'react'
import RoleGuard from '@/components/guards/role-guard'
import CabinetLayout from '@/components/cabinet/cabinet-layout'
import { ROLES } from '@/lib/roles'

// Компания kabinetining karkasi: rol tekshiruvi + chap menyu.
// Har bir ichki sahifaning o'z layout.jsx'i metadata beradi.
export default function CompanyLayout({ children }) {
    return (
        <RoleGuard allow={ALLOW}>
            <CabinetLayout role={ROLES.COMPANY}>{children}</CabinetLayout>
        </RoleGuard>
    )
}

// Modul darajasida — har renderda yangi massiv `RoleGuard` effektini
// qayta ishga tushirmasligi uchun.
const ALLOW = [ROLES.COMPANY]
