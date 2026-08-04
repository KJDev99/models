'use client'

import React, { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import Container from '@/components/ui/container'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import { EXECUTORS } from '@/components/home/home-data'

import 'swiper/css'
import 'swiper/css/free-mode'

// ─────────────────────────────────────────────────────────────────────────────
// Figma: «Популярные исполнители» — desktop 52:1110, mobil 373:17158.
// Desktop: 4 ta kartochka + sarlavha yonida strelkalar.
// Mobil: gorizontal svayp, strelkalarsiz.
// ─────────────────────────────────────────────────────────────────────────────

function ExecutorCard({ executor }) {
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const liked = items.some((i) => i.type === FAVORITE_TYPES.EXECUTOR && i.id === executor.id)

    function onLike(e) {
        e.preventDefault()
        toggle({
            type: FAVORITE_TYPES.EXECUTOR,
            id: executor.id,
            slug: executor.slug,
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
                sizes="(max-width: 1024px) 284px, 323px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Figma: pastga qorayuvchi gradient 55.2% → 88.9% */}
            <span className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_55.2%,rgba(0,0,0,0.8)_88.9%)]" />

            <div className="relative flex items-center justify-between">
                <span
                    className={`flex items-center justify-center rounded-[6px] px-[12px] py-[8px] text-[12px] font-medium text-white backdrop-blur-[2.5px] lg:text-[14px] ${executor.roleClass}`}
                >
                    {executor.role}
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
                <p className="text-[14px] leading-normal font-medium text-white lg:text-[18px] lg:leading-[24px]">
                    {executor.name}
                </p>
                <div className="flex flex-wrap gap-[8px]">
                    {executor.tags.map((tag) => (
                        <span
                            key={tag}
                            className="flex items-center justify-center rounded-[6px] bg-black/20 px-[12px] py-[8px] text-[12px] font-medium text-white backdrop-blur-[2.5px] lg:text-[14px]"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    )
}

// Figma 52:1110: fon — gold 20% (#eee7db), chevron — gold (#c8a46b).
function Arrow({ direction, onClick, label }) {
    const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="flex size-[42px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] bg-gold/20 text-gold transition-colors hover:bg-gold/35"
        >
            <Icon size={24} strokeWidth={2} />
        </button>
    )
}

export default function PopularExecutors() {
    const [swiper, setSwiper] = useState(null)

    const prev = useCallback(() => swiper?.slidePrev(), [swiper])
    const next = useCallback(() => swiper?.slideNext(), [swiper])

    return (
        <Container as="section" className="flex flex-col gap-[16px] lg:gap-[32px]">
            <header className="flex flex-col gap-[12px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
                <h2 className="font-display text-[24px] leading-[26px] tracking-[0.48px] text-black uppercase lg:text-[48px] lg:leading-none lg:tracking-[0.96px]">
                    Популярные исполнители
                </h2>

                <div className="flex items-center gap-[16px]">
                    <p className="text-[14px] leading-[24px] text-black lg:text-[18px]">
                        Самые востребованные
                        <br />
                        профессионалы платформы
                    </p>
                    <div className="hidden items-center gap-[16px] lg:flex">
                        <Arrow direction="prev" onClick={prev} label="Предыдущие исполнители" />
                        <Arrow direction="next" onClick={next} label="Следующие исполнители" />
                    </div>
                </div>
            </header>

            <Swiper
                modules={[FreeMode]}
                onSwiper={setSwiper}
                freeMode
                slidesPerView="auto"
                spaceBetween={12}
                breakpoints={{
                    1024: { slidesPerView: 4, spaceBetween: 16, freeMode: false },
                }}
                className="w-full"
            >
                {EXECUTORS.map((executor) => (
                    // Mobilda en 284px. Ikki klassli selektor `.swiper-slide{width:100%}`
                    // dan kuchli, lekin inline uslubdan kuchsiz — shuning uchun 1024'dan
                    // boshlab Swiper o'zi hisoblagan en (1340−3×16)/4 = 323px ishlaydi.
                    <SwiperSlide key={executor.id} className="[&.swiper-slide]:w-[284px]">
                        <ExecutorCard executor={executor} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Container>
    )
}
