'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AuthCard from '@/components/auth/auth-card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Tabs from '@/components/ui/tabs'
import { popReturnUrl } from '@/lib/auth'
import { homeForRole } from '@/lib/roles'
import { useAuthStore } from '@/store/useAuthStore'

// Figma: ВХОД (75:171) — telefon yoki pochta orqali kirish.
const METHODS = [
    { label: 'По телефону', value: 'phone' },
    { label: 'По почте', value: 'email' },
]

export default function LoginForm() {
    const router = useRouter()
    const login = useAuthStore((s) => s.login)
    const loading = useAuthStore((s) => s.loading)

    const [method, setMethod] = useState('phone')
    const [form, setForm] = useState({ login: '', password: '' })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    async function submit(e) {
        e.preventDefault()
        if (!form.login || !form.password) {
            toast.error('Заполните все поля')
            return
        }

        const res = await login(form)
        if (res.success) {
            const back = popReturnUrl()
            router.push(back || homeForRole(res.user?.role))
            return
        }
        if (res.blocked) {
            router.push('/auth/blocked')
            return
        }
        toast.error('Неверный логин или пароль')
    }

    return (
        <AuthCard
            title="Вход"
            description="Войдите, чтобы откликаться на проекты и приглашать исполнителей."
            footer={
                <>
                    Нет аккаунта?{' '}
                    <Link href="/auth/register" className="text-gold hover:opacity-80">
                        Зарегистрироваться
                    </Link>
                </>
            }
        >
            <Tabs items={METHODS} value={method} onChange={setMethod} className="mb-6" />

            <form onSubmit={submit} className="flex flex-col gap-5">
                <Input
                    label={method === 'phone' ? 'Телефон' : 'Почта'}
                    type={method === 'phone' ? 'tel' : 'email'}
                    placeholder={method === 'phone' ? '+7 (999) 000-00-00' : 'you@example.com'}
                    value={form.login}
                    onChange={set('login')}
                    required
                />
                <Input
                    label="Пароль"
                    type="password"
                    value={form.password}
                    onChange={set('password')}
                    required
                />

                <Link
                    href="/auth/forgot-password"
                    className="-mt-2 self-start text-sm text-grey transition-colors hover:text-black"
                >
                    Забыли пароль?
                </Link>

                <Button type="submit" loading={loading} full>
                    Войти
                </Button>

                <Button href="/auth/login/service" variant="whiteStroke" full>
                    Войти через сервис
                </Button>
            </form>
        </AuthCard>
    )
}
