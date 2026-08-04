'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AuthCard from '@/components/auth/auth-card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { useAuthStore } from '@/store/useAuthStore'

// Figma: "Заказчик - Почта" (83:980).
export default function EmailForm() {
    const router = useRouter()
    const sendCode = useAuthStore((s) => s.sendCode)
    const loading = useAuthStore((s) => s.loading)
    const [email, setEmail] = useState('')

    async function submit(e) {
        e.preventDefault()
        if (!email) {
            toast.error('Введите почту')
            return
        }
        const res = await sendCode({ login: email })
        if (res.success) {
            sessionStorage.setItem('auth_login', email)
            router.push('/auth/login/password')
        } else {
            toast.error('Не удалось отправить письмо')
        }
    }

    return (
        <AuthCard
            title="Вход по почте"
            description="Отправим код подтверждения на указанный адрес."
            back="/auth/login"
        >
            <form onSubmit={submit} className="flex flex-col gap-5">
                <Input
                    label="Почта"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Button type="submit" loading={loading} full>
                    Получить код
                </Button>
            </form>
        </AuthCard>
    )
}
