'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import { useAction } from '@/lib/use-api'
import { useAuth } from '@/lib/use-auth'
import { securityApi } from '@/components/shared/cabinet/security-actions'

// ─────────────────────────────────────────────────────────────────────────────
// «Безопасность» bo'limidagi kichik oynalar — Figma:
//   Изменить пароль        260:7888  / mobil 394:22656
//   Изменить почту         260:8454  / mobil 394:22746
//   Подтвердите почту      260:8937  / mobil 394:22863
//   Почта подтверждена     260:9420  / mobil 394:22955
//   Изменение номера       260:9904  / mobil 400:23015
//   Удалить аккаунт?       270:24791 / mobil 400:23084
//
// Hammasi «Редактировать профиль» oynasining ustida ochiladi: 630px keng,
// markazda, sarlavha o'rtada, ostida maydonlar va ikkita tugma.
//
// Endpointlar rolga qarab tanlanadi — `security-actions.js`.
// ─────────────────────────────────────────────────────────────────────────────

export function SmallModal({ open, onClose, title, children }) {
    if (!open) return null

    return (
        <div
            className="fade-in fixed inset-0 z-[110] flex items-center justify-center bg-black/25 p-[12px]"
            // Oyna «Редактировать профиль» ichida turadi — bosish ostidagi
            // oynani ham yopib yubormasligi kerak.
            onClick={(e) => {
                e.stopPropagation()
                onClose()
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                className="modal-in flex w-full max-w-[630px] flex-col gap-[16px] rounded-[6px] bg-white p-[16px] lg:gap-[24px] lg:p-[24px]"
            >
                <div className="flex items-start gap-[12px]">
                    <h3 className="min-w-0 flex-1 text-center text-[18px] font-medium text-black lg:text-[20px]">
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Закрыть"
                        className="shrink-0 cursor-pointer text-black transition-opacity hover:opacity-70"
                    >
                        <X size={20} strokeWidth={2} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

export function SmallField({ label, ...props }) {
    return (
        <label className="flex flex-col gap-[8px] lg:gap-[12px]">
            <span className="text-[14px] text-grey lg:text-[16px]">{label}</span>
            <input
                {...props}
                className="w-full rounded-[6px] bg-light-white p-[12px] text-[14px] text-black outline-none placeholder:text-[#aaa] lg:p-[16px] lg:text-[16px]"
            />
        </label>
    )
}

export function SmallText({ children }) {
    return (
        <p className="text-[12px] leading-[18px] text-grey lg:text-[14px] lg:leading-[20px]">
            {children}
        </p>
    )
}

// Xato matni — backend `error.message` ni ruscha beradi.
export function SmallError({ children }) {
    if (!children) return null
    return (
        <p role="alert" className="text-[12px] text-danger lg:text-[14px]">
            {children}
        </p>
    )
}

export function SmallActions({ primary, secondary }) {
    return (
        <div className="flex flex-col gap-[12px] lg:flex-row lg:gap-[16px]">
            <button
                type="button"
                onClick={primary.onClick}
                disabled={primary.disabled}
                className="ui-shine relative min-w-0 flex-1 cursor-pointer overflow-hidden rounded-[6px] bg-gold px-[24px] py-[12px] text-[14px] font-medium text-white transition-colors hover:bg-[#c19754] disabled:cursor-not-allowed disabled:opacity-50 lg:py-[16px] lg:text-[16px]"
            >
                <span className="relative">{primary.label}</span>
            </button>
            {secondary && (
                <button
                    type="button"
                    onClick={secondary.onClick}
                    className="min-w-0 flex-1 cursor-pointer rounded-[6px] bg-[#f7f2e9] px-[24px] py-[12px] text-[14px] font-medium text-gold transition-colors hover:bg-[#f1e8d8] lg:py-[16px] lg:text-[16px]"
                >
                    {secondary.label}
                </button>
            )}
        </div>
    )
}

// ── Konkret oynalar ──────────────────────────────────────────────────────────

// Изменить пароль (260:7888)
//
// Backend uch maydon so'raydi: joriy parol, yangi parol, takror. Muvaffaqiyatdan
// keyin refresh tokenlar bekor qilinadi — foydalanuvchi qayta kirishi kerak.
export function PasswordModal({ open, onClose, onDone }) {
    const { role } = useAuth()
    const api = securityApi(role)

    const [current, setCurrent] = useState('')
    const [next, setNext] = useState('')
    const [repeat, setRepeat] = useState('')
    const [error, setError] = useState(null)

    const change = useAction(api.changePassword || noop)

    async function submit() {
        setError(null)
        if (next !== repeat) {
            setError('Пароли не совпадают')
            return
        }
        const res = await change.run({
            currentPassword: current,
            newPassword: next,
            repeatPassword: repeat,
        })
        if (!res.success) {
            setError(res.error.message)
            return
        }
        setCurrent('')
        setNext('')
        setRepeat('')
        onDone()
    }

    return (
        <SmallModal open={open} onClose={onClose} title="Изменить пароль">
            <SmallField
                label="Текущий пароль"
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="Введите текущий пароль"
            />
            <SmallField
                label="Пароль"
                type="password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                placeholder="Введите пароль"
            />
            <SmallField
                label="Повторите пароль"
                type="password"
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                placeholder="Введите повторный пароль"
            />
            <SmallError>{error}</SmallError>
            <SmallActions
                primary={{
                    label: 'Изменить',
                    onClick: submit,
                    disabled: !current || !next || change.loading,
                }}
                secondary={{ label: 'Отменить', onClick: onClose }}
            />
        </SmallModal>
    )
}

// Изменить почту (260:8454) → Подтвердите почту (260:8937)
//
// Заказчик: POST /customer/settings/email → xat yuboriladi, tasdiq havola orqali.
// Исполнитель: PATCH /performer/settings/email — bir qadamda o'zgaradi.
export function EmailModal({ open, onClose }) {
    const { role } = useAuth()
    const api = securityApi(role)
    const twoStep = Boolean(api.resendEmail)

    const [stage, setStage] = useState('form')
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)

    const change = useAction(api.changeEmail || noop)
    const resend = useAction(api.resendEmail || noop)

    function close() {
        setStage('form')
        setEmail('')
        setError(null)
        onClose()
    }

    async function submit() {
        setError(null)
        const res = await change.run(email)
        if (!res.success) {
            setError(res.error.message)
            return
        }
        if (twoStep) {
            setStage('sent')
            return
        }
        toast.success('Почта изменена')
        close()
    }

    async function resendLetter() {
        const res = await resend.run()
        if (res.success) toast.success('Письмо отправлено')
        else toast.error(res.error.message)
    }

    if (stage === 'sent') {
        return (
            <SmallModal open={open} onClose={close} title="Подтвердите почту">
                <SmallText>
                    Мы отправили письмо с подтверждением на указанный адрес. Перейдите по ссылке в
                    письме, чтобы подтвердить электронную почту.
                </SmallText>
                <SmallActions
                    primary={{ label: 'Хорошо', onClick: close }}
                    secondary={{ label: 'Отправить письмо повторно', onClick: resendLetter }}
                />
            </SmallModal>
        )
    }

    return (
        <SmallModal open={open} onClose={close} title="Изменить почту">
            <SmallField
                label="Электронная почта"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите почту"
            />
            <SmallError>{error}</SmallError>
            <SmallActions
                primary={{ label: 'Изменить', onClick: submit, disabled: !email || change.loading }}
                secondary={{ label: 'Отменить', onClick: close }}
            />
        </SmallModal>
    )
}

// Изменение номера телефона (260:9904)
//
// Заказчик: PATCH /customer/settings/phone → SMS kodi, keyin
// POST /customer/settings/phone/confirm. Исполнитель: bir qadamda.
export function PhoneModal({ open, onClose, onDone }) {
    const { role } = useAuth()
    const api = securityApi(role)
    const twoStep = Boolean(api.confirmPhone)

    const [stage, setStage] = useState('form')
    const [phone, setPhone] = useState('')
    const [code, setCode] = useState('')
    const [error, setError] = useState(null)

    const change = useAction(api.changePhone || noop)
    const confirm = useAction(api.confirmPhone || noop)

    function close() {
        setStage('form')
        setPhone('')
        setCode('')
        setError(null)
        onClose()
    }

    async function submit() {
        setError(null)
        const res = await change.run(phone)
        if (!res.success) {
            setError(res.error.message)
            return
        }
        if (twoStep) {
            setStage('code')
            return
        }
        onDone()
    }

    async function submitCode() {
        setError(null)
        const res = await confirm.run(code)
        if (!res.success) {
            setError(res.error.message)
            return
        }
        close()
        onDone()
    }

    if (stage === 'code') {
        return (
            <SmallModal open={open} onClose={close} title="Подтвердите номер">
                <SmallText>Мы отправили код подтверждения на указанный номер.</SmallText>
                <SmallField
                    label="Код из СМС"
                    inputMode="numeric"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="0000"
                />
                <SmallError>{error}</SmallError>
                <SmallActions
                    primary={{
                        label: 'Подтвердить',
                        onClick: submitCode,
                        disabled: !code || confirm.loading,
                    }}
                    secondary={{ label: 'Отменить', onClick: close }}
                />
            </SmallModal>
        )
    }

    return (
        <SmallModal open={open} onClose={close} title="Изменение номера телефона">
            <SmallField
                label="Телефон"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+ 7 (000)-000-00-00"
            />
            <SmallError>{error}</SmallError>
            <SmallActions
                primary={{ label: 'Изменить', onClick: submit, disabled: !phone || change.loading }}
                secondary={{ label: 'Отменить', onClick: close }}
            />
        </SmallModal>
    )
}

// Удалить аккаунт? (270:24791)
export function DeleteAccountModal({ open, onClose, onConfirm }) {
    const { role } = useAuth()
    const api = securityApi(role)
    const remove = useAction(api.deleteAccount || noop)

    async function submit() {
        const res = await remove.run()
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        onConfirm()
    }

    return (
        <SmallModal open={open} onClose={onClose} title="Удалить аккаунт?">
            <SmallText>
                Аккаунт будет удалён вместе с проектами, площадками и перепиской. Восстановить
                данные после удаления невозможно.
            </SmallText>
            <SmallActions
                primary={{ label: 'Удалить', onClick: submit, disabled: remove.loading }}
                secondary={{ label: 'Отменить', onClick: onClose }}
            />
        </SmallModal>
    )
}

// Rol uchun endpoint yo'q bo'lsa (masalan agentlikda pochta) — bo'sh amal.
async function noop() {}
