'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/use-auth'
import { setReturnUrl } from '@/lib/auth'
import { SKIP_GUARDS } from '@/lib/dev-preview'
import Spinner from '@/components/ui/spinner'

// Kirish talab qilinadigan har qanday sahifa uchun.
// Kirmagan bo'lsa — joriy manzilni eslab, /auth/login ga yuboradi
// (Figma: "Требуется вход" 164:14791).
export default function AuthGuard({ children }) {
    const { authed, ready } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (SKIP_GUARDS) return
        if (ready && !authed) {
            setReturnUrl(pathname)
            router.replace('/auth/login')
        }
    }, [ready, authed, pathname, router])

    if (!SKIP_GUARDS && (!ready || !authed)) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Spinner size={32} />
            </div>
        )
    }

    return children
}
