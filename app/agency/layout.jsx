'use client'

import React from 'react'
import RoleGuard from '@/components/guards/role-guard'
import { ROLES } from '@/lib/roles'
import LegacyPageFrame from '@/components/shared/cabinet/legacy-page-frame'

// «Агентство» kabineti — Figma'da (270:19921 bandi) alohida karkas yo'q:
// ochiq saytning hederi va futeri ishlatiladi, sahifa ichida esa
// «Главная > Личный кабинет» yo'lakchasi turadi.
export default function AgencyLayout({ children }) {
    return (
        <RoleGuard allow={[ROLES.AGENCY]}>
            <LegacyPageFrame>{children}</LegacyPageFrame>
        </RoleGuard>
    )
}
