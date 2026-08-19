'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ExecutorDashboard from '@/components/executor/dashboard/dashboard-view'

// `useSearchParams` statik prerender'da Suspense ichida bo'lishi shart
// (Next.js 16 — missing-suspense-with-csr-bailout).
export default function ExecutorDashboardPage() {
    return (
        <Suspense fallback={null}>
            <DashboardWithParams />
        </Suspense>
    )
}

function DashboardWithParams() {
    const params = useSearchParams()
    // `?status=active | moderation | rejected` — Figma'dagi to'ldirilgan
    // anketa holatlarini ko'rish uchun. Standart holat — bo'sh anketa.
    // `?settings=1` — heder menyusidagi «Настройки профиля» oynasini ochadi.
    return (
        <ExecutorDashboard
            status={params.get('status') || 'empty'}
            openSettings={params.get('settings') === '1'}
        />
    )
}
