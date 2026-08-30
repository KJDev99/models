'use client'

import React, { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Keyboard } from 'swiper/modules'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '@/components/ui/button'
import Container from '@/components/ui/container'
import { HERO_SLIDES, HERO_STATS } from '@/components/home/home-data'

import 'swiper/css'
import 'swiper/css/effect-fade'

// ─────────────────────────────────────────────────────────────────────────────
// Figma: «animate» 81:1781 (desktop 1920×1080) va 353:20607 (mobil 320×824).
// Slaydlar: 52:1338 Фотографы · 52:1400 Видеографы · 52:1463 Площадки.
//
// Slayd rasmi Figma'dan tayyor kompozitsiya bo'lib keladi — blur(5px) qilingan
// studiya foni, qora 20% qatlam va kesib olingan odam allaqachon bitta faylga
// singdirilgan. Shu sababli bu yerda blur ham, qoraytiruvchi qatlam ham YO'Q.
//
// Desktop koordinatalari (1920 kanvas, kontent 1340px, chetlari 290px):
//   sarlavha bloki  top 136
//   «10 000+»       top 359, o'ng chekka, en 176
//   slayder boshq.  markazi top 895
//   «2 000+»        top 853, chap chekka, en 176
// Mobil (320 kanvas, p-12): kontent 77px dan boshlanadi, boshqaruv bottom 13.
//
// Animatsiyalar globals.css'da: `hero-kenburns`, `hero-rise`, `hero-swap`.
// ─────────────────────────────────────────────────────────────────────────────

// Autoplay davri — globals.css'dagi `hero-kenburns` animatsiyasi bilan bir xil.
const SLIDE_DURATION = 7000
const FADE_SPEED = 700

function NavArrow({ direction, onClick, label }) {
    const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] bg-white/10 text-white backdrop-blur-[2.5px] transition-[background-color,transform] duration-300 hover:scale-105 hover:bg-white/20 active:scale-95 lg:size-[42px]"
        >
            <Icon size={24} strokeWidth={2} />
        </button>
    )
}

// Statistika ustuni (Figma 81:1687 / 81:1690) — faqat 1920 maketda ko'rinadi.
function Stat({ value, label, className = '' }) {
    return (
        <div
            style={{ '--rise-delay': '500ms' }}
            className={`hero-rise hidden w-[176px] flex-col gap-[16px] text-white lg:flex ${className}`}
        >
            <p className="font-display text-[48px] leading-none uppercase">{value}</p>
            <p className="text-[20px] leading-normal whitespace-pre-line">{label}</p>
        </div>
    )
}

