'use client'

import React from 'react'
import Link from 'next/link'

// Figma UI-kit: gold button (75:1309), button gold stroke (81:3038),
// button white (75:1360), button white stroke (75:1388), animate hover (75:1321).
// Barcha tugmalar: rounded-[6px], Montserrat Medium, gap-[12px].
// `gold` va `white` variantlarida hover'da yorug'lik chizig'i o'tadi
// (Figma'dagi blur qilingan burchakka og'gan to'rtburchak).

const VARIANTS = {
    gold: 'bg-gold text-white disabled:bg-gold/40',
    goldStroke:
        'bg-transparent text-gold border border-gold hover:bg-gold hover:text-white disabled:opacity-40',
    white: 'bg-white text-black disabled:opacity-40',
    whiteStroke:
        'bg-transparent text-white border border-white hover:bg-white/10 disabled:opacity-40',
    darkStroke:
        'bg-transparent text-black border border-black/15 hover:border-black disabled:opacity-40',
    black: 'bg-black text-white hover:bg-black/90 disabled:opacity-40',
    ghost: 'bg-transparent text-grey hover:text-black disabled:opacity-40',
    danger:
        'bg-transparent text-danger border border-danger/40 hover:bg-danger hover:text-white disabled:opacity-40',
    underline:
        'bg-transparent text-white border-b border-white rounded-none hover:opacity-80 disabled:opacity-40',
}

// Figma o'lchamlari: mobil px-16 py-12 / 14px, desktop px-24 py-16 / 18px.
const SIZES = {
    sm: 'px-[12px] py-[8px] text-[12px]',
    md: 'px-[16px] py-[12px] text-[14px]',
    lg: 'px-[16px] py-[12px] text-[14px] lg:px-[24px] lg:py-[16px] lg:text-[18px]',
    xl: 'px-[24px] py-[16px] text-[18px]',
}

// Yorug'lik chizig'i faqat to'ldirilgan tugmalarda.
const SHINY = new Set(['gold', 'white'])

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
        'font-medium leading-none whitespace-nowrap transition-colors duration-200',
        'cursor-pointer disabled:cursor-not-allowed',
        VARIANTS[variant] || VARIANTS.gold,
        SIZES[size] || SIZES.lg,
        full ? 'w-full' : '',
        className,
    ].join(' ')

    const content = (
        <>
            {shiny && (
                <span
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-0 h-[216px] w-[34px] -translate-x-[200%] -translate-y-1/2 rotate-[50.56deg] bg-white/25 blur-[6.25px] transition-transform duration-700 ease-out group-hover:translate-x-[600%]"
                />
            )}
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
