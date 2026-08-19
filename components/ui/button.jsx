'use client'

import React from 'react'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// Figma UI-kit (75:114) — tugmaning to'rtta holati bir qatorda chizilgan:
//   Default (75:1317) · Hover (75:1318) · Disable (75:1319) · Selected (75:1316)
//
// To'rtta turi: gold button (75:1309), button gold stroke (81:3038),
// button white (75:1360), button white stroke (75:1388).
//
//   tur           default                     hover
//   gold          gold fon, oq matn           #c19754 fon
//   goldStroke    gold kontur, gold matn      gold fon, oq matn
//   white         oq fon, qora matn           #e6e6e6 fon
//   whiteStroke   oq kontur, oq matn          oq fon, qora matn
//
// Disable — opacity 50% (Figma Variant3). Selected — 1px kontur; Figma'da qizil
// marker bilan belgilangan, biz uni klaviatura fokusida ko'rsatamiz.
// Hover paytida «animate hover» (75:1321) yorug'lik chizig'i o'tadi — `.ui-shine`.
// Barcha tugmalar: rounded-[6px], Montserrat Medium, gap-[12px].
// ─────────────────────────────────────────────────────────────────────────────

// Konturli variantlarda `border` o'rniga ichki `box-shadow` ishlatiladi:
// Figma'da chiziq freym ichida chiziladi, ya'ni 229×54 o'lchov chiziqni ham
// o'z ichiga oladi. CSS `border` esa balandlikka +2px qo'shib yuborardi.
const VARIANTS = {
    gold: 'bg-gold text-white hover:bg-[#c19754]',
    goldStroke:
        'bg-transparent text-gold shadow-[inset_0_0_0_1px_var(--color-gold)] hover:bg-gold hover:text-white',
    white: 'bg-white text-black hover:bg-[#e6e6e6]',
    whiteStroke:
        'bg-transparent text-white shadow-[inset_0_0_0_1px_#ffffff] hover:bg-white hover:text-black',
    darkStroke:
        'bg-transparent text-black shadow-[inset_0_0_0_1px_rgb(34_34_34_/_0.15)] hover:shadow-[inset_0_0_0_1px_#222222]',
    black: 'bg-black text-white hover:bg-black/90',
    ghost: 'bg-transparent text-grey hover:text-black',
    danger: 'bg-transparent text-danger shadow-[inset_0_0_0_1px_rgb(217_39_39_/_0.4)] hover:bg-danger hover:text-white',
    underline: 'bg-transparent text-white border-b border-white rounded-none hover:opacity-80',
}

// Figma o'lchamlari: mobil px-16 py-12 / 14px, desktop px-24 py-16 / 18px.
// `leading` — Figma'ning avtomatik qator balandligi (Montserrat ≈ 1.22×):
// 12px → 15, 14px → 17, 18px → 22. Shu sabab tugma balandligi Figma'dagidek
// chiqadi: mobil 12+17+12 = 41 (353:20642), desktop 16+22+16 = 54 (75:213).
const SIZES = {
    sm: 'px-[12px] py-[8px] text-[12px] leading-[15px]',
    md: 'px-[16px] py-[12px] text-[14px] leading-[17px]',
    lg: 'px-[16px] py-[12px] text-[14px] leading-[17px] lg:px-[24px] lg:py-[16px] lg:text-[18px] lg:leading-[22px]',
    xl: 'px-[24px] py-[16px] text-[18px] leading-[22px]',
}

// Figma'da «animate hover» to'rtala UI-kit variantida bor
// (75:1356 · 81:3048 · 75:1369 · 75:1397).
const SHINY = new Set(['gold', 'goldStroke', 'white', 'whiteStroke'])

export default function Button({
    children,
    text,
    variant = 'gold',
    size = 'lg',
    icon,
    iconRight,
    href,
    type = 'button',
    full = false,
    loading = false,
    disabled = false,
    className = '',
    onClick,
    ...rest
}) {
    const shiny = SHINY.has(variant)

    const classes = [
        'group relative inline-flex items-center justify-center gap-[12px] overflow-hidden rounded-[6px]',
        'font-medium whitespace-nowrap transition-colors duration-200',
        'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
        // Selected/fokus holati (Figma 75:1316) — faqat klaviatura bilan.
        'outline-none focus-visible:ring-1 focus-visible:ring-gold focus-visible:ring-offset-2',
        shiny ? 'ui-shine' : '',
        VARIANTS[variant] || VARIANTS.gold,
        SIZES[size] || SIZES.lg,
        full ? 'w-full' : '',
        className,
    ].join(' ')

    const content = (
        <>
            {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {!loading && icon}
            <span className="relative">{children || text}</span>
            {iconRight}
        </>
    )

    if (href && !disabled) {
        return (
            <Link href={href} className={classes} onClick={onClick} {...rest}>
                {content}
            </Link>
        )
    }

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            {...rest}
        >
            {content}
        </button>
    )
}
