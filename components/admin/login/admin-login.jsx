'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import { LOGO } from '@/lib/assets'
import { useAuthStore } from '@/store/useAuthStore'
import { ROLES } from '@/lib/roles'

// ─────────────────────────────────────────────────────────────────────────────
// Adminka kirish sahifasi — POST /admin/auth/login (backend/admin.md).
//
// Ochiq saytdagi «Авторизация» oynasidan farqi: rol tanlash va challenge
// yo'q, faqat pochta + parol. Kirgach `/admin/dashboard` ga o'tadi.
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminLogin() {
    const router = useRouter()
    const adminLogin = useAuthStore((s) => s.adminLogin)
    const loading = useAuthStore((s) => s.loading)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [shown, setShown] = useState(false)
    const [error, setError] = useState(null)

    async function submit(e) {
        e.preventDefault()
        setError(null)

        const res = await adminLogin({ email, password })
        if (!res.success) {
            setError(res.error.message)
            return
        }
        if (res.user?.role !== ROLES.ADMIN) {
            setError('Этот аккаунт не является администратором')
            return
        }
        toast.success('Вы вошли в панель управления')
        router.push('/admin/dashboard')
    }

    return (
        <form
            onSubmit={submit}
            className="flex w-full max-w-[420px] flex-col gap-[16px] rounded-[6px] bg-white p-[16px] lg:gap-[24px] lg:p-[24px]"
        >
            <div className="flex flex-col items-center gap-[12px]">
                <Image src={LOGO} alt="База моделей" width={58} height={64} />
                <h1 className="font-display text-[24px] leading-none tracking-[0.48px] text-black uppercase lg:text-[32px] lg:tracking-[0.64px]">
                    Панель управления
                </h1>
            </div>

            <label className="flex flex-col gap-[8px] lg:gap-[12px]">
                <span className="text-[14px] text-grey lg:text-[16px]">Электронная почта</span>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mail.ru"
                    autoComplete="username"
                    className="w-full rounded-[6px] bg-light-white p-[12px] text-[14px] text-black outline-none placeholder:text-[#aaa] lg:p-[16px] lg:text-[16px]"
                />
            </label>

            <label className="flex flex-col gap-[8px] lg:gap-[12px]">
                <span className="text-[14px] text-grey lg:text-[16px]">Пароль</span>
                <span className="relative block">
                    <input
                        type={shown ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Введите пароль"
                        autoComplete="current-password"
                        className="w-full rounded-[6px] bg-light-white p-[12px] pr-[44px] text-[14px] text-black outline-none placeholder:text-[#aaa] lg:p-[16px] lg:pr-[52px] lg:text-[16px]"
                    />
                    <button
                        type="button"
                        onClick={() => setShown((v) => !v)}
                        aria-label={shown ? 'Скрыть пароль' : 'Показать пароль'}
                        className="absolute top-1/2 right-[12px] flex -translate-y-1/2 cursor-pointer items-center text-black transition-opacity hover:opacity-70 lg:right-[16px]"
                    >
                        {shown ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
                    </button>
                </span>
            </label>

            {error && (
                <p role="alert" className="text-[14px] text-danger lg:text-[16px]">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={!email || !password || loading}
                className="ui-shine relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-[6px] bg-gold px-[24px] py-[12px] text-[14px] font-medium text-white transition-colors hover:bg-[#c19754] disabled:cursor-not-allowed disabled:opacity-50 lg:py-[16px] lg:text-[18px]"
            >
                <span className="relative">{loading ? 'Входим…' : 'Войти'}</span>
            </button>
        </form>
    )
}
