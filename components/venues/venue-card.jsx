'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'

// ─────────────────────────────────────────────────────────────────────────────
// Setka ko'rinishidagi maydon kartochkasi.
// Figma: 120:1121 ichidagi kartochka, «Другие площадки» varianti 138:8583.
//
// Ijrochi kartochkasidan farqi:
//   · tepada bitta chip — shahar (kategoriya teglari va «+N» yo'q)
//   · pastda «120 м²» va «от 2 500 ₽/час»
// ─────────────────────────────────────────────────────────────────────────────
export default function VenueCard({ venue, className = '' }) {
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const liked = items.some((i) => i.type === FAVORITE_TYPES.VENUE && i.id === venue.id)

    function onLike(e) {
        e.preventDefault()
        toggle({
            type: FAVORITE_TYPES.VENUE,
            id: venue.id,
            slug: venue.slug,
            title: venue.name,
            image: venue.image,
        })
    }

    return (
        <Link
            href={`/venues/${venue.slug}`}
            className={`group relative flex h-[350px] w-full flex-col justify-between overflow-hidden rounded-[6px] bg-[#d9d9d9] p-[12px] lg:h-[300px] lg:p-[16px] ${className}`}
        >
            <Image
                src={venue.image}
                alt={venue.name}
                fill
                sizes="(max-width: 1024px) 100vw, 240px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Figma: gradient 55.222% → 88.889% */}
            <span className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_55.222%,rgba(0,0,0,0.8)_88.889%)]" />

            <div className="relative flex items-center justify-between">
                <span className="flex items-center justify-center rounded-[6px] bg-black/25 px-[12px] py-[8px] text-[12px] font-medium text-white backdrop-blur-[2.5px] lg:text-[14px]">
                    {venue.city}
                </span>

                <button
                    type="button"
                    onClick={onLike}
                    aria-label={liked ? 'Убрать из избранного' : 'В избранное'}
                    className="flex cursor-pointer items-center rounded-[6px] bg-black/25 p-[4px] backdrop-blur-[2.5px] transition-colors hover:bg-black/45"
                >
                    <Heart
                        size={24}
                        strokeWidth={2}
                        className={liked ? 'fill-gold text-gold' : 'text-white'}
                    />
                </button>
            </div>

            <div className="relative flex flex-col gap-[12px]">
                <p className="text-[14px] leading-[24px] font-medium text-white lg:text-[18px]">
                    {venue.name}
                </p>
                <div className="flex flex-wrap gap-[8px]">
                    <span className="flex items-center justify-center rounded-[6px] bg-black/20 px-[12px] py-[8px] text-[12px] font-medium text-white backdrop-blur-[2.5px] lg:text-[14px]">
                        {venue.area} м²
                    </span>
                    <span className="flex items-center justify-center rounded-[6px] bg-black/20 px-[12px] py-[8px] text-[12px] font-medium text-white backdrop-blur-[2.5px] lg:text-[14px]">
                        от {venue.pricePerHour.toLocaleString('ru-RU')} ₽/час
                    </span>
                </div>
            </div>
        </Link>
    )
}
