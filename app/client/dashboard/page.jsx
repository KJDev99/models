'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ClientDashboard from '@/components/client/dashboard/dashboard-view'

// `useSearchParams` statik prerender'da Suspense ichida bo'lishi shart
// (Next.js 16 — missing-suspense-with-csr-bailout).
export default function ClientDashboardPage() {
    return (
        <Suspense fallback={null}>
            <DashboardWithParams />
        </Suspense>
    )
}

function DashboardWithParams() {
    const params = useSearchParams()
    // `?settings=1` — heder menyusidagi «Настройки профиля» oynasini ochadi.
    return <ClientDashboard openSettings={params.get('settings') === '1'} />
}
