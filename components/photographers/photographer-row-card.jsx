'use client'

import React, { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { Briefcase, Calendar, Camera, ChevronRight, Heart, MapPin } from 'lucide-react'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'

import 'swiper/css'
import 'swiper/css/free-mode'

// ─────────────────────────────────────────────────────────────────────────────
// Ro'yxat («список») ko'rinishidagi fotograf qatori.
// Figma: 102:2652 (desktop) va 364:14752 ichidagi mobil variant.
//
// Tuzilishi Модели qatori bilan bir xil, faqat parametrlar qatori boshqa:
// «24 лет» · «5 лет опыта» · «120 съёмок» · shahar.
// ─────────────────────────────────────────────────────────────────────────────

function Meta({ icon: Icon, children }) {
    return (
        <span className="flex items-center gap-[8px] text-[14px] whitespace-nowrap text-black">
            <Icon size={17} strokeWidth={1.75} className="shrink-0 text-gold" />
            {children}
        </span>
    )
}

function Tag({ children }) {
    return (
        <span className="flex items-center justify-center rounded-[6px] border border-black/8 px-[12px] py-[8px] text-[14px] whitespace-nowrap text-black">
            {children}
        </span>
    )
}

export default function PhotographerRowCard({ photographer }) {
    const [swiper, setSwiper] = useState(null)
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const liked = items.some(
        (i) => i.type === FAVORITE_TYPES.EXECUTOR && i.id === photographer.id,
    )

    const next = useCallback(() => swiper?.slideNext(), [swiper])

    const href = `/photographers/${photographer.slug}`
    const [visibleTags, hiddenTags] = [
        photographer.tags.slice(0, 3),
        photographer.tags.slice(3),
    ]

    function onLike() {
        toggle({
            type: FAVORITE_TYPES.EXECUTOR,
            id: photographer.id,
            slug: photographer.slug,
            title: photographer.name,
            image: photographer.image,
        })
    }

    return (
        <article className="flex flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[16px] lg:p-[24px]">
            <div className="flex flex-col gap-[12px] lg:flex-row lg:items-start lg:gap-[16px]">
                {/* Avatar + ism: mobilda bir qatorda, yurakcha o'ng chekkada */}
                <div className="flex items-center gap-[12px] lg:contents">
                    <Link
                        href={href}
                        className="relative block size-[40px] shrink-0 overflow-hidden rounded-full bg-[#d9d9d9] lg:size-[94px] lg:rounded-[6px]"
                    >
                        <Image
                            src={photographer.image}
                            alt={photographer.name}
                            fill
                            sizes="94px"
                            className="object-cover"
                        />
                    </Link>

                    <Link
                        href={href}
                        className="min-w-0 flex-1 truncate text-[16px] font-medium text-black transition-colors hover:text-gold lg:hidden"
                    >
                        {photographer.name}
                    </Link>

                    <button
                        type="button"
                        onClick={onLike}
                        aria-label={liked ? 'Убрать из избранного' : 'В избранное'}
                        className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] ui-icon-btn lg:hidden"
                    >
                        <Heart
                            size={24}
                            strokeWidth={2}
                            className={liked ? 'fill-current' : ''}
                        />
                    </button>
                </div>

                {/* Ism, parametrlar va teglar */}
                <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
                    <Link
                        href={href}
                        className="hidden text-[16px] font-medium text-black transition-colors hover:text-gold lg:block"
                    >
                        {photographer.name}
                    </Link>

                    <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px]">
                        <Meta icon={Calendar}>{photographer.age} лет</Meta>
                        {photographer.experienceYears != null && (
                            <Meta icon={Briefcase}>{photographer.experienceYears} лет опыта</Meta>
                        )}
                        {photographer.shoots != null && (
                            <Meta icon={Camera}>{photographer.shoots} съёмок</Meta>
                        )}
                        <Meta icon={MapPin}>{photographer.city}</Meta>
                    </div>

                    <div className="flex flex-wrap gap-[12px]">
                        {visibleTags.map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                        ))}
                        {hiddenTags.length > 0 && <Tag>+{hiddenTags.length}</Tag>}
                    </div>
                </div>

                {/* Desktop: tugma va yurakcha o'ng chekkada */}
                <div className="hidden shrink-0 items-center gap-[16px] lg:flex">
                    <Link
                        href={`${href}?invite=1`}
                        className="flex items-center justify-center rounded-[6px] border border-gold px-[24px] py-[12px] text-[14px] font-medium whitespace-nowrap text-gold transition-colors hover:bg-gold hover:text-white"
                    >
                        Пригласить в проект
                    </Link>

                    <button
                        type="button"
                        onClick={onLike}
                        aria-label={liked ? 'Убрать из избранного' : 'В избранное'}
                        className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] ui-icon-btn"
                    >
                        <Heart
                            size={24}
                            strokeWidth={2}
                            className={liked ? 'fill-current' : ''}
                        />
                    </button>
                </div>
            </div>

            {/* Ishlar lentasi — Figma 96:4869 bilan bir xil (264×200) */}
            <div className="relative">
                <Swiper
                    modules={[FreeMode]}
                    onSwiper={setSwiper}
                    freeMode
                    slidesPerView="auto"
                    spaceBetween={16}
                    className="model-gallery w-full"
                >
                    {photographer.gallery.map((src, i) => (
                        <SwiperSlide key={`${photographer.id}-${i}`}>
                            <Link
                                href={href}
                                className="relative block h-[160px] w-full overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:h-[200px]"
                            >
                                <Image
                                    src={src}
                                    alt=""
                                    fill
                                    sizes="264px"
                                    className="object-cover"
                                />
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button
                    type="button"
                    onClick={next}
                    aria-label="Следующее фото"
                    className="absolute top-1/2 right-[8px] z-10 hidden size-[32px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-[6px] bg-white/80 text-black backdrop-blur-[2.5px] transition-colors hover:bg-white lg:flex"
                >
                    <ChevronRight size={24} strokeWidth={2} />
                </button>
            </div>

            {/* Mobil: tugma pastda, to'liq kenglikda */}
            <Link
                href={`${href}?invite=1`}
                className="flex items-center justify-center rounded-[6px] border border-gold px-[24px] py-[12px] text-[14px] font-medium text-gold transition-colors hover:bg-gold hover:text-white lg:hidden"
            >
                Пригласить в проект
            </Link>
        </article>
    )
}
