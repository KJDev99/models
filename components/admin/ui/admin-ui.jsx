'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, MoreVertical, Search } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Adminkaning takrorlanuvchi elementlari — Figma «Дашборд» 321:12629 va
// undan keyingi barcha bo'limlarda bir xil ishlatiladi.
// Desktop / mobil o'lchamlari Figma'dan aynan olingan.
// ─────────────────────────────────────────────────────────────────────────────

// Sahifa sarlavhasi (Figma 321:12977 / 438:18909).
export function AdminTitle({ children, action }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-[12px]">
            <h1 className="font-display text-[24px] leading-normal tracking-[0.48px] text-black uppercase lg:text-[32px] lg:tracking-[0.64px]">
                {children}
            </h1>
            {action}
        </div>
    )
}

// Oq kartochka (Figma 321:12949) — ichida sarlavha va ixtiyoriy o'ng tugma.
export function AdminCard({ title, action, className = '', children }) {
    return (
        <section
            className={`flex flex-col gap-[12px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px] ${className}`}
        >
            {(title || action) && (
                <div className="flex items-start justify-between gap-[12px] lg:items-center">
                    {title && (
                        <h2 className="font-display min-w-0 flex-1 text-[18px] leading-[20px] tracking-[0.36px] text-black uppercase lg:font-sans lg:text-[24px] lg:leading-normal lg:font-medium lg:tracking-normal lg:normal-case">
                            {title}
                        </h2>
                    )}
                    {action}
                </div>
            )}
            {children}
        </section>
    )
}

// Ro'yxat sahifasining kartochkasi — sarlavha va tugma kartochka ichida turadi
// (Figma «Исполнители» 321:13196).
export function AdminListCard({ title, action, toolbar, children }) {
    return (
        <section className="flex flex-col gap-[12px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
            <div className="flex flex-col gap-[12px] lg:gap-[24px]">
                <div className="flex flex-wrap items-center justify-between gap-[12px]">
                    <h1 className="font-display text-[24px] leading-normal tracking-[0.48px] text-black uppercase lg:text-[32px] lg:tracking-[0.64px]">
                        {title}
                    </h1>
                    {action}
                </div>
                {toolbar && (
                    <div className="flex flex-col gap-[12px] lg:flex-row lg:items-center lg:gap-[16px]">
                        {toolbar}
                    </div>
                )}
            </div>
            {children}
        </section>
    )
}

// Oltin tugma: mobilda faqat strelkali kvadrat, desktopda matn + strelka
// (Figma 321:13137 / 440:19162).
export function AdminGoldLink({ href, children }) {
    return (
        <Link
            href={href}
            className="ui-shine flex size-[32px] shrink-0 cursor-pointer items-center justify-center gap-[12px] rounded-[6px] bg-gold p-[8px] text-[16px] font-medium text-white transition-colors hover:bg-[#c19754] lg:size-auto lg:px-[16px] lg:py-[12px]"
        >
            <span className="hidden lg:inline">{children}</span>
            <ArrowUpRight size={24} strokeWidth={2} className="size-[16px] lg:size-[24px]" />
        </Link>
    )
}

// Oltin tugma — bosiladigan (modal ochadi). Figma'da bir xil ko'rinish.
export function AdminButton({ children, onClick, variant = 'gold', icon: Icon, type = 'button' }) {
    const styles = {
        gold: 'bg-gold text-white hover:bg-[#c19754]',
        light: 'bg-light-white text-black hover:bg-black/8',
        danger: 'bg-[#fdecec] text-[#e53b35] hover:bg-[#fbdcdc]',
        stroke: 'border border-black/15 text-black hover:bg-black/5',
    }[variant]

    return (
        <button
            type={type}
            onClick={onClick}
            className={`flex cursor-pointer items-center justify-center gap-[8px] rounded-[6px] px-[12px] py-[8px] text-[14px] font-medium transition-colors lg:gap-[12px] lg:px-[16px] lg:py-[12px] lg:text-[16px] ${
                variant === 'gold' ? 'ui-shine' : ''
            } ${styles}`}
        >
            {Icon && <Icon size={20} strokeWidth={2} className="shrink-0" />}
            {children}
        </button>
    )
}

