'use client'

import React, { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { Banknote, ChevronRight, Expand, Heart, MapPin, Users } from 'lucide-react'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'

import 'swiper/css'
import 'swiper/css/free-mode'
import { pricePerHour } from '@/lib/format'

// ─────────────────────────────────────────────────────────────────────────────
// Ro'yxat («список») ko'rinishidagi maydon qatori.
// Figma: 128:3387 (desktop) va 373:12970 ichidagi mobil variant.
//
// Ijrochi qatoridan farqi: parametrlar «120 м²» · «до 5 чел.» · shahar ·
// «от 2 500 ₽/час», teg o'rnida maydon turi, tugma — «Забронировать».
// Ikonkalar Figma 138:8763 dagi expand-06 · users-02 · marker-pin-01 · bank-note-01.
// ─────────────────────────────────────────────────────────────────────────────

function Meta({ icon: Icon, children }) {
    return (
        <span className="flex items-center gap-[8px] text-[14px] whitespace-nowrap text-black">
            <Icon size={17} strokeWidth={1.75} className="shrink-0 text-gold" />
            {children}
        </span>
    )
}

export default function VenueRowCard({ venue }) {
    const [swiper, setSwiper] = useState(null)
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const liked = items.some((i) => i.type === FAVORITE_TYPES.VENUE && i.id === venue.id)

    const next = useCallback(() => swiper?.slideNext(), [swiper])

    const href = `/venues/${venue.slug}`
    const price = pricePerHour(venue.pricePerHour)

    function onLike() {
        toggle({
            type: FAVORITE_TYPES.VENUE,
            id: venue.id,
            slug: venue.slug,
            title: venue.name,
            image: venue.image,
        })
    }

    return (
        <article className="flex flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[16px] lg:p-[24px]">
            <div className="flex flex-col gap-[12px] lg:flex-row lg:items-start lg:gap-[16px]">
                {/* Avatar + nom: mobilda bir qatorda, yurakcha o'ng chekkada */}
                <div className="flex items-center gap-[12px] lg:contents">
                    <Link
                        href={href}
                        className="relative block size-[40px] shrink-0 overflow-hidden rounded-full bg-[#d9d9d9] lg:size-[94px] lg:rounded-[6px]"
                    >
                        <Image
                            src={venue.image}
                            alt={venue.name}
                            fill
                            sizes="94px"
                            className="object-cover"
                        />
                    </Link>

                    <Link
                        href={href}
                        className="min-w-0 flex-1 truncate text-[16px] font-medium text-black transition-colors hover:text-gold lg:hidden"
                    >
                        {venue.name}
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

                {/* Nom, parametrlar va tur */}
                <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
                    <Link
                        href={href}
                        className="hidden text-[16px] font-medium text-black transition-colors hover:text-gold lg:block"
                    >
                        {venue.name}
                    </Link>

                    <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px]">
                        <Meta icon={Expand}>{venue.area} м²</Meta>
                        <Meta icon={Users}>до {venue.capacity} чел.</Meta>
                        <Meta icon={MapPin}>{venue.city}</Meta>
                        <Meta icon={Banknote}>{price}</Meta>
                    </div>

                    <div className="flex flex-wrap gap-[12px]">
                        <span className="flex items-center justify-center rounded-[6px] border border-black/8 px-[12px] py-[8px] text-[14px] whitespace-nowrap text-black">
                            {venue.type}
                        </span>
                    </div>
                </div>

                {/* Desktop: tugma va yurakcha o'ng chekkada */}
                <div className="hidden shrink-0 items-center gap-[16px] lg:flex">
                    <Link
                        href={`${href}?book=1`}
                        className="flex items-center justify-center rounded-[6px] border border-gold px-[24px] py-[12px] text-[14px] font-medium whitespace-nowrap text-gold transition-colors hover:bg-gold hover:text-white"
                    >
                        Забронировать
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

            {/* Suratlar lentasi — Figma 96:4869 bilan bir xil (264×200) */}
            <div className="relative">
                <Swiper
                    modules={[FreeMode]}
                    onSwiper={setSwiper}
                    freeMode
                    slidesPerView="auto"
                    spaceBetween={16}
                    className="model-gallery w-full"
                >
                    {venue.gallery.map((src, i) => (
                        <SwiperSlide key={`${venue.id}-${i}`}>
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
                href={`${href}?book=1`}
                className="flex items-center justify-center rounded-[6px] border border-gold px-[24px] py-[12px] text-[14px] font-medium text-gold transition-colors hover:bg-gold hover:text-white lg:hidden"
            >
                Забронировать
            </Link>
        </article>
    )
}
