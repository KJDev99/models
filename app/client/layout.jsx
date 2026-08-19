'use client'

import React from 'react'
import RoleGuard from '@/components/guards/role-guard'
import { ROLES } from '@/lib/roles'
import LegacyPageFrame from '@/components/shared/cabinet/legacy-page-frame'

// «Заказчик» kabineti — Figma'da (206:3248 bandi) alohida karkas yo'q:
// ochiq saytning hederi va futeri ishlatiladi, sahifa ichida esa
// «Главная > Личный кабинет» yo'lakchasi turadi. Shu sababli bu yerda
// faqat rol tekshiruvi qoladi.
export default function ClientLayout({ children }) {
    return (
        <RoleGuard allow={[ROLES.CLIENT]}>
            <LegacyPageFrame>{children}</LegacyPageFrame>
        </RoleGuard>
    )
}
