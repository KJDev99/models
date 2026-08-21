'use client'

import React from 'react'
import RoleGuard from '@/components/guards/role-guard'
import { ROLES } from '@/lib/roles'
import LegacyPageFrame from '@/components/shared/cabinet/legacy-page-frame'

// «Исполнитель» kabineti — Figma'da (260:10428 bandi) alohida karkas yo'q:
// ochiq saytning hederi va futeri ishlatiladi, sahifa ichida esa
// «Главная > Личный кабинет» yo'lakchasi turadi. Shu sababli bu yerda
// faqat rol tekshiruvi qoladi.
export default function ExecutorLayout({ children }) {
    return (
        <RoleGuard allow={ALLOW}>
            <LegacyPageFrame>{children}</LegacyPageFrame>
        </RoleGuard>
    )
}

// Modul darajasida — har renderda yangi massiv `RoleGuard` effektini
// qayta ishga tushirmasligi uchun.
const ALLOW = [ROLES.EXECUTOR]
