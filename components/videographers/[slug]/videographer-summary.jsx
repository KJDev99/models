'use client'

import React from 'react'
import { Aperture, Briefcase, Calendar, Heart, MapPin } from 'lucide-react'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import { casesLabel, experienceLabel } from '@/lib/format'

// ─────────────────────────────────────────────────────────────────────────────
// Videograf anketasining asosiy kartochkasi — Figma 136:7685 (770×600, oq,
// radius 6, p-24, bloklar orasi 24px).
//
// Фотографы kartochkasi bilan bir xil, farqlari:
//   parametrlar — calendar · briefcase-01 · camera-lens · marker-pin-01
//                 (Figma 136:8002): yosh · tajriba · keyslar · shahar
//   sarlavha    — «О видеографе»
// ─────────────────────────────────────────────────────────────────────────────

function Meta({ icon: Icon, children }) {
    return (
        <span className="flex items-center gap-[8px] text-[12px] font-medium whitespace-nowrap text-grey lg:text-[16px]">
            <Icon
                size={24}
                strokeWidth={1.75}
                className="size-[15px] shrink-0 text-gold lg:size-[24px]"
            />
            {children}
        </span>
    )
}

function SectionTitle({ children }) {
    return (
        <h2 className="font-sans text-[16px] font-bold text-black lg:text-[18px]">
            {children}
        </h2>
    )
}

export default function VideographerSummary({ videographer, onInvite, footer }) {
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const liked = items.some(
        (i) => i.type === FAVORITE_TYPES.EXECUTOR && i.id === videographer.id,
    )

    function onLike() {
        toggle({
            type: FAVORITE_TYPES.EXECUTOR,
            id: videographer.id,
            slug: videographer.slug,
            title: videographer.name,
            image: videographer.photo,
        })
    }

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
            {/* Ism, parametrlar va teglar — bitta blok (Figma 136:7686, gap 16) */}
            <div className="flex flex-col justify-center gap-[16px]">
                <div className="flex items-center justify-between gap-[16px]">
                    <h1 className="font-sans text-[18px] leading-[24px] font-medium text-black lg:text-[32px] lg:leading-[39px]">
                        {videographer.name}
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

                <div className="flex flex-col gap-[12px]">
                    <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px]">
                        {videographer.age != null && <Meta icon={Calendar}>{videographer.age} лет</Meta>}
                        {videographer.experienceYears != null && (
                            <Meta icon={Briefcase}>{experienceLabel(videographer.experienceYears)}</Meta>
                        )}
                        {videographer.cases != null && (
                            <Meta icon={Aperture}>{casesLabel(videographer.cases)}</Meta>
                        )}
                        <Meta icon={MapPin}>{videographer.city}</Meta>
                    </div>

                    <div className="flex flex-wrap gap-[8px] lg:gap-[12px]">
                        {videographer.tags.map((tag) => (
                            <span
                                key={tag}
                                className="flex items-center justify-center rounded-[6px] border border-[#d9d9d9] px-[12px] py-[8px] text-[12px] font-medium whitespace-nowrap text-grey backdrop-blur-[2.5px] lg:text-[16px]"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* О видеографе — bu blok o'sadi va kartochkani 600px'ga to'ldiradi */}
            <div className="flex flex-1 flex-col gap-[16px]">
                <SectionTitle>О видеографе</SectionTitle>
                <p className="text-[12px] leading-[18px] text-grey lg:text-[16px] lg:leading-[22px]">
                    {videographer.about}
                </p>
            </div>

            {/* Опыт работы — 4 ta plitka bir qatorda, mobilda 2×2 */}
            <div className="flex flex-col gap-[16px]">
                <SectionTitle>Опыт работы</SectionTitle>
                <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4 lg:gap-[16px]">
                    {videographer.stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="flex flex-col gap-[16px] rounded-[6px] bg-light-white p-[16px]"
                        >
                            <p className="font-display text-[24px] leading-none text-black uppercase lg:text-[32px]">
                                {stat.value}
                            </p>
                            <p className="text-[12px] leading-none text-black lg:text-[14px]">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <button
                type="button"
                onClick={onInvite}
                className="flex w-full cursor-pointer items-center justify-center rounded-[6px] border border-gold px-[24px] py-[12px] text-[14px] font-medium whitespace-nowrap text-gold transition-colors hover:bg-gold hover:text-white lg:w-fit lg:py-[16px] lg:text-[18px]"
            >
                Пригласить в проект
            </button>

            {/* Agentlik yorlig'i — backend `agency` bloki bersa chiqadi. */}
            {footer}
        </div>
    )
}
