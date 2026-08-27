'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import { experienceLabel, shootsLabel } from '@/lib/format'

// ─────────────────────────────────────────────────────────────────────────────
// Setka ko'rinishidagi fotograf kartochkasi.
// Figma: 93:7245 (desktop 238×300) va 364:14179 ichidagi mobil variant.
//
// Модели kartochkasidan farqi faqat pastdagi ikkita chipda: yosh/bo'y o'rniga
// «5 лет опыта» va «120 съёмок». Qolgani — bir xil: gradient 55.2%→88.9%,
// tepada kategoriya chiplari va yurakcha.
// ─────────────────────────────────────────────────────────────────────────────
// `className` — balandlikni almashtirish uchun (anketa sahifasidagi «Другие
// фотографы» blokida boshqa qiymat berilishi mumkin).
export default function PhotographerCard({ photographer, className = '' }) {
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const liked = items.some(
        (i) => i.type === FAVORITE_TYPES.EXECUTOR && i.id === photographer.id,
    )

    // Figma'da bitta chip ko'rinadi, qolganlari «+N» ichida yig'iladi.
    const [firstTag, ...restTags] = photographer.tags

    function onLike(e) {
        e.preventDefault()
        toggle({
            type: FAVORITE_TYPES.EXECUTOR,
            id: photographer.id,
            slug: photographer.slug,
            title: photographer.name,
            image: photographer.image,
        })
    }

    return (
        <Link
            href={`/photographers/${photographer.slug}`}
            className={`group relative flex h-[350px] w-full flex-col justify-between overflow-hidden rounded-[6px] bg-[#d9d9d9] p-[12px] lg:h-[300px] lg:p-[16px] ${className}`}
        >
            <Image
                src={photographer.image}
                alt={photographer.name}
                fill
                sizes="(max-width: 1024px) 100vw, 240px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Figma: gradient 55.222% → 88.889% */}
            <span className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_55.222%,rgba(0,0,0,0.8)_88.889%)]" />

            <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                    <span className="flex items-center justify-center rounded-[6px] bg-black/25 px-[12px] py-[8px] text-[12px] font-medium text-white backdrop-blur-[2.5px]">
                        {firstTag}
                    </span>
                    {restTags.length > 0 && (
                        <span className="flex items-center justify-center rounded-[6px] bg-black/25 px-[12px] py-[8px] text-[12px] font-medium text-white backdrop-blur-[2.5px]">
                            +{restTags.length}
                        </span>
                    )}
                </div>

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
                    {photographer.name}
                </p>
                <div className="flex flex-wrap gap-[8px]">
                    {photographer.experienceYears != null && (
                        <span className="flex items-center justify-center rounded-[6px] bg-black/20 px-[12px] py-[8px] text-[12px] font-medium text-white backdrop-blur-[2.5px]">
                            {experienceLabel(photographer.experienceYears)}
                        </span>
                    )}
                    {photographer.shoots != null && (
                        <span className="flex items-center justify-center rounded-[6px] bg-black/20 px-[12px] py-[8px] text-[12px] font-medium text-white backdrop-blur-[2.5px]">
                            {shootsLabel(photographer.shoots)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}
