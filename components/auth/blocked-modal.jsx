'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AUTH_BLOCKED_EVENT } from '@/lib/auth'
import { useAuthStore } from '@/store/useAuthStore'
import { AuthButton, AuthShell } from '@/components/auth/auth-modal/auth-modal-ui'
import { BLOCKED_FALLBACK } from '@/components/auth/auth-modal/auth-modal-data'
import { formatDate } from '@/lib/format'

// ─────────────────────────────────────────────────────────────────────────────
// «АККАУНТ ЗАБЛОКИРОВАН» — Figma 345:18815.
//
// Istalgan so'rov `403 ACCOUNT_BLOCKED` qaytarsa axios interceptor
// `auth-blocked` hodisasini yuboradi va shu oyna ochiladi (backend/auth.md,
// 6-oyna). Matnlar `error.details` dan olinadi.
// ─────────────────────────────────────────────────────────────────────────────
export default function BlockedModal() {
    const router = useRouter()
    const logout = useAuthStore((s) => s.logout)
    const blocked = useAuthStore((s) => s.blocked)
    const setBlocked = useAuthStore((s) => s.setBlocked)
    const [fromEvent, setFromEvent] = useState(null)

    useEffect(() => {
        function onBlocked(e) {
            setFromEvent(e.detail)
        }
        window.addEventListener(AUTH_BLOCKED_EVENT, onBlocked)
        return () => window.removeEventListener(AUTH_BLOCKED_EVENT, onBlocked)
    }, [])

    // Ikki manba: interceptor hodisasi yoki login oqimidagi xato (store).
    const info = fromEvent || blocked
    if (!info) return null

    const details = info.details || {}

    function close() {
        setFromEvent(null)
        setBlocked(null)
    }

    async function back() {
        close()
        await logout()
        router.push('/')
    }

    return (
        <AuthShell title={details.title || 'Аккаунт заблокирован'} onClose={close}>
            <p className="text-center text-[14px] text-grey lg:text-[18px]">
                {info.message || BLOCKED_FALLBACK.description}
            </p>

            <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                <p className="text-[14px] text-grey lg:text-[16px]">Мера</p>
                <p className="text-[14px] text-black lg:text-[16px]">
                    {details.measure || BLOCKED_FALLBACK.measure}
                </p>
            </div>

            <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                <p className="text-[14px] text-grey lg:text-[16px]">Причина</p>
                <p className="text-[14px] text-black lg:text-[16px]">
                    {details.reason || BLOCKED_FALLBACK.reason}
                </p>
            </div>

            {details.blocked_until && (
                <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                    <p className="text-[14px] text-grey lg:text-[16px]">Срок</p>
                    <p className="text-[14px] text-black lg:text-[16px]">
                        до {formatDate(details.blocked_until)}
                    </p>
                </div>
            )}

            <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                <AuthButton
                    onClick={() => {
                        close()
                        router.push('/contacts')
                    }}
                >
                    Связаться с поддержкой
                </AuthButton>
                <AuthButton variant="secondary" onClick={back}>
                    Назад
                </AuthButton>
            </div>
        </AuthShell>
    )
}
