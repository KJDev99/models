'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronDown, Eye, EyeOff, X } from 'lucide-react'
import { FLAG_RU, SOCIAL_ICONS } from '@/components/auth/auth-modal/auth-modal-data'

// ─────────────────────────────────────────────────────────────────────────────
// Авторизация oynalarining umumiy qismlari.
// Figma o'lchamlari (desktop): oyna 550px, radius 6, p-24, elementlar orasi 24;
// sarlavha Helvetica Neue 36px uppercase markazda; chapda orqaga tugmasi
// (32px, gold 20%), o'ngda ✕ (32px). Mobilda: chetlaridan 12px, p-12,
// sarlavha 24px, ikonkalar 24px.
// ─────────────────────────────────────────────────────────────────────────────

// Oynaning tashqi qobig'i: fon, markazlash, Esc va fonga bosish.
export function AuthShell({ title, onBack, onClose, children }) {
    useEffect(() => {
        const { overflow } = document.body.style
        document.body.style.overflow = 'hidden'

        function onKey(e) {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', onKey)

        return () => {
            document.body.style.overflow = overflow
            document.removeEventListener('keydown', onKey)
        }
    }, [onClose])

    return (
        <div
            className="fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-[12px]"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                className="modal-in custom-scrollbar max-h-[90vh] w-full max-w-[550px] overflow-y-auto rounded-[6px] bg-white p-[12px] lg:p-[24px]"
            >
                <div className="flex flex-col gap-[16px] lg:gap-[24px]">
                    {/* Sarlavha qatori — Figma 75:1134. Yon ustunlar bir xil
                        kenglikda, shuning uchun sarlavha oyna markazida turadi va
                        ikki qatorga bo'linsa ham (Аккаунт заблокирован) buzilmaydi. */}
                    <div className="grid grid-cols-[24px_1fr_24px] items-start gap-[12px] lg:grid-cols-[32px_1fr_32px]">
                        {onBack ? (
                            <button
                                type="button"
                                onClick={onBack}
                                aria-label="Назад"
                                className="flex size-[24px] cursor-pointer items-center justify-center rounded-[6px] bg-gold/20 text-black transition-colors hover:bg-gold/35 lg:size-[32px]"
                            >
                                <ChevronLeft
                                    size={24}
                                    strokeWidth={2}
                                    className="size-[18px] lg:size-[24px]"
                                />
                            </button>
                        ) : (
                            <span aria-hidden />
                        )}

                        <h2 className="font-display text-center text-[24px] leading-[28px] text-black uppercase lg:text-[36px] lg:leading-[44px]">
                            {title}
                        </h2>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Закрыть"
                            className="flex size-[24px] cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-70 lg:size-[32px]"
                        >
                            <X size={32} strokeWidth={2} className="size-[24px] lg:size-[32px]" />
                        </button>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    )
}

// Ikki-uch bo'limli almashtirgich — light-white idish, aktivi oq (Figma 75:1270).
export function AuthTabs({ tabs, value, onChange }) {
    return (
        <div className="flex gap-[8px] rounded-[6px] bg-light-white p-[8px] lg:gap-[16px]">
            {tabs.map((tab) => {
                const on = tab.key === value
                return (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => onChange(tab.key)}
                        aria-pressed={on}
                        className={`flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-[6px] px-[12px] py-[12px] text-[14px] font-medium text-black transition-opacity lg:px-[24px] lg:py-[16px] lg:text-[18px] ${
                            on ? 'bg-white' : 'opacity-50 hover:opacity-80'
                        }`}
                    >
                        {tab.label}
                    </button>
                )
            })}
        </div>
    )
}

// Oddiy maydon — light-white fon, radius 6 (Figma 75:1283).
export function AuthField({ as: Tag = 'input', className = '', ...props }) {
    return (
        <Tag
            {...props}
            className={`w-full rounded-[6px] bg-light-white p-[12px] text-[14px] text-black outline-none placeholder:text-[#aaa] lg:p-[16px] lg:text-[16px] ${className}`}
        />
    )
}

