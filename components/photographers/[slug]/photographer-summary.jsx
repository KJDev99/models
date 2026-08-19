'use client'

import React from 'react'
import { Briefcase, Calendar, Camera, Heart, MapPin } from 'lucide-react'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'

// ─────────────────────────────────────────────────────────────────────────────
// Fotograf anketasining asosiy kartochkasi — Figma 129:7076 (770×600, oq,
// radius 6, p-24, bloklar orasi 24px).
//
// Aniq qiymatlar (Модели kartochkasi bilan bir xil):
//   ism        Montserrat Medium 32px, #222
//   yurakcha   32×32, gold 25%, radius 6, p-4, backdrop-blur 2.5
//   parametr   ikonka 20px + Montserrat Medium 16px #666, orasi 8, qatorda 16
//              (Figma 129:7396 — calendar · briefcase-01 · camera-02 · marker-pin-01)
//   teg        ramka #d9d9d9, px-12 py-8, radius 6, Medium 16px #666, orasi 12
//   sarlavha   Montserrat Bold 18px #222
//   plitka     light-white, p-16, radius 6; qiymat Helvetica Neue 32px
//   tugma      gold ramka, px-24 py-16, Medium 18px gold
// ─────────────────────────────────────────────────────────────────────────────

function Meta({ icon: Icon, children }) {
    return (
        <span className="flex items-center gap-[8px] text-[14px] font-medium whitespace-nowrap text-grey lg:text-[16px]">
            <Icon
                size={24}
                strokeWidth={1.75}
                className="size-[20px] shrink-0 text-gold lg:size-[24px]"
            />
            {children}
        </span>
    )
}

function SectionTitle({ children }) {
    return (
        <h2 className="font-sans text-[16px] leading-normal font-bold text-black lg:text-[18px]">
            {children}
        </h2>
    )
}

export default function PhotographerSummary({ photographer, onInvite }) {
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const liked = items.some(
        (i) => i.type === FAVORITE_TYPES.EXECUTOR && i.id === photographer.slug,
    )

    function onLike() {
        toggle({
            type: FAVORITE_TYPES.EXECUTOR,
            id: photographer.slug,
            slug: photographer.slug,
            title: photographer.name,
            image: photographer.photo,
        })
    }

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
            {/* Ism, parametrlar va teglar — bitta blok (Figma 129:7077, gap 16) */}
            <div className="flex flex-col justify-center gap-[16px]">
                <div className="flex items-center justify-between gap-[16px]">
                    <h1 className="font-sans text-[18px] leading-[24px] font-medium text-black lg:text-[32px] lg:leading-[39px]">
                        {photographer.name}
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
                        <Meta icon={Calendar}>{photographer.age} лет</Meta>
                        <Meta icon={Briefcase}>{photographer.experienceYears} лет опыта</Meta>
                        <Meta icon={Camera}>{photographer.shoots} съёмок</Meta>
                        <Meta icon={MapPin}>{photographer.city}</Meta>
                    </div>

                    <div className="flex flex-wrap gap-[12px]">
                        {photographer.tags.map((tag) => (
                            <span
                                key={tag}
                                className="flex items-center justify-center rounded-[6px] border border-[#d9d9d9] px-[12px] py-[8px] text-[14px] font-medium whitespace-nowrap text-grey backdrop-blur-[2.5px] lg:text-[16px]"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* О фотографе — bu blok o'sadi va kartochkani 600px'ga to'ldiradi */}
            <div className="flex flex-1 flex-col gap-[16px]">
                <SectionTitle>О фотографе</SectionTitle>
                <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                    {photographer.about}
                </p>
            </div>

            {/* Опыт работы — 4 ta plitka bir qatorda, mobilda 2×2 */}
            <div className="flex flex-col gap-[16px]">
                <SectionTitle>Опыт работы</SectionTitle>
                <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4 lg:gap-[16px]">
                    {photographer.stats.map((stat) => (
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
        </div>
    )
}
