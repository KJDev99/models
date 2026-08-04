'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AuthCard from '@/components/auth/auth-card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { useAuthStore } from '@/store/useAuthStore'

export default function ForgotForm() {
    const router = useRouter()
    const forgotPassword = useAuthStore((s) => s.forgotPassword)
    const loading = useAuthStore((s) => s.loading)
    const [login, setLogin] = useState('')

    async function submit(e) {
        e.preventDefault()
        const res = await forgotPassword({ login })
        if (res.success) {
            sessionStorage.setItem('auth_login', login)
            toast.success('Код отправлен')
            router.push('/auth/reset-password')
        } else {
            toast.error('Аккаунт не найден')
        }
    }

    return (
        <AuthCard
            title="Восстановление пароля"
            description="Укажите телефон или почту — отправим код для сброса пароля."
            back="/auth/login"
        >
            <form onSubmit={submit} className="flex flex-col gap-5">
                <Input
                    label="Телефон или почта"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                />
                <Button type="submit" loading={loading} full>
                    Отправить код
                </Button>
            </form>
        </AuthCard>
    )
}
