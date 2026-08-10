'use client'

import React, { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { Calendar, ChevronRight, Heart, MapPin, Ruler, Scale } from 'lucide-react'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'

import 'swiper/css'
import 'swiper/css/free-mode'

// ─────────────────────────────────────────────────────────────────────────────
// Ro'yxat («список») ko'rinishidagi anketa qatori.
// Figma: 96:4294 (desktop 1001×358) va 360:22463 ichidagi mobil variant.
//
// Desktop: avatar 94×94 → ism/parametrlar/teglar → o'ngda «Пригласить в проект»
// va yurakcha; pastda 200px balandlikdagi surat lentasi.
// Mobil: avatar+ism+yurakcha bir qatorda, parametrlar ikki qatorda,
// lenta va tugma pastda.
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

export default function ModelRowCard({ model }) {
    const [swiper, setSwiper] = useState(null)
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const liked = items.some((i) => i.type === FAVORITE_TYPES.EXECUTOR && i.id === model.id)

    const next = useCallback(() => swiper?.slideNext(), [swiper])

    const [visibleTags, hiddenTags] = [model.tags.slice(0, 3), model.tags.slice(3)]

    function onLike() {
        toggle({
            type: FAVORITE_TYPES.EXECUTOR,
            id: model.id,
            slug: model.slug,
            title: model.name,
            image: model.image,
        })
    }

    return (
        <article className="flex flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[16px] lg:p-[24px]">
            <div className="flex flex-col gap-[12px] lg:flex-row lg:items-start lg:gap-[16px]">
                {/* Avatar + ism: mobilda bir qatorda, yurakcha o'ng chekkada */}
                <div className="flex items-center gap-[12px] lg:contents">
                    <Link
                        href={`/models/${model.slug}`}
                        className="relative block size-[40px] shrink-0 overflow-hidden rounded-full bg-[#d9d9d9] lg:size-[94px] lg:rounded-[6px]"
                    >
                        <Image
                            src={model.image}
                            alt={model.name}
                            fill
                            sizes="94px"
                            className="object-cover"
                        />
                    </Link>

                    <Link
                        href={`/models/${model.slug}`}
                        className="min-w-0 flex-1 truncate text-[16px] font-medium text-black transition-colors hover:text-gold lg:hidden"
                    >
                        {model.name}
                    </Link>

                    <button
                        type="button"
                        onClick={onLike}
                        aria-label={liked ? 'Убрать из избранного' : 'В избранное'}
                        className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] bg-gold/15 transition-colors hover:bg-gold/30 lg:hidden"
                    >
                        <Heart
                            size={24}
                            strokeWidth={2}
                            className={liked ? 'fill-gold text-gold' : 'text-gold'}
                        />
                    </button>
                </div>

                {/* Ism, parametrlar va teglar */}
                <div className="flex min-w-0 flex-1 flex-col gap-[12px] lg:gap-[12px]">
                    <Link
                        href={`/models/${model.slug}`}
                        className="hidden text-[16px] font-medium text-black transition-colors hover:text-gold lg:block"
                    >
                        {model.name}
                    </Link>

                    <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px]">
                        <Meta icon={Calendar}>{model.age} лет</Meta>
                        <Meta icon={Ruler}>{model.height} см</Meta>
                        <Meta icon={Scale}>{model.weight} кг</Meta>
                        <Meta icon={MapPin}>{model.city}</Meta>
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
                        href={`/models/${model.slug}?invite=1`}
                        className="flex items-center justify-center rounded-[6px] border border-gold px-[24px] py-[12px] text-[14px] font-medium whitespace-nowrap text-gold transition-colors hover:bg-gold hover:text-white"
                    >
                        Пригласить в проект
                    </Link>

                    <button
                        type="button"
                        onClick={onLike}
                        aria-label={liked ? 'Убрать из избранного' : 'В избранное'}
                        className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] bg-gold/15 transition-colors hover:bg-gold/30"
                    >
                        <Heart
                            size={24}
                            strokeWidth={2}
                            className={liked ? 'fill-gold text-gold' : 'text-gold'}
                        />
                    </button>
                </div>
            </div>

            {/* Surat lentasi — Figma 96:4869 (953×200) */}
            <div className="relative">
                <Swiper
                    modules={[FreeMode]}
                    onSwiper={setSwiper}
                    freeMode
                    slidesPerView="auto"
                    spaceBetween={16}
                    className="model-gallery w-full"
                >
                    {model.gallery.map((src, i) => (
                        <SwiperSlide key={`${model.id}-${i}`}>
                            <Link
                                href={`/models/${model.slug}`}
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
                href={`/models/${model.slug}?invite=1`}
                className="flex items-center justify-center rounded-[6px] border border-gold px-[24px] py-[12px] text-[14px] font-medium text-gold transition-colors hover:bg-gold hover:text-white lg:hidden"
            >
                Пригласить в проект
            </Link>
        </article>
    )
}
