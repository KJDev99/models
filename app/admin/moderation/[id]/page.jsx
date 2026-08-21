'use client'

import React, { Suspense } from 'react'
import { useParams } from 'next/navigation'
import AdminModerationDetail from '@/components/admin/moderation/moderation-detail'

export default function AdminModerationDetailPage() {
    const { id } = useParams()
    // `useSearchParams()` — Suspense chegarasi kerak (Next 16).
    return (
        <Suspense fallback={<div className="h-[600px] animate-pulse rounded-[6px] bg-black/5" />}>
            <AdminModerationDetail id={id} />
        </Suspense>
    )
}
