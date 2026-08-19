'use client'

import React, { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { Aperture, Briefcase, Calendar, ChevronRight, Heart, MapPin, Play } from 'lucide-react'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'

import 'swiper/css'
import 'swiper/css/free-mode'

// ─────────────────────────────────────────────────────────────────────────────
// Ro'yxat («список») ko'rinishidagi videograf qatori.
// Figma: 102:4056 (desktop) va 366:17007 ichidagi mobil variant.
//
// Tuzilishi Фотографы qatori bilan bir xil, farqlari:
//   · parametrlar: «24 лет» · «4 года опыта» · «45 кейсов» · shahar
//   · lentadagi kadrlar video — ustida qoraytirish va play belgisi
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

export default function VideographerRowCard({ videographer }) {
    const [swiper, setSwiper] = useState(null)
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const liked = items.some(
        (i) => i.type === FAVORITE_TYPES.EXECUTOR && i.id === videographer.id,
    )

    const next = useCallback(() => swiper?.slideNext(), [swiper])

    const href = `/videographers/${videographer.slug}`
    const [visibleTags, hiddenTags] = [
        videographer.tags.slice(0, 3),
        videographer.tags.slice(3),
    ]

    function onLike() {
        toggle({
            type: FAVORITE_TYPES.EXECUTOR,
            id: videographer.id,
            slug: videographer.slug,
            title: videographer.name,
            image: videographer.image,
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
                            src={videographer.image}
                            alt={videographer.name}
                            fill
                            sizes="94px"
                            className="object-cover"
                        />
                    </Link>

                    <Link
                        href={href}
                        className="min-w-0 flex-1 truncate text-[16px] font-medium text-black transition-colors hover:text-gold lg:hidden"
                    >
                        {videographer.name}
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
                        {videographer.name}
                    </Link>

                    <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px]">
                        <Meta icon={Calendar}>{videographer.age} лет</Meta>
                        <Meta icon={Briefcase}>{videographer.experienceYears} года опыта</Meta>
                        <Meta icon={Aperture}>{videographer.cases} кейсов</Meta>
                        <Meta icon={MapPin}>{videographer.city}</Meta>
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

            {/* Ishlar lentasi — video kadrlari (Figma 138:8030) */}
            <div className="relative">
                <Swiper
                    modules={[FreeMode]}
                    onSwiper={setSwiper}
                    freeMode
                    slidesPerView="auto"
                    spaceBetween={16}
                    className="model-gallery w-full"
                >
                    {videographer.gallery.map((src, i) => (
                        <SwiperSlide key={`${videographer.id}-${i}`}>
                            <Link
                                href={href}
                                className="group/tile relative block h-[160px] w-full overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:h-[200px]"
                            >
                                <Image
                                    src={src}
                                    alt=""
                                    fill
                                    sizes="264px"
                                    className="object-cover"
                                />
                                <span
                                    aria-hidden
                                    className="absolute inset-0 bg-black/25 transition-colors group-hover/tile:bg-black/40"
                                />
                                <span
                                    aria-hidden
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white transition-transform duration-300 group-hover/tile:scale-110"
                                >
                                    <Play size={40} strokeWidth={1.5} className="fill-white" />
                                </span>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button
                    type="button"
                    onClick={next}
                    aria-label="Следующее видео"
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