// Statistika plitkalari (Figma 321:12661 / 440:19290).
export function AdminStats({ items }) {
    return (
        <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4 lg:gap-[16px]">
            {items.map((item) => (
                <div
                    key={item.label}
                    className="flex flex-col gap-[12px] rounded-[6px] bg-white p-[16px] text-black lg:gap-[16px]"
                >
                    <span className="font-display text-[24px] leading-normal uppercase lg:text-[32px]">
                        {item.value}
                    </span>
                    <span className="text-[12px] lg:text-[14px]">{item.label}</span>
                </div>
            ))}
        </div>
    )
}

// Holat yorlig'i ranglari — Figma «Исполнители» 321:13203 va «Дашборд» 321:13013:
// На модерации #fff8e6/#c6922e · Активен #44a400 15%/#44a400 ·
// На паузе #fff1e8/#d97706 · Заблокирован #fdecec/#d14343.
export const STATUS_TONES = {
    pending: 'bg-[#fff8e6] text-[#c6922e]',
    success: 'bg-[#44a400]/15 text-[#44a400]',
    warning: 'bg-[#fff1e8] text-[#d97706]',
    danger: 'bg-[#fdecec] text-[#d14343]',
    info: 'bg-[#eef5ff] text-[#2f6fed]',
    archive: 'bg-[#f3f3f3] text-[#9ca3af]',
    draft: 'bg-[#f3f4f6] text-[#6b7280]',
    muted: 'bg-light-white text-grey',
}

// Rasm ustida turgan yorliqlar uchun shaffofsiz variant: `success` tonida fon
// 15% shaffof bo'lgani uchun qorong'i suratda qorayib ketadi (Figma 270:20599 —
// kartochkadagi yorliq oq fondagidek och yashil).
const STATUS_TONES_SOLID = { ...STATUS_TONES, success: 'bg-[#e9f4e0] text-[#44a400]' }

export function AdminStatus({ tone = 'pending', solid = false, children, className = '' }) {
    const tones = solid ? STATUS_TONES_SOLID : STATUS_TONES

    return (
        <span
            className={`flex items-center justify-center rounded-[6px] p-[4px] text-center text-[10px] font-medium whitespace-nowrap lg:px-[12px] lg:py-[8px] lg:text-[14px] ${tones[tone]} ${className}`}
        >
            {children}
        </span>
    )
}

// Ma'lumot yo'q holati.
export function AdminEmpty({ children = 'Ничего не найдено' }) {
    return (
        <p className="py-[24px] text-center text-[14px] text-grey lg:py-[40px] lg:text-[16px]">
            {children}
        </p>
    )
}

