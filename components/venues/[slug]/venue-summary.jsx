'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Banknote, Expand, Heart, MapPin, Users } from 'lucide-react'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'

// ─────────────────────────────────────────────────────────────────────────────
// Maydonning asosiy kartochkasi — Figma 138:8364 (770×600, oq, radius 6, p-24).
//
// Tuzilishi:
//   nom + yurakcha  → parametrlar qatori (expand-06 · users-02 · marker-pin-01
//                     · bank-note-01) → maydon turi chipi
//   «О площадке» matni (o'sadi va kartochkani to'ldiradi)
//   «Подходит для» — light-white chiplar (Figma 164:17061)
//   pastda: narx + «Забронировать» va egasining kartasi (Figma 373:15102)
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

export default function VenueSummary({ venue, onBook }) {
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const liked = items.some((i) => i.type === FAVORITE_TYPES.VENUE && i.id === venue.slug)

    const price = `от ${venue.pricePerHour.toLocaleString('ru-RU')} ₽/час`

    function onLike() {
        toggle({
            type: FAVORITE_TYPES.VENUE,
            id: venue.slug,
            slug: venue.slug,
            title: venue.name,
            image: venue.photos[0],
        })
    }

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
            {/* Nom, parametrlar va tur — bitta blok (Figma 138:8365, gap 16) */}
            <div className="flex flex-col justify-center gap-[16px]">
                <div className="flex items-center justify-between gap-[16px]">
                    <h1 className="font-sans text-[18px] leading-[24px] font-medium text-black lg:text-[32px] lg:leading-[39px]">
                        {venue.name}
                    </h1>

                    <button
                        type="button"
                        onClick={onLike}
                        aria-label={liked ? 'Убрать из избранного' : 'В избранное'}
                        className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] bg-gold/25 backdrop-blur-[2.5px] transition-colors hover:bg-gold/40"
                    >
                        <Heart
                            size={24}
                            strokeWidth={2}
                            className={liked ? 'fill-gold text-gold' : 'text-gold'}
                        />
                    </button>
                </div>

                <div className="flex flex-col gap-[12px]">
                    <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px]">
                        <Meta icon={Expand}>{venue.area} м²</Meta>
                        <Meta icon={Users}>до {venue.capacity} чел.</Meta>
                        <Meta icon={MapPin}>{venue.city}</Meta>
                        <Meta icon={Banknote}>{price}</Meta>
                    </div>

                    <div className="flex flex-wrap gap-[12px]">
                        <span className="flex items-center justify-center rounded-[6px] border border-[#d9d9d9] px-[12px] py-[8px] text-[14px] font-medium whitespace-nowrap text-grey backdrop-blur-[2.5px] lg:text-[16px]">
                            {venue.type}
                        </span>
                    </div>
                </div>
            </div>

            {/* О площадке — bu blok o'sadi va kartochkani 600px'ga to'ldiradi */}
            <div className="flex flex-1 flex-col gap-[16px]">
                <SectionTitle>О площадке</SectionTitle>
                <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                    {venue.about}
                </p>
            </div>

            {/* Подходит для — light-white chiplar (Figma 164:17060) */}
            <div className="flex flex-col gap-[16px]">
                <SectionTitle>Подходит для</SectionTitle>
                <div className="flex flex-wrap gap-[12px] lg:gap-[16px]">
                    {venue.suitableFor.map((item) => (
                        <span
                            key={item}
                            className="flex items-center justify-center rounded-[6px] bg-light-white px-[12px] py-[8px] text-[14px] font-medium whitespace-nowrap text-grey lg:text-[16px]"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* Narx + «Забронировать» va maydon egasi (Figma 373:15102) */}
            <div className="flex flex-col gap-[16px] lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-[12px] sm:flex-row sm:items-center sm:gap-[24px]">
                    <p className="text-[18px] leading-[24px] font-medium whitespace-nowrap text-black lg:text-[20px]">
                        {price}
                    </p>

                    <button
                        type="button"
                        onClick={onBook}
                        className="flex w-full cursor-pointer items-center justify-center rounded-[6px] border border-gold px-[24px] py-[12px] text-[14px] font-medium whitespace-nowrap text-gold transition-colors hover:bg-gold hover:text-white sm:w-fit lg:py-[16px] lg:text-[18px]"
                    >
                        Забронировать
                    </button>
                </div>

                <Link
                    href={venue.owner.href}
                    className="flex items-center gap-[12px] rounded-[6px] border border-gold p-[16px] transition-colors hover:bg-gold/10"
                >
                    <span className="relative block size-[37px] shrink-0 overflow-hidden rounded-[6px] bg-[#d9d9d9]">
                        <Image
                            src={venue.owner.logo}
                            alt={venue.owner.name}
                            fill
                            sizes="37px"
                            className="object-cover"
                        />
                    </span>
                    <span className="flex min-w-0 flex-col gap-[2px]">
                        <span className="truncate text-[16px] leading-[20px] font-medium text-black">
                            {venue.owner.name}
                        </span>
                        <span className="truncate text-[12px] leading-[15px] text-grey">
                            {venue.owner.note}
                        </span>
                    </span>
                </Link>
            </div>
        </div>
    )
}
