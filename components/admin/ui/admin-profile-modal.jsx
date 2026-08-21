'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, Phone, Shield, Trash2, Upload, User, X } from 'lucide-react'
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

// `children` — oyna ustida ochiladigan qo'shimcha oynalar uchun
// («Заказчик» kabinetidagi «Безопасность» bo'limi, Figma 260:7888 va h.k.).
//
// `tabs` — chapdagi bo'limlar ro'yxatini almashtiradi («Исполнитель»
// kabinetida uchta bo'lim, Figma 334:14242).
// `hideActionsFor` — pastdagi «Сохранить / Отменить» juftligi chiqmaydigan
// bo'limlar (Figma 334:14255 — «Видимость профиля»da ular yo'q).
export default function AdminProfileModal({
    open,
    onClose,
    title = 'Редактировать профиль',
    tabs = TABS,
    sections,
    hideActionsFor = [],
    // `onSave` berilsa — «Сохранить» serverga yozadi va faqat muvaffaqiyatda
    // yopiladi. Berilmasa — eski xatti-harakat (shunchaki yopish).
    onSave,
    saving = false,
    children,
}) {
    const [tab, setTab] = useState(tabs[0].key)
    // Mobil ro'yxat ochiqmi (desktopda bo'limlar doim ko'rinadi).
    const [listOpen, setListOpen] = useState(false)

    if (!open) return null

    const active = sections[tab]
    const current = tabs.find((t) => t.key === tab)
    const showActions = !hideActionsFor.includes(tab)

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
                    {/* Mobilda bo'limlar ochiladigan ro'yxatga aylanadi
                        (Figma 434:16929 — light-white qator va chevron). */}
                    <div className="relative shrink-0 lg:hidden">
                        <button
                            type="button"
                            onClick={() => setListOpen((v) => !v)}
                            aria-expanded={listOpen}
                            className="flex w-full cursor-pointer items-center justify-between gap-[12px] rounded-[6px] bg-light-white px-[12px] py-[12px] text-[14px] font-medium text-black"
                        >
                            <span className="flex items-center gap-[12px]">
                                {current?.icon && (
                                    <current.icon size={20} strokeWidth={2} className="shrink-0" />
                                )}
                                {current?.label}
                            </span>
                            <ChevronDown
                                size={20}
                                strokeWidth={2}
                                className={`shrink-0 transition-transform duration-200 ${
                                    listOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {listOpen && (
                            <div className="menu-in absolute top-full right-0 left-0 z-10 mt-[8px] flex flex-col overflow-hidden rounded-[6px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
                                {tabs.map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <button
                                            key={item.key}
                                            type="button"
                                            onClick={() => {
                                                setTab(item.key)
                                                setListOpen(false)
                                            }}
                                            className={`flex cursor-pointer items-center gap-[12px] px-[12px] py-[12px] text-left text-[14px] font-medium transition-colors ${
                                                item.key === tab
                                                    ? 'bg-light-white text-black'
                                                    : 'text-grey hover:bg-light-white hover:text-black'
                                            }`}
                                        >
                                            <Icon size={20} strokeWidth={2} className="shrink-0" />
                                            {item.label}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    <div className="hidden shrink-0 flex-col lg:flex">
                        {tabs.map((item) => {
                            const Icon = item.icon
                            const on = item.key === tab
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => setTab(item.key)}
                                    className={`flex cursor-pointer items-center gap-[12px] rounded-[6px] px-[24px] py-[16px] text-[18px] font-medium whitespace-nowrap transition-colors ${
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
                                {tabs.find((t) => t.key === tab)?.label}
                            </h3>
                            {active}
                        </div>

                        {showActions && (
                            <div className="flex gap-[16px]">
                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={async () => {
                                        if (onSave) {
                                            await onSave()
                                            return
                                        }
                                        onClose()
                                        toast.success('Изменения сохранены')
                                    }}
                                    className="ui-shine relative min-w-0 flex-1 cursor-pointer overflow-hidden rounded-[6px] bg-gold px-[24px] py-[12px] text-[14px] font-medium text-white transition-colors hover:bg-[#c19754] disabled:opacity-60 lg:py-[16px] lg:text-[18px]"
                                >
                                    <span className="relative">
                                        {saving ? 'Сохраняем…' : 'Сохранить'}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="min-w-0 flex-1 cursor-pointer rounded-[6px] bg-gold/15 px-[24px] py-[12px] text-[14px] font-medium text-gold transition-colors hover:bg-gold/25 lg:py-[16px] lg:text-[18px]"
                                >
                                    Отменить
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {children}
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
// `onPick(file)` — fayl tanlanganda chaqiriladi (yuklash chaqiruv joyida).
export function ModalAvatar({ src, label = 'Загрузите аватарку', onPick }) {
    return (
        <ModalField label={label}>
            <div className="flex flex-col items-start gap-[16px]">
                <span className="relative block size-[120px] overflow-hidden rounded-[6px] bg-white lg:size-[180px]">
                    {src && (
                        <Image src={src} alt="" fill sizes="180px" className="object-contain p-[12px]" />
                    )}
                </span>
                <label className="flex cursor-pointer items-center gap-[12px] rounded-[6px] bg-white px-[16px] py-[12px] text-[14px] font-medium text-grey transition-colors hover:text-black lg:px-[24px] lg:py-[16px] lg:text-[16px]">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            e.target.value = ''
                            if (file) onPick?.(file)
                        }}
                    />
                    <Upload size={24} strokeWidth={2} className="shrink-0" />
                    Изменить фотографию
                </label>
            </div>
        </ModalField>
    )
}
