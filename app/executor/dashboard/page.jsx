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
    // Anketa holati endi backenddan keladi (GET /performer/cabinet).
    // `?settings=1` — heder menyusidagi «Настройки профиля» oynasini ochadi.
    return <ExecutorDashboard openSettings={params.get('settings') === '1'} />
}
