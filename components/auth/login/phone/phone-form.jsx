'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AuthCard from '@/components/auth/auth-card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { useAuthStore } from '@/store/useAuthStore'

// Figma: "Заказчик - Телефон" (75:844) — telefon kiritish, keyin SMS kod.
export default function PhoneForm() {
    const router = useRouter()
    const sendCode = useAuthStore((s) => s.sendCode)
    const loading = useAuthStore((s) => s.loading)
    const [phone, setPhone] = useState('')

    async function submit(e) {
        e.preventDefault()
        if (!phone) {
            toast.error('Введите номер телефона')
            return
        }
        const res = await sendCode({ login: phone })
        if (res.success) {
            sessionStorage.setItem('auth_login', phone)
            router.push('/auth/login/password')
        } else {
            toast.error('Не удалось отправить код')
        }
    }

    return (
        <AuthCard
            title="Вход по телефону"
            description="Отправим короткий код подтверждения по SMS."
            back="/auth/login"
        >
            <form onSubmit={submit} className="flex flex-col gap-5">
                <Input
                    label="Телефон"
                    type="tel"
                    placeholder="+7 (999) 000-00-00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <Button type="submit" loading={loading} full>
                    Получить код
                </Button>
            </form>
        </AuthCard>
    )
}
