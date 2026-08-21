'use client'

import React, { Suspense } from 'react'
import OauthError from '@/components/auth/oauth/oauth-error'

// `useSearchParams` Suspense chegarasini talab qiladi (Next.js App Router).
export default function Page() {
    return (
        <Suspense fallback={null}>
            <OauthError />
        </Suspense>
    )
}