export default function HeroSlider() {
    const [swiper, setSwiper] = useState(null)
    const [index, setIndex] = useState(0)

    const active = HERO_SLIDES[index] || HERO_SLIDES[0]

    const prev = useCallback(() => swiper?.slidePrev(), [swiper])
    const next = useCallback(() => swiper?.slideNext(), [swiper])

    return (
        <section className="relative isolate h-[824px] w-full overflow-hidden bg-[#2f2f2f] lg:h-[1080px]">
            {/* ── Slayd rasmlari ───────────────────────────────────────────── */}
            <Swiper
                modules={[EffectFade, Autoplay, Keyboard]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={FADE_SPEED}
                loop
                slidesPerView={1}
                autoplay={{ delay: SLIDE_DURATION, disableOnInteraction: false }}
                keyboard={{ enabled: true }}
                onSwiper={setSwiper}
                onSlideChange={(s) => setIndex(s.realIndex)}
                className="absolute inset-0 !h-full w-full"
            >
                {HERO_SLIDES.map((slide, i) => (
                    <SwiperSlide key={slide.key}>
                        <div className="relative h-full w-full overflow-hidden">
                            {/* Mobil kompozitsiya — aynan 320×824 */}
                            <Image
                                src={slide.imageMobile}
                                alt={slide.label}
                                fill
                                priority={i === 0}
                                sizes="100vw"
                                quality={95}
                                className="hero-kenburns object-cover object-center lg:hidden"
                            />
                            {/* Desktop kompozitsiya — aynan 1920×1080 */}
                            <Image
                                src={slide.image}
                                alt={slide.label}
                                fill
                                priority={i === 0}
                                sizes="100vw"
                                quality={95}
                                className="hero-kenburns hidden object-cover object-center lg:block"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* ── Sarlavha bloki: mobil 77px, desktop 136px ────────────────── */}
            <div className="pointer-events-none absolute inset-x-0 top-[77px] z-10 lg:top-[136px]">
                <Container className="flex flex-col gap-[16px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
                    <h1
                        style={{ '--rise-delay': '100ms' }}
                        className="hero-rise pointer-events-auto font-display text-[30px] leading-[34px] tracking-[0.6px] text-white uppercase lg:text-[80px] lg:leading-[84px] lg:tracking-[1.6px]"
                    >
                        Профессионалы
                        <br />
                        для съёмок
                    </h1>

                    {/* Figma'da o'ng ustun eni 512px — matn aynan 2 qatorga bo'linadi */}
                    <div className="flex flex-col gap-[12px] lg:w-[512px] lg:gap-[24px]">
                        <p
                            style={{ '--rise-delay': '220ms' }}
                            className="hero-rise pointer-events-auto text-[16px] leading-[22px] text-white lg:text-[20px] lg:leading-[26px]"
                        >
                            Модели. Фотографы. Видеографы. Площадки. Всё для создания крутого
                            контента.
                        </p>

                        <div
                            style={{ '--rise-delay': '340ms' }}
                            className="hero-rise pointer-events-auto flex flex-col gap-[12px] lg:flex-row lg:gap-[16px]"
                        >
                            <Button
                                href="/models"
                                variant="gold"
                                iconRight={<ArrowUpRight size={22} strokeWidth={2} className="size-[15px] lg:size-[22px]" />}
                                className="w-full lg:w-auto"
                            >
                                Найти исполнителя
                            </Button>
                            <Button
                                href="/company/projects/new"
                                variant="whiteStroke"
                                className="w-full lg:w-auto"
                            >
                                Разместить проект
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>

            {/* ── «10 000+» — o'ng chekka, top 359 ─────────────────────────── */}
            <div className="pointer-events-none absolute inset-x-0 top-[359px] z-10">
                <Container className="flex justify-end">
                    <Stat
                        value={HERO_STATS.specialists.value}
                        label={HERO_STATS.specialists.label}
                    />
                </Container>
            </div>

            {/* ── «2 000+» — chap chekka, top 853 ──────────────────────────── */}
            <div className="pointer-events-none absolute inset-x-0 top-[853px] z-10">
                <Container>
                    <Stat value={HERO_STATS.projects.value} label={HERO_STATS.projects.label} />
                </Container>
            </div>

            {/* ── Slayder boshqaruvi ───────────────────────────────────────
                Mobil: pastda, chetlaridan 12px, o'qlar chetga tayangan.
                Desktop: markazda, blok markazi top 895. */}
            <div className="absolute right-0 bottom-[13px] left-0 z-10 flex items-center justify-between px-[12px] lg:top-[895px] lg:right-auto lg:bottom-auto lg:left-1/2 lg:w-auto lg:-translate-x-1/2 lg:-translate-y-1/2 lg:justify-center lg:gap-[24px] lg:px-0">
                <NavArrow direction="prev" onClick={prev} label="Предыдущее направление" />

                <div className="flex flex-col items-center justify-center gap-[12px] lg:w-[464px] lg:gap-[16px]">
                    <p className="text-[14px] tracking-[0.28px] text-[#c8c8c8] lg:text-[20px] lg:tracking-[0.4px]">
                        Выберите направление
                    </p>

                    {/* `key` slayd bilan almashadi — element qayta chiziladi va
                        `hero-swap` animatsiyasi boshidan ijro etiladi. Kechikish
                        rasmning crossfade'iga (FADE_SPEED) hamohang tanlangan. */}
                    <p
                        key={`${active.key}-label`}
                        style={{ '--swap-delay': '150ms' }}
                        className="hero-swap font-display text-[30px] leading-none tracking-[0.6px] whitespace-nowrap text-white uppercase lg:text-[60px] lg:tracking-[1.2px]"
                    >
                        {active.label}
                    </p>

                    <Link
                        key={`${active.key}-link`}
                        href={active.href}
                        style={{ '--swap-delay': '230ms' }}
                        className="hero-swap group flex items-center justify-center gap-[12px] border-b border-white p-[12px] text-[14px] font-medium whitespace-nowrap text-white transition-opacity hover:opacity-80 lg:p-[16px] lg:text-[18px]"
                    >
                        {active.linkText}
                        {/* Figma: mobil 17px (353:20690), desktop 22px (75:222) */}
                        <ArrowUpRight
                            size={22}
                            strokeWidth={2}
                            className="size-[17px] transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px] lg:size-[22px]"
                        />
                    </Link>
                </div>

                <NavArrow direction="next" onClick={next} label="Следующее направление" />
            </div>
        </section>
    )
}
