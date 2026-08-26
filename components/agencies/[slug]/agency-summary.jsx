'use client'

import React from 'react'
import { Heart, Mail, Phone } from 'lucide-react'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'

// ─────────────────────────────────────────────────────────────────────────────
// Agentlikning asosiy kartochkasi — Figma 164:13624 (770×554, oq, radius 6,
// ichki bo'shliq 24, elementlar orasi 24).
//
// Tuzilishi: nom + yurakcha → turi · shahar → «О агентстве» → «Контакты»
// (phone · mail-01) → to'rtta raqamli plitka (light-white, radius 6).
// ─────────────────────────────────────────────────────────────────────────────

function SectionTitle({ children }) {
    return (
        <h2 className="font-sans text-[16px] font-bold text-black lg:text-[18px]">
            {children}
        </h2>
    )
}

function Contact({ icon: Icon, href, children }) {
    return (
        <a
            href={href}
            className="flex items-center gap-[8px] text-[14px] font-medium whitespace-nowrap text-grey transition-colors hover:text-gold lg:text-[16px]"
        >
            <Icon
                size={24}
                strokeWidth={1.75}
                className="size-[15px] shrink-0 text-gold lg:size-[24px]"
            />
            {children}
        </a>
    )
}

export default function AgencySummary({ agency }) {
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const liked = items.some((i) => i.type === FAVORITE_TYPES.AGENCY && i.id === agency.id)

    function onLike() {
        toggle({
            type: FAVORITE_TYPES.AGENCY,
            id: agency.id,
            slug: agency.slug,
            title: agency.name,
            image: agency.logo,
        })
    }

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
            {/* Nom, turi va shahar (Figma 164:13626) */}
            <div className="flex flex-col gap-[16px]">
                <div className="flex items-center justify-between gap-[16px]">
                    <h1 className="font-sans text-[18px] leading-[24px] font-medium text-black lg:text-[32px] lg:leading-[39px]">
                        {agency.name}
                    </h1>

                    <button
                        type="button"
                        onClick={onLike}
                        aria-label={liked ? 'Убрать из избранного' : 'В избранное'}
                        className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] ui-icon-btn backdrop-blur-[2.5px]"
                    >
                        <Heart
                            size={24}
                            strokeWidth={2}
                            className={liked ? 'fill-current' : ''}
                        />
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-[10px] text-[14px] font-medium text-grey lg:text-[16px]">
                    <span>{agency.kind}</span>
                    <span aria-hidden className="size-[4px] shrink-0 rounded-full bg-grey" />
                    <span>{agency.city}</span>
                </div>
            </div>

            {/* О агентстве */}
            <div className="flex flex-col gap-[16px]">
                <SectionTitle>О агентстве</SectionTitle>
                <p className="text-[12px] leading-[18px] text-grey lg:text-[16px] lg:leading-[22px]">
                    {agency.about}
                </p>
            </div>

            {/* Контакты — Figma 164:13954 */}
            <div className="flex flex-col gap-[16px]">
                <SectionTitle>Контакты</SectionTitle>
                <div className="flex flex-col gap-[12px] sm:flex-row sm:flex-wrap sm:gap-[24px]">
                    <Contact icon={Phone} href={`tel:${agency.phone.replace(/[^+\d]/g, '')}`}>
                        {agency.phone}
                    </Contact>
                    <Contact icon={Mail} href={`mailto:${agency.email}`}>
                        {agency.email}
                    </Contact>
                </div>
            </div>

            {/* Raqamli plitkalar — Figma 164:13840 (mobilda 2×2) */}
            <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4 lg:gap-[16px]">
                {agency.stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="flex flex-col gap-[12px] rounded-[6px] bg-light-white p-[12px] lg:gap-[16px] lg:p-[16px]"
                    >
                        <p className="font-display text-[24px] leading-none text-black uppercase lg:text-[32px]">
                            {stat.value}
                        </p>
                        <p className="text-[12px] text-black lg:text-[14px]">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
