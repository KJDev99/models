'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { setSession } from '@/lib/auth'
import { homeForRole, normalizeUser } from '@/lib/roles'
import { useAuthStore } from '@/store/useAuthStore'
import { useAuthModalStore } from '@/store/useAuthModalStore'
import * as authApi from '@/lib/api/auth'

// ─────────────────────────────────────────────────────────────────────────────
// Backend OAuth callback'dan keyin brauzerni shu manzilga qaytaradi:
//   /auth/oauth/success?access_token=...&refresh_token=...
//
// Vazifasi (backend/auth.md, 5-oyna):
//   1. Tokenlarni olib saqlash
//   2. URL'dan query'ni tozalash (history.replaceState)
//   3. GET /auth/me — foydalanuvchini olish
//   4. `is_profile_complete === false` bo'lsa «Знакомство» oynasini ochish,
//      aks holda rolga mos kabinetga o'tkazish
// ─────────────────────────────────────────────────────────────────────────────
export default function OauthSuccess() {
    const router = useRouter()
    const params = useSearchParams()
    const openAuth = useAuthModalStore((s) => s.openAuth)
    const setBlocked = useAuthStore((s) => s.setBlocked)
    const [message, setMessage] = useState('Завершаем вход…')

    // React Strict Mode'da effekt ikki marta ishga tushadi — bir martalik qulf.
    const done = useRef(false)

    useEffect(() => {
        if (done.current) return
        done.current = true

        const access = params.get('access_token')
        const refresh = params.get('refresh_token')

        if (!access) {
            router.replace('/auth/oauth/error?code=OAUTH_FAILED')
            return
        }

        setSession({ access, refresh })
        // Tokenlar manzil qatorida qolmasligi kerak.
        window.history.replaceState({}, '', '/auth/oauth/success')

        authApi
            .me()
            .then((raw) => {
                const user = normalizeUser(raw)
                setSession({ user })

                if (!raw.is_profile_complete) {
                    setMessage('Заполните профиль')
                    openAuth('profile')
                    router.replace('/')
                    return
                }

                toast.success('Вы вошли в аккаунт')
                router.replace(homeForRole(user.role))
            })
            .catch((err) => {
                const apiError = err?.api
                if (apiError?.code === 'ACCOUNT_BLOCKED') {
                    setBlocked(apiError)
                    router.replace('/')
                    return
                }
                router.replace('/auth/oauth/error?code=OAUTH_FAILED')
            })
    }, [params, router, openAuth, setBlocked])

    return (
        <div className="flex w-full max-w-[550px] flex-col items-center gap-[16px] rounded-[6px] bg-white p-[24px] text-center">
            <span
                aria-hidden
                className="size-[32px] animate-spin rounded-full border-2 border-gold border-t-transparent"
            />
            <p className="text-[16px] text-grey lg:text-[18px]">{message}</p>
        </div>
    )
}
