'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, X } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Adminka formalarining umumiy qismlari — Figma «Создать исполнителя» 335:14800.
//
// Maydon: tepasida 16px kulrang nom, ostida light-white idish (p-16, radius 6).
// Bo'lim: oq kartochka p-24, tepasida 44px oltin doiradagi tartib raqami va
// 18px semibold sarlavha. Mobilda barcha o'lchamlar 12/14px ga tushadi.
// ─────────────────────────────────────────────────────────────────────────────

// Non (breadcrumb) — «Административная панель > …» (Figma 335:14805).
export function AdminBreadcrumb({ items }) {
    return (
        <nav className="flex flex-wrap items-center gap-[12px] text-[14px] text-grey lg:text-[16px]">
            {items.map((item, i) => (
                <React.Fragment key={item.label}>
                    {i > 0 && <span aria-hidden>&gt;</span>}
                    {item.href ? (
                        <Link href={item.href} className="transition-colors hover:text-black">
                            {item.label}
                        </Link>
                    ) : (
                        <span>{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    )
}

// Forma sahifasining sarlavhasi va izohi (Figma 335:14813).
export function AdminFormHeader({ title, description }) {
    return (
        <div className="flex flex-col gap-[12px] lg:gap-[16px]">
            <h1 className="text-[24px] font-medium text-black lg:text-[32px]">{title}</h1>
            {description && (
                <p className="text-[14px] leading-[20px] text-grey lg:text-[18px] lg:leading-[24px]">
                    {description}
                </p>
            )}
        </div>
    )
}

// Raqamlangan bo'lim (Figma 335:14816).
export function AdminFormSection({ step, title, description, children }) {
    return (
        <section className="flex flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
            <div className="flex items-center gap-[12px] lg:gap-[16px]">
                <span className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-gold text-[16px] font-semibold text-white lg:size-[44px] lg:text-[18px]">
                    {step}
                </span>
                <h2 className="text-[16px] font-semibold text-black lg:text-[18px]">{title}</h2>
            </div>
            {description && (
                <p className="text-[14px] leading-[20px] text-grey lg:text-[18px] lg:leading-[24px]">
                    {description}
                </p>
            )}
            {children}
        </section>
    )
}

// Maydonlar ustuni.
export function AdminFieldGroup({ children, className = '' }) {
    return <div className={`flex flex-col gap-[16px] ${className}`}>{children}</div>
}

// Yonma-yon ikki maydon (mobilda ustma-ust).
export function AdminFieldRow({ children }) {
    return <div className="flex flex-col gap-[16px] lg:flex-row lg:items-start">{children}</div>
}

// Nom + boshqaruv elementi.
export function AdminField({ label, hint, children, className = '' }) {
    return (
        <div className={`flex min-w-0 flex-1 flex-col gap-[8px] lg:gap-[12px] ${className}`}>
            {label && <span className="text-[14px] text-grey lg:text-[16px]">{label}</span>}
            {hint && <span className="text-[12px] text-grey lg:text-[14px]">{hint}</span>}
            {children}
        </div>
    )
}

const CONTROL =
    'w-full rounded-[6px] bg-light-white p-[12px] text-[14px] text-black outline-none placeholder:text-[#aaa] lg:p-[16px] lg:text-[16px]'

export function AdminInput({ className = '', ...props }) {
    return <input {...props} className={`${CONTROL} ${className}`} />
}

// Belgilar hisoblagichi bilan matn maydoni (Figma 335:14845).
export function AdminTextarea({ value, onChange, placeholder, max = 1000, rows = 3 }) {
    return (
        <div className="flex flex-col rounded-[6px] bg-light-white p-[12px] lg:p-[16px]">
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                maxLength={max}
                className="w-full resize-none bg-transparent text-[14px] text-black outline-none placeholder:text-[#aaa] lg:text-[16px]"
            />
            <span className="text-right text-[12px] text-[#aaa] lg:text-[14px]">
                {value.length} / {max}
            </span>
        </div>
    )
}

export function AdminFormSelect({ value, onChange, options, className = '' }) {
    return (
        <div className={`relative w-full ${className}`}>
            <select
                value={value}
                onChange={onChange}
                className={`${CONTROL} cursor-pointer appearance-none pr-[44px] lg:pr-[52px]`}
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            <ChevronDown
                size={24}
                strokeWidth={2}
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-[12px] -translate-y-1/2 text-black lg:right-[16px]"
            />
        </div>
    )
}

// Bo'limlar almashtirgichi — light-white idish, aktivi oq (Figma 335:14822).
export function AdminFormTabs({ tabs, value, onChange }) {
    return (
        <div className="flex gap-[8px] rounded-[6px] bg-light-white p-[8px] lg:gap-[16px]">
            {tabs.map((tab) => {
                const on = tab.value === value
                return (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => onChange(tab.value)}
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

// Teglar maydoni: kiritish + «Добавить», ostida o'chiriladigan yorliqlar
// (Figma 335:14851 / 335:14857).
export function AdminTagInput({ tags, onChange, placeholder, max = 5, addLabel = 'Добавить' }) {
    const [draft, setDraft] = useState('')

    function add() {
        const value = draft.trim()
        if (!value || tags.length >= max || tags.includes(value)) return
        onChange([...tags, value])
        setDraft('')
    }

    return (
        <div className="flex flex-col gap-[16px]">
            <div className="flex flex-col gap-[12px] lg:flex-row lg:items-start lg:gap-[16px]">
                <AdminInput
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault()
                            add()
                        }
                    }}
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={add}
                    className="cursor-pointer rounded-[6px] bg-gold p-[12px] text-[14px] font-medium text-white transition-colors hover:bg-gold/90 lg:w-[172px] lg:shrink-0 lg:p-[16px] lg:text-[16px]"
                >
                    {addLabel}
                </button>
            </div>

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-[12px] lg:gap-[16px]">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="flex items-center gap-[8px] rounded-[6px] bg-light-white px-[12px] py-[8px] text-[14px] font-medium text-grey lg:gap-[12px] lg:text-[16px]"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => onChange(tags.filter((t) => t !== tag))}
                                aria-label={`Убрать «${tag}»`}
                                className="cursor-pointer text-grey transition-colors hover:text-black"
                            >
                                <X size={20} strokeWidth={2} className="lg:size-[24px]" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}

// Ichki qo'shimcha tugma («Добавить стоимость», Figma 335:14975).
export function AdminAddButton({ children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="cursor-pointer self-start rounded-[6px] bg-gold p-[12px] text-[14px] font-medium text-white transition-colors hover:bg-gold/90 lg:p-[16px] lg:text-[16px]"
        >
            {children}
        </button>
    )
}

// O'ng ustundagi qadamlar ro'yxati va «Далее» tugmasi (Figma 335:14978).
export function AdminFormSteps({ title, steps, current, onSubmit, submitLabel = 'Далее' }) {
    return (
        <aside className="flex w-full flex-col gap-[24px] rounded-[6px] bg-white p-[12px] lg:w-[412px] lg:shrink-0 lg:p-[24px]">
            <p className="text-[14px] leading-[20px] text-grey lg:text-[18px] lg:leading-[24px]">
                {title}
            </p>

            {/* Nuqtalarni bog'lovchi chiziq — Figma 335:14980. */}
            <div className="relative flex flex-col gap-[24px]">
                <span
                    aria-hidden
                    className="absolute top-[10px] bottom-[10px] left-[9px] w-px bg-[#d9d9d9]"
                />
                {steps.map((step, i) => (
                    <div key={step} className="relative flex items-center gap-[12px]">
                        <span
                            className={`size-[20px] shrink-0 rounded-full border-[1.5px] bg-white ${
                                i === current ? 'border-gold' : 'border-[#d9d9d9]'
                            }`}
                        />
                        <span className="text-[14px] font-medium text-black lg:text-[16px]">
                            {step}
                        </span>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={onSubmit}
                className="group relative w-full cursor-pointer overflow-hidden rounded-[6px] bg-gold px-[24px] py-[12px] text-[14px] font-medium text-white transition-colors hover:bg-gold/90 lg:py-[16px] lg:text-[18px]"
            >
                <span
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-0 h-[216px] w-[34px] -translate-x-[200%] -translate-y-1/2 rotate-[50.56deg] bg-white/25 blur-[6.25px] transition-transform duration-700 ease-out group-hover:translate-x-[600%]"
                />
                <span className="relative">{submitLabel}</span>
            </button>
        </aside>
    )
}

// Forma sahifasining ikki ustunli karkasi (Figma 335:14811).
export function AdminFormLayout({ children, aside }) {
    return (
        <div className="flex flex-col gap-[16px] lg:flex-row lg:items-start lg:gap-[24px]">
            <div className="flex min-w-0 flex-1 flex-col gap-[16px] lg:gap-[24px]">{children}</div>
            {aside}
        </div>
    )
}
