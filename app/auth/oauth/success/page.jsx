'use client'

import React, { Suspense } from 'react'
import OauthSuccess from '@/components/auth/oauth/oauth-success'

// `useSearchParams` Suspense chegarasini talab qiladi (Next.js App Router).
export default function Page() {
    return (
        <Suspense fallback={null}>
            <OauthSuccess />
        </Suspense>
    )
}
