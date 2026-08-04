'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AuthCard from '@/components/auth/auth-card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { useSessionValue } from '@/lib/use-session-value'
import { useAuthStore } from '@/store/useAuthStore'

export default function ResetForm() {
    const router = useRouter()
    const resetPassword = useAuthStore((s) => s.resetPassword)
    const loading = useAuthStore((s) => s.loading)

    const login = useSessionValue('auth_login')
    const [form, setForm] = useState({ code: '', password: '', repeat: '' })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    async function submit(e) {
        e.preventDefault()
        if (form.password !== form.repeat) {
            toast.error('Пароли не совпадают')
            return
        }
        const res = await resetPassword({ login, code: form.code, password: form.password })
        if (res.success) {
            toast.success('Пароль обновлён')
            router.push('/auth/login')
        } else {
            toast.error('Неверный код')
        }
    }

    return (
        <AuthCard
            title="Новый пароль"
            description={login ? `Код отправлен на ${login}` : undefined}
            back="/auth/forgot-password"
        >
            <form onSubmit={submit} className="flex flex-col gap-5">
                <Input label="Код из сообщения" value={form.code} onChange={set('code')} required />
                <Input
                    label="Новый пароль"
                    type="password"
                    hint="Минимум 8 символов"
                    value={form.password}
                    onChange={set('password')}
                    required
                />
                <Input
                    label="Повторите пароль"
                    type="password"
                    value={form.repeat}
                    onChange={set('repeat')}
                    required
                />
                <Button type="submit" loading={loading} full>
                    Сохранить пароль
                </Button>
            </form>
        </AuthCard>
    )
}
