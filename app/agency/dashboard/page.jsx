'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AgencyDashboard from '@/components/agency/dashboard/dashboard-view'

// `useSearchParams` statik prerender'da Suspense ichida bo'lishi shart
// (Next.js 16 — missing-suspense-with-csr-bailout).
export default function AgencyDashboardPage() {
    return (
        <Suspense fallback={null}>
            <DashboardWithParams />
        </Suspense>
    )
}

function DashboardWithParams() {
    const params = useSearchParams()
    // Profil holati backenddan keladi (GET /agency/cabinet).
    // `?settings=1` — heder menyusidagi «Настройки профиля» oynasini ochadi.
    return <AgencyDashboard openSettings={params.get('settings') === '1'} />
}
