'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'

// ─────────────────────────────────────────────────────────────────────────────
// Agentlik kartochkasi — Figma 164:13312 (desktop 323×300) va 375:14414
// ichidagi mobil variant.
//
// Yuqorida 200px logotip maydoni: chapda «68 исполнителей» chipi, o'ngda
// yurakcha. Ostida oq blok: nomi (18px SemiBold) va turi · shahar.
// ─────────────────────────────────────────────────────────────────────────────
export default function AgencyCard({ agency, className = '' }) {
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const liked = items.some((i) => i.type === FAVORITE_TYPES.AGENCY && i.id === agency.id)

    function onLike(e) {
        e.preventDefault()
        toggle({
            type: FAVORITE_TYPES.AGENCY,
            id: agency.id,
            slug: agency.slug,
            title: agency.name,
            image: agency.image,
        })
    }

    return (
        <article className={`flex flex-col overflow-hidden rounded-[6px] ${className}`}>
            {/* Logotip bloki */}
            <div className="relative flex h-[200px] w-full shrink-0 items-start gap-[16px] rounded-[6px] bg-[#787878] p-[12px] lg:p-[16px]">
                <Image
                    src={agency.image}
                    alt={agency.name}
                    fill
                    sizes="(max-width: 1024px) 296px, 323px"
                    className="rounded-[6px] object-cover"
                />

                <span className="relative flex items-center justify-center rounded-[6px] bg-black/25 px-[12px] py-[8px] text-[12px] font-medium whitespace-nowrap text-white backdrop-blur-[2.5px] lg:text-[14px]">
                    {agency.executors} исполнителей
                </span>

                <button
                    type="button"
                    onClick={onLike}
                    aria-label={liked ? 'Убрать из избранного' : 'В избранное'}
                    className="relative ml-auto flex cursor-pointer items-center rounded-[6px] bg-black/30 p-[4px] transition-colors hover:bg-black/50"
                >
                    <Heart
                        size={24}
                        strokeWidth={2}
                        className={liked ? 'fill-gold text-gold' : 'text-white'}
                    />
                </button>
            </div>

            {/* Matn bloki */}
            <div className="flex flex-1 flex-col justify-center gap-[10px] bg-white p-[12px] lg:p-[16px]">
                <Link
                    href={`/agencies/${agency.slug}`}
                    className="line-clamp-1 text-[16px] leading-[24px] font-semibold text-black transition-colors hover:text-gold lg:text-[18px]"
                >
                    {agency.name}
                </Link>

                <p className="line-clamp-2 text-[12px] leading-[17px] text-grey lg:text-[14px]">
                    {agency.kind} · {agency.city}
                </p>
            </div>
        </article>
    )
}
