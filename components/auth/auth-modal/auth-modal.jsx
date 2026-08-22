'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAuthModalStore } from '@/store/useAuthModalStore'
import { useAuthStore } from '@/store/useAuthStore'
import { ROLES, homeForRole } from '@/lib/roles'
import { ERROR_CODES } from '@/lib/api-error'
import { popReturnUrl } from '@/lib/auth'
import { oauthStartUrl } from '@/lib/api/auth'
import {
    AuthButton,
    AuthError,
    AuthField,
    AuthFieldError,
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
// Backend oqimi (backend/auth.md): «Далее» → POST /auth/identify → challenge
// token; keyin login bo'lsa /auth/login, register bo'lsa /auth/register/{kind}.
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
    const identify = useAuthStore((s) => s.identify)
    const login = useAuthStore((s) => s.login)
    const register = useAuthStore((s) => s.register)
    const resetFlow = useAuthStore((s) => s.resetFlow)
    const loading = useAuthStore((s) => s.loading)
    const displayIdentifier = useAuthStore((s) => s.displayIdentifier)

    const router = useRouter()

    const [history, setHistory] = useState([startStep])
    const [role, setRoleState] = useState(ROLES.CLIENT)
    const [method, setMethod] = useState('phone')
    const [contact, setContact] = useState('')
    const [password, setPassword] = useState('')
    const [profileTab, setProfileTab] = useState('person')
    const [profile, setProfile] = useState(EMPTY_PROFILE)
    const [blocked, setBlocked] = useState(BLOCKED_FALLBACK)
    const [error, setError] = useState(null)

    const step = history[history.length - 1]

    // Oyna yopilganda oqim holati (challenge token) tozalanadi.
    useEffect(() => () => resetFlow(), [resetFlow])

    const go = useCallback((next) => {
        setError(null)
        setHistory((h) => [...h, next])
    }, [])
    const back = useCallback(() => {
        setError(null)
        setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h))
    }, [])

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

    // Backend telefonni maskada ham qabul qiladi; «+ 7» prefiksi UI'da alohida.
    function identifierValue() {
        return method === 'phone' ? `+7 ${contact}`.trim() : contact.trim()
    }

    function showBlocked(apiError) {
        const d = apiError.details || {}
        setBlocked({
            description: apiError.message || BLOCKED_FALLBACK.description,
            measure: d.measure || BLOCKED_FALLBACK.measure,
            reason: d.reason || BLOCKED_FALLBACK.reason,
            title: d.title,
            blockedUntil: d.blocked_until,
        })
        go('blocked')
    }

    // ── «Далее» — identify ──────────────────────────────────────────────────
    async function submitIdentify(intent) {
        setError(null)
        const res = await identify({
            role,
            intent,
            identifierType: method,
            value: identifierValue(),
        })

        if (res.success) {
            // Backend keyingi qadamni o'zi aytadi (password | register).
            go(res.data.next_step === 'password' ? 'password' : 'profile')
            return
        }

        const { code, message } = res.error
        if (code === ERROR_CODES.ACCOUNT_BLOCKED) {
            showBlocked(res.error)
            return
        }
        // Login'da profil topilmasa — ro'yxatdan o'tishga yo'naltiramiz.
        if (code === ERROR_CODES.USER_NOT_FOUND) {
            setError('Профиль не найден. Зарегистрируйтесь.')
            return
        }
        if (code === ERROR_CODES.USER_ALREADY_EXISTS) {
            setError('Профиль уже зарегистрирован. Войдите в аккаунт.')
            return
        }
        setError(message)
    }

    // ── «Войти» — parol ─────────────────────────────────────────────────────
    async function submitLogin() {
        setError(null)
        const res = await login(password)

        if (res.success) {
            toast.success('Вы вошли в аккаунт')
            closeAuth()
            router.push(popReturnUrl() || homeForRole(res.user?.role))
            return
        }

        const { code, message } = res.error
        if (code === ERROR_CODES.ACCOUNT_BLOCKED) {
            showBlocked(res.error)
            return
        }
        // Challenge muddati tugagan — telefon/pochta oynasiga qaytaramiz.
        if (code === ERROR_CODES.CHALLENGE_EXPIRED) {
            toast.error(message)
            back()
            return
        }
        setError(message)
    }

    // ── «Продолжить» — ro'yxatdan o'tish ────────────────────────────────────
    async function submitProfile() {
        setError(null)
        if (profile.password !== profile.repeat) {
            setError('Пароли не совпадают')
            return
        }

        const common = {
            city: profile.city,
            password: profile.password,
            password_confirm: profile.repeat,
        }

        let kind = 'customer'
        let payload

        if (role === ROLES.AGENCY) {
            kind = 'agency'
            payload = {
                ...common,
                agency_name: profile.company,
                representative_name: profile.contactName,
            }
        } else if (role === ROLES.EXECUTOR) {
            kind = 'performer'
            payload = {
                ...common,
                performer_specialty: profileTab,
                first_name: profile.firstName,
                last_name: profile.lastName,
                gender: profile.gender || 'not_specified',
            }
        } else if (profileTab === 'company') {
            payload = {
                ...common,
                customer_type: 'company',
                company_name: profile.company,
                // Vakil ismi uchun alohida maydon (backend javobi, 9-band).
                // `first_name` ham beriladi — eski mijozlar uchun moslik.
                representative_name: profile.contactName,
                first_name: profile.contactName,
            }
        } else {
            payload = {
                ...common,
                customer_type: 'individual',
                first_name: profile.firstName,
                last_name: profile.lastName,
            }
        }

        const res = await register(kind, payload)
        if (!res.success) {
            setError(res.error.message)
            return
        }

        toast.success('Аккаунт создан')
        closeAuth()
        router.push(popReturnUrl() || homeForRole(res.user?.role))
    }

    // OAuth — brauzer backend start manziliga o'tadi, qaytishda
    // /auth/oauth/success sahifasi tokenlarni oladi.
    function pickService(service) {
        window.location.assign(
            oauthStartUrl(service, {
                role: role === ROLES.EXECUTOR ? 'performer' : role === ROLES.AGENCY ? 'agency' : 'customer',
                intent: step === 'register' || history.includes('register') ? 'register' : 'login',
            }),
        )
    }

    const fieldErrors = useAuthStore.getState().error?.fields || {}

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
                            setError(null)
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

                    <AuthFieldError>{fieldErrors.phone || fieldErrors.email}</AuthFieldError>
                    <AuthError>{error}</AuthError>

                    <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                        <AuthButton
                            onClick={() => submitIdentify(step === 'login' ? 'login' : 'register')}
                            disabled={!contact.trim() || loading}
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
                        <span className="font-medium text-black">
                            {displayIdentifier || identifierValue()}
                        </span>
                    </p>

                    <AuthPasswordField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Введите пароль"
                    />

                    <AuthError>{error}</AuthError>

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
                                <AuthFieldError>
                                    {fieldErrors.agency_name || fieldErrors.company_name}
                                </AuthFieldError>
                                <AuthField
                                    value={profile.contactName}
                                    onChange={setField('contactName')}
                                    placeholder="Имя представителя"
                                />
                                <AuthFieldError>{fieldErrors.representative_name}</AuthFieldError>
                            </>
                        ) : (
                            <>
                                <AuthField
                                    value={profile.firstName}
                                    onChange={setField('firstName')}
                                    placeholder="Введите имя"
                                />
                                <AuthFieldError>{fieldErrors.first_name}</AuthFieldError>
                                <AuthField
                                    value={profile.lastName}
                                    onChange={setField('lastName')}
                                    placeholder="Введите фамилию"
                                />
                                <AuthFieldError>{fieldErrors.last_name}</AuthFieldError>
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
                        <AuthFieldError>{fieldErrors.city}</AuthFieldError>

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
                        <AuthFieldError>
                            {fieldErrors.password || fieldErrors.password_confirm}
                        </AuthFieldError>
                    </div>

                    <AuthError>{error}</AuthError>

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
