'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import { ChevronDown, ChevronUp } from 'lucide-react'

import 'swiper/css'
import 'swiper/css/pagination'

// ─────────────────────────────────────────────────────────────────────────────
// Eskizlar ustuni + asosiy surat — Модели (138:8731) va Площадки (138:8732)
// anketalarida bir xil ishlatiladi.
//
// Figma desktop 138:8731 / 129:5759 — chapda 113px eskizlar ustuni (balandligi
// 600px, ortiqchasi kesiladi), o'ngda 425×600 asosiy surat, orasi 16px.
//
// Eskiz elementi (129:6178): p-4, radius 6, ichida 114px balandlikdagi rasm.
// Aktiv eskiz — **gold ramka** (fon emas), qolganlarida ramka shaffof, shuning
// uchun barcha elementlar bir xil o'lchamda qoladi va ro'yxat siljimaydi.
//
// Ustun ostida gradient (129:5816 — 211px, 22% dan light-white'ga) va uning
// ustida markazda strelka (129:5818 — 24×24, bg rgba(0,0,0,0.2), oq belgi).
// Pastga siljitilganda xuddi shunday gradient va strelka tepada ham paydo
// bo'ladi. Lenta chekli: chetiga yetganda tegishli strelka yo'qoladi.
//
// Figma mobil 360:24036 — to'liq kenglikdagi slayder, pastda nuqtalar.
// ─────────────────────────────────────────────────────────────────────────────

// Eskiz balandligi: 1px ramka + 4px padding + 114px rasm + 4px + 1px = 124px.
const THUMB_HEIGHT = 124
const THUMB_GAP = 8
const STEP = THUMB_HEIGHT + THUMB_GAP
const COLUMN_HEIGHT = 600

export default function DetailGallery({ photos, alt }) {
    const [active, setActive] = useState(0)

    // Lenta necha piksel yuqoriga surilgani. 0 — eng tepa, `maxOffset` — eng past.
    const [offset, setOffset] = useState(0)
    const [animated, setAnimated] = useState(true)

    // `wheel` ishlovchisi passiv bo'lmagan native listener orqali ulanadi,
    // shuning uchun joriy qiymat ref'da ham saqlanadi (eskirgan closure'siz).
    const offsetRef = useRef(0)
    const columnRef = useRef(null)

    // Lentaning to'liq balandligidan ustun balandligini ayirsak — yurish yo'li.
    const maxOffset = Math.max(0, photos.length * STEP - THUMB_GAP - COLUMN_HEIGHT)

    const shiftBy = useCallback(
        (delta, withAnimation) => {
            const next = Math.min(maxOffset, Math.max(0, offsetRef.current + delta))
            if (next === offsetRef.current) return false
            offsetRef.current = next
            setAnimated(withAnimation)
            setOffset(next)
            return true
        },
        [maxOffset],
    )

    // Sichqoncha g'ildiragi ustun ustida — lenta ikki tomonga ham suriladi.
    // Chetiga yetganda hodisa to'silmaydi va sahifa odatdagidek scroll bo'ladi.
    useEffect(() => {
        const el = columnRef.current
        if (!el || maxOffset === 0) return

        function onWheel(e) {
            if (shiftBy(e.deltaY, false)) e.preventDefault()
        }

        el.addEventListener('wheel', onWheel, { passive: false })
        return () => el.removeEventListener('wheel', onWheel)
    }, [shiftBy, maxOffset])

    const canScrollUp = offset > 0
    const canScrollDown = offset < maxOffset

    return (
        <>
            {/* ── Mobil: slayder ──────────────────────────────────────────── */}
            <div className="lg:hidden">
                <Swiper
                    modules={[Pagination]}
                    pagination={{ clickable: true }}
                    slidesPerView={1}
                    spaceBetween={12}
                    className="model-gallery-swiper w-full overflow-hidden rounded-[6px]"
                >
                    {photos.map((src, i) => (
                        <SwiperSlide key={i}>
                            <div className="relative h-[400px] w-full bg-[#d9d9d9]">
                                <Image
                                    src={src}
                                    alt={alt}
                                    fill
                                    priority={i === 0}
                                    sizes="100vw"
                                    className="object-cover"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* ── Desktop: eskizlar + asosiy surat ────────────────────────── */}
            <div className="hidden shrink-0 items-center gap-[16px] lg:flex">
                <div
                    ref={columnRef}
                    className="relative h-[600px] w-[113px] shrink-0 overflow-hidden overscroll-contain"
                >
                    <div
                        className={`flex flex-col gap-[8px] ${
                            animated
                                ? 'transition-transform duration-[500ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]'
                                : ''
                        }`}
                        style={{ transform: `translate3d(0, -${offset}px, 0)` }}
                    >
                        {photos.map((src, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setActive(i)}
                                aria-label={`Фото ${i + 1}`}
                                aria-pressed={i === active}
                                className={`flex w-full shrink-0 cursor-pointer items-center rounded-[6px] border p-[4px] transition-colors duration-200 ${
                                    i === active
                                        ? 'border-gold'
                                        : 'border-transparent hover:border-gold/40'
                                }`}
                            >
                                <span className="relative block h-[114px] w-full overflow-hidden rounded-[6px] bg-[#d9d9d9]">
                                    <Image src={src} alt="" fill sizes="113px" className="object-cover" />
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Tepadagi gradient + strelka — faqat pastga surilgan holatda */}
                    {canScrollUp && (
                        <>
                            <span
                                aria-hidden
                                className="pointer-events-none absolute inset-x-0 top-0 h-[211px] bg-gradient-to-t from-light-white/0 from-[22%] to-light-white"
                            />
                            <button
                                type="button"
                                onClick={() => shiftBy(-STEP, true)}
                                aria-label="Предыдущие фото"
                                className="absolute top-0 left-1/2 flex size-[24px] -translate-x-1/2 cursor-pointer items-center justify-center rounded-[6px] bg-black/20 text-white transition-colors hover:bg-black/35"
                            >
                                <ChevronUp size={16} strokeWidth={2} />
                            </button>
                        </>
                    )}

                    {/* Pastdagi gradient + strelka (Figma 129:5816 / 129:5818) */}
                    {canScrollDown && (
                        <>
                            <span
                                aria-hidden
                                className="pointer-events-none absolute inset-x-0 bottom-0 h-[211px] bg-gradient-to-b from-light-white/0 from-[22%] to-light-white"
                            />
                            <button
                                type="button"
                                onClick={() => shiftBy(STEP, true)}
                                aria-label="Показать другие фото"
                                className="absolute bottom-0 left-1/2 flex size-[24px] -translate-x-1/2 cursor-pointer items-center justify-center rounded-[6px] bg-black/20 text-white transition-colors hover:bg-black/35"
                            >
                                <ChevronDown size={16} strokeWidth={2} />
                            </button>
                        </>
                    )}
                </div>

                {/* Asosiy surat: barcha kadrlar ustma-ust turadi va tanlanganda
                    yumshoq almashadi (eskiz bosilganda darhol ko'rinadi). */}
                <div className="relative h-[600px] w-[425px] shrink-0 overflow-hidden rounded-[6px] bg-[#d9d9d9]">
                    {photos.map((src, i) => (
                        <Image
                            key={i}
                            src={src}
                            alt={i === active ? alt : ''}
                            fill
                            priority={i === 0}
                            sizes="425px"
                            className={`object-cover transition-opacity duration-500 ease-out ${
                                i === active ? 'opacity-100' : 'opacity-0'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}
