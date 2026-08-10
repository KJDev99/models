'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthModalStore } from '@/store/useAuthModalStore'

// ─────────────────────────────────────────────────────────────────────────────
// Авторизация Figma'da alohida sahifa emas — modal (75:171 …). Shuning uchun
// `/auth/login` va `/auth/register` manzillari bosh sahifaga qaytaradi va
// o'sha zahoti kerakli qadamdan oynani ochadi.
//
// Bu manzillar hali `RoleGuard` va eski havolalarda uchraydi, shuning uchun
// yo'q qilinmadi — ular endi shunchaki oynaga olib boradi.
// ─────────────────────────────────────────────────────────────────────────────
export default function AuthRedirect({ step = 'role' }) {
    const router = useRouter()
    const openAuth = useAuthModalStore((s) => s.openAuth)

    useEffect(() => {
        router.replace('/')
        openAuth(step)
    }, [router, openAuth, step])

    return null
}
