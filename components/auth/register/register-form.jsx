'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AuthCard from '@/components/auth/auth-card'
import Button from '@/components/ui/button'
import Checkbox from '@/components/ui/checkbox'
import Input from '@/components/ui/input'
import { useAuthStore } from '@/store/useAuthStore'

// Figma: Регистрация (85:3512).
export default function RegisterForm() {
    const router = useRouter()
    const register = useAuthStore((s) => s.register)
    const loading = useAuthStore((s) => s.loading)

    const [form, setForm] = useState({ name: '', login: '', password: '', repeat: '' })
    const [agree, setAgree] = useState(false)

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    async function submit(e) {
        e.preventDefault()
        if (!form.name || !form.login || !form.password) {
            toast.error('Заполните все поля')
            return
        }
        if (form.password !== form.repeat) {
            toast.error('Пароли не совпадают')
            return
        }
        if (!agree) {
            toast.error('Примите условия использования')
            return
        }

        const res = await register({
            name: form.name,
            login: form.login,
            password: form.password,
        })

        if (res.success) {
            sessionStorage.setItem('auth_login', form.login)
            // Keyingi qadam — "Знакомство": rol tanlash.
            router.push('/auth/register/role')
        } else {
            toast.error('Не удалось создать аккаунт')
        }
    }

    return (
        <AuthCard
            title="Регистрация"
            description="Создайте аккаунт — роль выберете на следующем шаге."
            footer={
                <>
                    Уже есть аккаунт?{' '}
                    <Link href="/auth/login" className="text-gold hover:opacity-80">
                        Войти
                    </Link>
                </>
            }
        >
            <form onSubmit={submit} className="flex flex-col gap-5">
                <Input label="Имя" value={form.name} onChange={set('name')} required />
                <Input
                    label="Телефон или почта"
                    value={form.login}
                    onChange={set('login')}
                    required
                />
                <Input
                    label="Пароль"
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

                <Checkbox
                    checked={agree}
                    onChange={setAgree}
                    label="Принимаю условия использования и политику конфиденциальности"
                />

                <Button type="submit" loading={loading} full>
                    Создать аккаунт
                </Button>
            </form>
        </AuthCard>
    )
}
