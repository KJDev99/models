'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/use-auth'
import { setReturnUrl } from '@/lib/auth'
import { ROLES, homeForRole } from '@/lib/roles'
import { SKIP_GUARDS } from '@/lib/dev-preview'
import Spinner from '@/components/ui/spinner'

// Rolga bog'langan bo'limlar uchun: /client, /company, /executor, /agency, /admin.
// Boshqa roldagi foydalanuvchi o'z kabinetiga qaytariladi.
export default function RoleGuard({ allow = [], children }) {
    const { authed, role, ready } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    const permitted = SKIP_GUARDS || (authed && allow.includes(role))

    useEffect(() => {
        if (SKIP_GUARDS || !ready) return
        if (!authed) {
            setReturnUrl(pathname)
            // Adminkaning o'z kirish sahifasi bor (backend/admin.md).
            router.replace(allow.includes(ROLES.ADMIN) ? '/admin/login' : '/auth/login')
            return
        }
        if (!allow.includes(role)) {
            router.replace(homeForRole(role))
        }
    }, [ready, authed, role, allow, pathname, router])

    if (!SKIP_GUARDS && (!ready || !permitted)) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Spinner size={32} />
            </div>
        )
    }

    return children
}
