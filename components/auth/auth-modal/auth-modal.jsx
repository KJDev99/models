'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAuthModalStore } from '@/store/useAuthModalStore'
import { useAuthStore } from '@/store/useAuthStore'
import { ROLES, homeForRole } from '@/lib/roles'
import {
    AuthButton,
    AuthField,
    AuthPasswordField,
    AuthPhoneField,
    AuthSelect,
    AuthShell,
    AuthSocialBar,
    AuthTabs,
} from '@/components/auth/auth-modal/auth-modal-ui'
import {
    BLOCKED_FALLBACK,
    CLIENT_TABS,
    EXECUTOR_TABS,
    GENDER_OPTIONS,
    ROLE_CARDS,
    ROLE_TITLES,
    SERVICES,
} from '@/components/auth/auth-modal/auth-modal-data'

// ─────────────────────────────────────────────────────────────────────────────
// Авторизация — bitta oyna, ichida qadamlar almashadi. Figma'da har bir qadam
// alohida freym qilib chizilgan, lekin hammasi bir xil 550px oynaning holati:
//
//   role      ВХОД                  75:677
//   login     ЗАКАЗЧИК              75:1133 (телефон) / 83:1269 (почта)
//   password  ВВЕДИТЕ ПАРОЛЬ        85:1660 / 85:2687
//   service   ВОЙТИ ЧЕРЕЗ           85:3045
//   register  РЕГИСТРАЦИЯ           85:3801
//   profile   ЗНАКОМСТВО            85:4848 · 85:5241 · 85:5592
//   blocked   АККАУНТ ЗАБЛОКИРОВАН  345:18815
//
// Orqaga tugmasi qadamlar tarixidan foydalanadi.
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_PROFILE = {
    firstName: '',
    lastName: '',
    company: '',
    contactName: '',
    gender: '',
    city: '',
    password: '',
    repeat: '',
}

// Tashqi qobiq: oyna yopilganda hech narsa chizilmaydi, ochilganda esa
// `key` tufayli oqim har safar toza holatdan boshlanadi.
export default function AuthModal() {
    const open = useAuthModalStore((s) => s.open)
    const startStep = useAuthModalStore((s) => s.startStep)
    const closeAuth = useAuthModalStore((s) => s.closeAuth)

    if (!open) return null

    return <AuthFlow key={startStep} startStep={startStep} onClose={closeAuth} />
}

