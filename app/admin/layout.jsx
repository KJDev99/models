'use client'

import React from 'react'
import RoleGuard from '@/components/guards/role-guard'
import AdminShell from '@/components/admin/admin-shell'
import { ROLES } from '@/lib/roles'

// Administrator paneli — Figma «Дашборд» 321:12629.
// Karkas ochiq saytdan butunlay boshqacha: o'z hederi va 210px chap menyusi bor.
export default function AdminLayout({ children }) {
    return (
        <RoleGuard allow={[ROLES.ADMIN]}>
            <AdminShell>{children}</AdminShell>
        </RoleGuard>
    )
}
