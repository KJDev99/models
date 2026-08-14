'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Phone, Shield, Trash2, Upload, User, X } from 'lucide-react'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────────────────────────────────────
// «Редактировать профиль» oynasi — Figma 338:18303 (1200px keng).
//
// Chapda bo'limlar ro'yxati (Информация · Контакты · Безопасность ·
// Удаление аккаунта), o'ngda light-white panel: maydonlar oq fonda.
// Mobilda bo'limlar tepada gorizontal aylanadigan qatorga aylanadi.
// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
    { key: 'info', label: 'Информация', icon: User },
    { key: 'contacts', label: 'Контакты', icon: Phone },
    { key: 'security', label: 'Безопасность', icon: Shield },
    { key: 'delete', label: 'Удаление аккаунта', icon: Trash2 },
]

export default function AdminProfileModal({ open, onClose, title = 'Редактировать профиль', sections }) {
    const [tab, setTab] = useState('info')

    if (!open) return null

    const active = sections[tab]

    return (
        <div
            className="fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-[12px]"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                className="modal-in custom-scrollbar flex max-h-[90vh] w-full max-w-[1200px] flex-col gap-[16px] overflow-y-auto rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]"
            >
                <div className="flex items-center justify-between gap-[16px]">
                    <h2 className="text-[20px] font-medium text-black lg:text-[32px]">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Закрыть"
                        className="flex size-[24px] shrink-0 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-70 lg:size-[32px]"
                    >
                        <X size={32} strokeWidth={2} className="size-[24px] lg:size-[32px]" />
                    </button>
                </div>

                <div className="flex flex-col gap-[16px] lg:flex-row lg:items-start">
                    <div className="custom-scrollbar flex shrink-0 gap-[8px] overflow-x-auto lg:flex-col lg:gap-0">
                        {TABS.map((item) => {
                            const Icon = item.icon
                            const on = item.key === tab
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => setTab(item.key)}
                                    className={`flex cursor-pointer items-center gap-[12px] rounded-[6px] px-[16px] py-[12px] text-[14px] font-medium whitespace-nowrap transition-colors lg:px-[24px] lg:py-[16px] lg:text-[18px] ${
                                        on ? 'bg-light-white text-black' : 'text-grey hover:text-black'
                                    }`}
                                >
                                    <Icon size={24} strokeWidth={2} className="shrink-0" />
                                    {item.label}
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-[16px] rounded-[6px] bg-light-white p-[12px] lg:gap-[24px] lg:p-[24px]">
                        <div className="flex flex-col gap-[16px]">
                            <h3 className="text-[18px] font-semibold text-black lg:text-[20px]">
                                {TABS.find((t) => t.key === tab)?.label}
                            </h3>
                            {active}
                        </div>

                        <div className="flex gap-[16px]">
                            <button
                                type="button"
                                onClick={() => {
                                    onClose()
                                    toast.success('Изменения сохранены')
                                }}
                                className="min-w-0 flex-1 cursor-pointer rounded-[6px] bg-gold px-[24px] py-[12px] text-[14px] font-medium text-white transition-colors hover:bg-gold/90 lg:py-[16px] lg:text-[18px]"
                            >
                                Сохранить
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="min-w-0 flex-1 cursor-pointer rounded-[6px] bg-gold/15 px-[24px] py-[12px] text-[14px] font-medium text-gold transition-colors hover:bg-gold/25 lg:py-[16px] lg:text-[18px]"
                            >
                                Отменить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Oyna ichidagi maydon (fon light-white bo'lgani uchun boshqaruv oq).
export function ModalField({ label, hint, children }) {
    return (
        <div className="flex flex-col gap-[8px] lg:gap-[12px]">
            {label && <span className="text-[14px] text-grey lg:text-[16px]">{label}</span>}
            {hint && <span className="text-[12px] text-grey lg:text-[14px]">{hint}</span>}
            {children}
        </div>
    )
}

const MODAL_CONTROL =
    'w-full rounded-[6px] bg-white p-[12px] text-[14px] text-black outline-none placeholder:text-[#aaa] lg:p-[16px] lg:text-[16px]'

export function ModalInput({ className = '', ...props }) {
    return <input {...props} className={`${MODAL_CONTROL} ${className}`} />
}

export function ModalSelect({ options, ...props }) {
    return (
        <select {...props} className={`${MODAL_CONTROL} cursor-pointer appearance-none`}>
            {options.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
            ))}
        </select>
    )
}

export function ModalTextarea({ value, onChange, max = 600, placeholder }) {
    return (
        <div className="flex flex-col rounded-[6px] bg-white p-[12px] lg:p-[16px]">
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={max}
                rows={4}
                className="w-full resize-none bg-transparent text-[14px] leading-[22px] text-black outline-none placeholder:text-[#aaa] lg:text-[16px]"
            />
            <span className="text-right text-[12px] text-[#aaa] lg:text-[14px]">
                {value.length} / {max}
            </span>
        </div>
    )
}

// Avatar yuklash (Figma 338:18333).
export function ModalAvatar({ src, label = 'Загрузите аватарку' }) {
    return (
        <ModalField label={label}>
            <div className="flex flex-col items-start gap-[16px]">
                <span className="relative block size-[120px] overflow-hidden rounded-[6px] bg-white lg:size-[180px]">
                    {src && (
                        <Image src={src} alt="" fill sizes="180px" className="object-contain p-[12px]" />
                    )}
                </span>
                <label className="flex cursor-pointer items-center gap-[12px] rounded-[6px] bg-white px-[16px] py-[12px] text-[14px] font-medium text-grey transition-colors hover:text-black lg:px-[24px] lg:py-[16px] lg:text-[16px]">
                    <input type="file" accept="image/*" className="hidden" />
                    <Upload size={24} strokeWidth={2} className="shrink-0" />
                    Изменить фотографию
                </label>
            </div>
        </ModalField>
    )
}