function AuthFlow({ startStep, onClose: closeAuth }) {
    const login = useAuthStore((s) => s.login)
    const register = useAuthStore((s) => s.register)
    const chooseRole = useAuthStore((s) => s.chooseRole)
    const loading = useAuthStore((s) => s.loading)

    const router = useRouter()

    const [history, setHistory] = useState([startStep])
    const [role, setRoleState] = useState(ROLES.CLIENT)
    const [method, setMethod] = useState('phone')
    const [contact, setContact] = useState('')
    const [password, setPassword] = useState('')
    const [profileTab, setProfileTab] = useState('person')
    const [profile, setProfile] = useState(EMPTY_PROFILE)
    const [blocked, setBlocked] = useState(BLOCKED_FALLBACK)

    const step = history[history.length - 1]

    const go = useCallback((next) => setHistory((h) => [...h, next]), [])
    const back = useCallback(() => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h)), [])

    const setField = (key) => (e) => setProfile((p) => ({ ...p, [key]: e.target.value }))

    // Ijrochi uchun tablar rol turini, zakazchik uchun — jismoniy/yuridik shaxsni
    // bildiradi, shuning uchun rol o'zgarganda tab ham qayta tanlanadi.
    const profileTabs = role === ROLES.EXECUTOR ? EXECUTOR_TABS : CLIENT_TABS

    function setRole(next) {
        setRoleState(next)
        setProfileTab(next === ROLES.EXECUTOR ? 'model' : 'person')
    }

    const title = useMemo(() => {
        if (step === 'role') return 'Вход'
        if (step === 'login' || step === 'register')
            return step === 'register' ? 'Регистрация' : ROLE_TITLES[role]
        if (step === 'password') return 'Введите пароль'
        if (step === 'service') return 'Войти через'
        if (step === 'profile') return 'Знакомство'
        return 'Аккаунт заблокирован'
    }, [step, role])

    async function submitLogin() {
        const res = await login({ login: contact, password })
        if (res.success) {
            toast.success('Вы вошли в аккаунт')
            closeAuth()
            router.push(homeForRole(res.user?.role || role))
            return
        }
        if (res.blocked) {
            setBlocked({ ...BLOCKED_FALLBACK, ...(res.error?.block || {}) })
            go('blocked')
            return
        }
        toast.error('Неверный логин или пароль')
    }

    async function submitProfile() {
        if (profile.password !== profile.repeat) {
            toast.error('Пароли не совпадают')
            return
        }

        const payload = {
            role,
            login: contact,
            method,
            password: profile.password,
            city: profile.city,
            ...(role === ROLES.AGENCY
                ? { name: profile.company, contactName: profile.contactName }
                : role === ROLES.EXECUTOR
                  ? {
                        type: profileTab,
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        gender: profile.gender,
                    }
                  : profileTab === 'company'
                    ? { name: profile.company, contactName: profile.contactName }
                    : { firstName: profile.firstName, lastName: profile.lastName }),
        }

        const res = await register(payload)
        if (!res.success) {
            toast.error('Не удалось завершить регистрацию')
            return
        }

        // Rol tanlangan bo'lsa serverga alohida yuboriladi (Знакомство).
        const finalRole = role === ROLES.CLIENT && profileTab === 'company' ? ROLES.COMPANY : role
        await chooseRole(finalRole)

        toast.success('Аккаунт создан')
        closeAuth()
        router.push(homeForRole(finalRole))
    }

    function pickService(service) {
        const base = process.env.NEXT_PUBLIC_API_URL || ''
        window.location.assign(`${base}/auth/oauth/${service}/`)
    }

    return (
        <AuthShell
            title={title}
            onBack={history.length > 1 ? back : null}
            onClose={closeAuth}
        >
            {/* ── ВХОД: rol tanlash (Figma 75:681) ─────────────────────────── */}
            {step === 'role' && (
                <>
                    <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                        {ROLE_CARDS.map((card) => {
                            const on = card.key === role
                            return (
                                <button
                                    key={card.key}
                                    type="button"
                                    onClick={() => setRole(card.key)}
                                    aria-pressed={on}
                                    className={`flex w-full cursor-pointer items-center gap-[12px] rounded-[6px] p-[12px] text-left transition-colors lg:p-[16px] ${
                                        on
                                            ? 'border-2 border-gold'
                                            : 'border border-[#dfdfdf] hover:border-gold/50'
                                    }`}
                                >
                                    <Image
                                        src={card.icon}
                                        alt=""
                                        width={54}
                                        height={54}
                                        className="size-[40px] shrink-0 object-contain lg:size-[54px]"
                                    />
                                    <span className="flex min-w-0 flex-1 flex-col gap-[8px] lg:gap-[12px]">
                                        <span className="font-display text-[16px] leading-none text-black uppercase lg:text-[18px]">
                                            {card.title}
                                        </span>
                                        <span className="text-[14px] leading-[18px] text-grey lg:text-[16px] lg:leading-[20px]">
                                            {card.description}
                                        </span>
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                        <AuthButton onClick={() => go('login')}>Войти</AuthButton>
                        <AuthButton variant="secondary" onClick={() => go('register')}>
                            Зарегистрироваться
                        </AuthButton>
                    </div>
                </>
            )}

            {/* ── ЗАКАЗЧИК / РЕГИСТРАЦИЯ: telefon yoki pochta ──────────────── */}
            {(step === 'login' || step === 'register') && (
                <>
                    <AuthTabs
                        tabs={[
                            { key: 'phone', label: 'Телефон' },
                            { key: 'email', label: 'Почта' },
                        ]}
                        value={method}
                        onChange={(key) => {
                            setMethod(key)
                            setContact('')
                        }}
                    />

                    {method === 'phone' ? (
                        <AuthPhoneField
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                        />
                    ) : (
                        <AuthField
                            type="email"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="ivan@mail.ru"
                        />
                    )}

                    <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                        <AuthButton
                            onClick={() => go(step === 'login' ? 'password' : 'profile')}
                            disabled={!contact.trim()}
                        >
                            Далее
                        </AuthButton>
                        <AuthSocialBar onPick={() => go('service')} />
                    </div>
                </>
            )}

            {/* ── ВВЕДИТЕ ПАРОЛЬ (Figma 85:1660 / 85:2687) ─────────────────── */}
            {step === 'password' && (
                <>
                    <p className="text-center text-[14px] text-grey lg:text-[16px]">
                        {method === 'phone' ? 'От профиля с номером ' : 'От профиля с почтой '}
                        <span className="font-medium text-black">{contact}</span>
                    </p>

                    <AuthPasswordField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Введите пароль"
                    />

                    <AuthButton onClick={submitLogin} disabled={!password || loading}>
                        Войти
                    </AuthButton>
                </>
            )}

            {/* ── ВОЙТИ ЧЕРЕЗ (Figma 85:3139) ──────────────────────────────── */}
            {step === 'service' && (
                <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                    {SERVICES.map((service) => (
                        <button
                            key={service.key}
                            type="button"
                            onClick={() => pickService(service.key)}
                            style={{ backgroundColor: service.color }}
                            className="flex w-full cursor-pointer items-center justify-between gap-[12px] rounded-[6px] px-[16px] py-[12px] text-[14px] font-medium text-white transition-opacity hover:opacity-90 lg:px-[24px] lg:py-[16px] lg:text-[18px]"
                        >
                            {service.label}
                            <Image
                                src={service.icon}
                                alt=""
                                width={32}
                                height={32}
                                className="size-[24px] lg:size-[32px]"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* ── ЗНАКОМСТВО (Figma 85:4848 · 85:5241 · 85:5592) ───────────── */}
            {step === 'profile' && (
                <>
                    {role !== ROLES.AGENCY && (
                        <AuthTabs tabs={profileTabs} value={profileTab} onChange={setProfileTab} />
                    )}

                    <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                        {role === ROLES.AGENCY || profileTab === 'company' ? (
                            <>
                                <AuthField
                                    value={profile.company}
                                    onChange={setField('company')}
                                    placeholder={
                                        role === ROLES.AGENCY
                                            ? 'Название агентства'
                                            : 'Название компании'
                                    }
                                />
                                <AuthField
                                    value={profile.contactName}
                                    onChange={setField('contactName')}
                                    placeholder="Имя представителя"
                                />
                            </>
                        ) : (
                            <>
                                <AuthField
                                    value={profile.firstName}
                                    onChange={setField('firstName')}
                                    placeholder="Введите имя"
                                />
                                <AuthField
                                    value={profile.lastName}
                                    onChange={setField('lastName')}
                                    placeholder="Введите фамилию"
                                />
                            </>
                        )}

                        {role === ROLES.EXECUTOR && (
                            <AuthSelect
                                value={profile.gender}
                                onChange={setField('gender')}
                                options={GENDER_OPTIONS}
                            />
                        )}

                        <AuthField
                            value={profile.city}
                            onChange={setField('city')}
                            placeholder="Город"
                        />

                        <AuthPasswordField
                            value={profile.password}
                            onChange={setField('password')}
                            placeholder="Пароль"
                        />
                        <AuthPasswordField
                            value={profile.repeat}
                            onChange={setField('repeat')}
                            placeholder="Повторите пароль"
                        />
                    </div>

                    <AuthButton
                        onClick={submitProfile}
                        disabled={!profile.city.trim() || !profile.password || loading}
                    >
                        Продолжить
                    </AuthButton>
                </>
            )}

            {/* ── АККАУНТ ЗАБЛОКИРОВАН (Figma 345:18815) ───────────────────── */}
            {step === 'blocked' && (
                <>
                    <p className="text-center text-[14px] text-grey lg:text-[18px]">
                        {blocked.description}
                    </p>

                    <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                        <p className="text-[14px] text-grey lg:text-[16px]">Мера</p>
                        <p className="text-[14px] text-black lg:text-[16px]">{blocked.measure}</p>
                    </div>

                    <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                        <p className="text-[14px] text-grey lg:text-[16px]">Причина</p>
                        <p className="text-[14px] text-black lg:text-[16px]">{blocked.reason}</p>
                    </div>

                    <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                        <AuthButton
                            onClick={() => {
                                closeAuth()
                                router.push('/contacts')
                            }}
                        >
                            Связаться с поддержкой
                        </AuthButton>
                        <AuthButton variant="secondary" onClick={back}>
                            Назад
                        </AuthButton>
                    </div>
                </>
            )}
        </AuthShell>
    )
}