// Parol maydoni — o'ng chekkada ko'z ikonkasi (Figma 257:5320).
export function AuthPasswordField({ value, onChange, placeholder }) {
    const [shown, setShown] = useState(false)

    return (
        <div className="relative">
            <AuthField
                type={shown ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="pr-[44px] lg:pr-[52px]"
            />
            <button
                type="button"
                onClick={() => setShown((v) => !v)}
                aria-label={shown ? 'Скрыть пароль' : 'Показать пароль'}
                className="absolute top-1/2 right-[12px] flex -translate-y-1/2 cursor-pointer items-center text-black transition-opacity hover:opacity-70 lg:right-[16px]"
            >
                {shown ? (
                    <EyeOff size={20} strokeWidth={2} />
                ) : (
                    <Eye size={20} strokeWidth={2} />
                )}
            </button>
        </div>
    )
}

// Ochiladigan ro'yxat (Знакомство — «Выберите пол», Figma 265:16512).
export function AuthSelect({ value, onChange, options }) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                aria-label={options[0]?.label}
                className={`w-full cursor-pointer appearance-none rounded-[6px] bg-light-white p-[12px] pr-[44px] text-[14px] outline-none lg:p-[16px] lg:pr-[52px] lg:text-[16px] ${
                    value ? 'text-black' : 'text-[#aaa]'
                }`}
            >
                {options.map((o) => (
                    <option key={o.value || o.label} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            <ChevronDown
                size={20}
                strokeWidth={2}
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-[12px] -translate-y-1/2 text-black lg:right-[16px]"
            />
        </div>
    )
}

// Telefon maydoni — chapda bayroq va «+ 7» (Figma 75:1286).
export function AuthPhoneField({ value, onChange }) {
    return (
        <div className="flex items-stretch gap-[12px] lg:gap-[16px]">
            <span className="flex shrink-0 items-center gap-[8px] rounded-[6px] bg-light-white p-[12px] text-[14px] text-black lg:p-[16px] lg:text-[16px]">
                <Image src={FLAG_RU} alt="" width={20} height={20} className="size-[20px]" />+ 7
            </span>
            <AuthField
                type="tel"
                inputMode="tel"
                value={value}
                onChange={onChange}
                placeholder="(000)-000-00-00"
            />
        </div>
    )
}

// Asosiy (gold) tugma — Figma 81:2565, yorug'lik chizig'i bilan.
export function AuthButton({ children, onClick, variant = 'primary', disabled, type = 'button' }) {
    const styles =
        variant === 'primary'
            ? 'bg-gold text-white hover:bg-gold/90'
            : 'bg-gold/15 text-gold hover:bg-gold/25'

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-[6px] px-[24px] py-[12px] text-[14px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 lg:py-[16px] lg:text-[18px] ${styles}`}
        >
            {variant === 'primary' && (
                <span
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-0 h-[216px] w-[34px] -translate-x-[200%] -translate-y-1/2 rotate-[50.56deg] bg-white/25 blur-[6.25px] transition-transform duration-700 ease-out group-hover:translate-x-[600%]"
                />
            )}
            <span className="relative">{children}</span>
        </button>
    )
}

// «Войти с помощью» yo'lakchasi — Figma 75:1299.
export function AuthSocialBar({ onPick }) {
    return (
        <button
            type="button"
            onClick={() => onPick()}
            className="flex w-full cursor-pointer items-center justify-center gap-[10px] rounded-[6px] bg-light-white px-[16px] py-[12px] text-[14px] font-medium text-black transition-colors hover:bg-black/8 lg:px-[24px] lg:py-[16px] lg:text-[18px]"
        >
            Войти с помощью
            <span className="flex items-center gap-[4px]">
                {SOCIAL_ICONS.map((social) => (
                    <Image
                        key={social.key}
                        src={social.icon}
                        alt={social.label}
                        width={32}
                        height={32}
                        className="size-[24px] lg:size-[32px]"
                    />
                ))}
            </span>
        </button>
    )
}
