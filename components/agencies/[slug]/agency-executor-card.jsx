'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'

// ─────────────────────────────────────────────────────────────────────────────
// Agentlik sahifasidagi anketa kartochkasi — Figma 164:13989 (323×400).
//
// Katalogdagi kartochkadan farqi: tepada teglar o'rniga bitta tur chipi
// («Модель» / «Фотограф» / «Видеограф»), pastda ikkita parametr chipi.
// Havola anketaning o'z bo'limiga olib boradi.
// ─────────────────────────────────────────────────────────────────────────────

// Chip uslubi ikkala qatorda ham bir xil (Figma 164:13993 / 164:13999).
function Chip({ children }) {
    return (
        <span className="flex items-center justify-center rounded-[6px] bg-black/25 px-[12px] py-[8px] text-[12px] font-medium whitespace-nowrap text-white backdrop-blur-[2.5px] lg:text-[14px]">
            {children}
        </span>
    )
}

export default function AgencyExecutorCard({ executor }) {
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const liked = items.some(
        (i) => i.type === FAVORITE_TYPES.EXECUTOR && i.id === executor.href,
    )

    function onLike(e) {
        e.preventDefault()
        toggle({
            type: FAVORITE_TYPES.EXECUTOR,
            id: executor.href,
            slug: executor.href,
            title: executor.name,
            image: executor.image,
        })
    }

    return (
        <Link
            href={executor.href}
            className="group relative flex h-[350px] w-full flex-col justify-between overflow-hidden rounded-[6px] bg-[#d9d9d9] p-[12px] lg:h-[400px] lg:p-[16px]"
        >
            <Image
                src={executor.image}
                alt={executor.name}
                fill
                sizes="(max-width: 1024px) 100vw, 323px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Figma: gradient 55.222% → 88.889% */}
            <span className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_55.222%,rgba(0,0,0,0.8)_88.889%)]" />

            <div className="relative flex items-start justify-between gap-[8px]">
                <Chip>{executor.type}</Chip>

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
                <p className="text-[14px] leading-normal font-medium text-white lg:text-[16px]">
                    {executor.name}
                </p>
                <div className="flex flex-wrap gap-[8px]">
                    {executor.chips.map((chip) => (
                        <Chip key={chip}>{chip}</Chip>
                    ))}
                </div>
            </div>
        </Link>
    )
}