// Qidiruv maydoni — o'ng chekkasida oltin kvadrat tugma (Figma 337:15401).
// `variant="white"` — oq fon (kartochkasiz sahifalarda, Figma 338:16536).
export function AdminSearch({ value, onChange, placeholder = 'Поиск', variant = 'light' }) {
    const bg = variant === 'white' ? 'bg-white' : 'bg-light-white'
    return (
        <div className="relative min-w-0 flex-1">
            <Search
                size={20}
                strokeWidth={2}
                aria-hidden
                className="absolute top-1/2 left-[12px] -translate-y-1/2 text-black lg:left-[16px]"
            />
            <input
                type="search"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full rounded-[6px] py-[12px] pr-[56px] pl-[44px] text-[14px] text-black outline-none placeholder:text-[#aaa] lg:py-[16px] lg:pr-[68px] lg:pl-[48px] lg:text-[16px] ${bg}`}
            />
            <span
                aria-hidden
                className="absolute top-0 right-0 flex h-full w-[44px] items-center justify-center rounded-r-[6px] bg-gold text-white lg:w-[52px]"
            >
                <Search size={20} strokeWidth={2} />
            </span>
        </div>
    )
}

// Ochiladigan ro'yxat (Figma 337:15410) — light-white fon, o'ngda chevron.
export function AdminSelect({ value, onChange, options, className = '', variant = 'light' }) {
    return (
        <div className={`relative ${className}`}>
            <select
                value={value}
                onChange={onChange}
                aria-label={options[0]?.label}
                className={`w-full cursor-pointer appearance-none rounded-[6px] p-[12px] pr-[44px] text-[14px] text-grey outline-none lg:p-[16px] lg:pr-[52px] lg:text-[16px] ${
                    variant === 'white' ? 'bg-white' : 'bg-light-white'
                }`}
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

// Sahifalash (Figma 334:14312). Ko'rinadigan raqamlar: 1…5, «...», oxirgisi.
export function AdminPagination({ page, pages, onChange }) {
    if (pages <= 1) return null

    const numbers = []
    const last = pages
    const shown = Math.min(5, last)
    for (let i = 1; i <= shown; i += 1) numbers.push(i)
    if (last > shown + 1) numbers.push('...')
    if (last > shown) numbers.push(last)

    return (
        <div className="flex items-center justify-center gap-[8px] lg:gap-[16px]">
            <button
                type="button"
                onClick={() => onChange(Math.max(1, page - 1))}
                disabled={page === 1}
                aria-label="Назад"
                className="flex size-[24px] cursor-pointer items-center justify-center rounded-[6px] ui-icon-btn disabled:cursor-not-allowed disabled:opacity-50"
            >
                <ChevronLeft size={24} strokeWidth={2} />
            </button>

            <div className="flex items-center gap-[4px] lg:gap-[16px]">
                {numbers.map((n, i) =>
                    n === '...' ? (
                        <span
                            key={`gap-${i}`}
                            className="flex size-[32px] items-center justify-center text-[14px] text-grey lg:size-[40px] lg:text-[16px]"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={n}
                            type="button"
                            onClick={() => onChange(n)}
                            className={`flex size-[32px] cursor-pointer items-center justify-center rounded-[6px] text-[14px] transition-colors lg:size-[40px] lg:text-[16px] ${
                                n === page
                                    ? 'bg-gold font-medium text-white'
                                    : 'text-grey hover:bg-gold hover:text-white'
                            }`}
                        >
                            {n}
                        </button>
                    )
                )}
            </div>

            <button
                type="button"
                onClick={() => onChange(Math.min(pages, page + 1))}
                disabled={page === pages}
                aria-label="Вперёд"
                className="flex size-[24px] cursor-pointer items-center justify-center rounded-[6px] ui-icon-btn disabled:cursor-not-allowed disabled:opacity-50"
            >
                <ChevronRight size={24} strokeWidth={2} />
            </button>
        </div>
    )
}

// Qator menyusi — «⋮» tugmasi ostidagi oq ro'yxat (Figma 334:14381 / 345:18863).
// `compact` — menyu 32px'lik ikonka qutisi ichida turganda. Jadval qatorlarida
// mobil ko'rinishda tugma to'liq kenglikdagi light-white tugmaga aylanadi,
// kartochka ustida esa u faqat ikonka bo'lib qolishi kerak.
export function AdminRowMenu({ items, compact = false }) {
    const [open, setOpen] = useState(false)
    const box = useRef(null)

    useEffect(() => {
        if (!open) return

        function onDown(e) {
            if (!box.current?.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', onDown)
        return () => document.removeEventListener('mousedown', onDown)
    }, [open])

    return (
        <div
            ref={box}
            className={`relative flex ${compact ? '' : 'min-w-0 flex-1 lg:flex-none'}`}
        >
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label="Действия"
                aria-expanded={open}
                className={`flex cursor-pointer items-center justify-center text-inherit transition-opacity hover:opacity-70 ${
                    compact
                        ? ''
                        : 'min-w-0 flex-1 rounded-[6px] bg-light-white p-[8px] lg:flex-none lg:bg-transparent lg:p-0'
                }`}
            >
                <MoreVertical size={24} strokeWidth={2} />
            </button>

            {open && (
                <div className="fade-in absolute top-[calc(100%+8px)] right-0 z-40 flex w-[280px] flex-col rounded-[6px] bg-white p-[16px] drop-shadow-[0_0_6.35px_rgba(0,0,0,0.25)] lg:w-[314px]">
                    {items.map((item) => {
                        const Icon = item.icon
                        return (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => {
                                    setOpen(false)
                                    item.onClick?.()
                                }}
                                className={`flex w-full cursor-pointer items-center gap-[12px] rounded-[6px] p-[12px] text-left text-[14px] font-medium transition-colors hover:bg-light-white lg:p-[16px] lg:text-[16px] ${
                                    item.danger ? 'text-[#d14343]' : 'text-grey'
                                }`}
                            >
                                <Icon size={24} strokeWidth={2} className="shrink-0" />
                                {item.label}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
