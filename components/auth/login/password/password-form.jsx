'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AuthCard from '@/components/auth/auth-card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { popReturnUrl } from '@/lib/auth'
import { homeForRole } from '@/lib/roles'
import { useSessionValue } from '@/lib/use-session-value'
import { useAuthStore } from '@/store/useAuthStore'

// Figma: "Введите пароль" (85:1371, 85:2398) — kod yoki parolni tasdiqlash.
export default function PasswordForm() {
    const router = useRouter()
    const verifyCode = useAuthStore((s) => s.verifyCode)
    const sendCode = useAuthStore((s) => s.sendCode)
    const loading = useAuthStore((s) => s.loading)

    // Oldingi qadamda kiritilgan telefon/pochta.
    const login = useSessionValue('auth_login')
    const [code, setCode] = useState('')
    const [seconds, setSeconds] = useState(60)

    // Qayta yuborish taymeri.
    useEffect(() => {
        if (seconds <= 0) return
        const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
        return () => clearTimeout(t)
    }, [seconds])

    async function submit(e) {
        e.preventDefault()
        const res = await verifyCode({ login, code })
        if (res.success) {
            const back = popReturnUrl()
            router.push(back || homeForRole(res.data?.user?.role))
        } else {
            toast.error('Неверный код')
        }
    }

    async function resend() {
        const res = await sendCode({ login })
        if (res.success) {
            setSeconds(60)
            toast.success('Код отправлен повторно')
        }
    }

    return (
        <AuthCard
            title="Введите код"
            description={login ? `Код отправлен на ${login}` : 'Введите код из сообщения'}
            back="/auth/login"
        >
            <form onSubmit={submit} className="flex flex-col gap-5">
                <Input
                    label="Код подтверждения"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="______"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />

                <Button type="submit" loading={loading} full>
                    Подтвердить
                </Button>

                <button
                    type="button"
                    onClick={resend}
                    disabled={seconds > 0}
                    className="text-sm text-grey transition-colors hover:text-black disabled:opacity-50"
                >
                    {seconds > 0 ? `Отправить код повторно через ${seconds} с` : 'Отправить код повторно'}
                </button>
            </form>
        </AuthCard>
    )
}
