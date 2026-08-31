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
// Blok balandligi — aynan bitta ekran (`100svh`). Figma 1920×1080 uchun
// chizilgan, lekin noutbukda (1366×768, 1440×900) qat'iy 1080px pastga
// tushib ketardi va slayder boshqaruvi ekrandan chiqib qolardi.
//
// Shuning uchun qat'iy `top` koordinatalari o'rniga tik oqim ishlatiladi:
//   sarlavha → bo'sh joy (1) → «10 000+» → bo'sh joy (6) → pastki qator.
// Nisbat 1:6 Figma'dagi masofalardan olingan (55px va 327px).
//
// Shrift o'lchamlari `clamp(min, Nvh, max)` — 1080px balandlikda Figma
// qiymatiga teng, past ekranda mutanosib kichrayadi va matn rasm ustidagi
// odam bilan ustma-ust tushmaydi.
//
// Mobil (320 kanvas, p-12): kontent 77px dan boshlanadi, pastda 13px.
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
            className={`hero-rise hidden w-[176px] shrink-0 flex-col gap-[clamp(8px,1.5vh,16px)] text-white lg:flex ${className}`}
        >
            <p className="font-display text-[clamp(30px,4.45vh,48px)] leading-none uppercase">
                {value}
            </p>
            <p className="text-[clamp(15px,1.86vh,20px)] leading-normal whitespace-pre-line">
                {label}
            </p>
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
        <section className="relative isolate flex h-[100svh] max-h-[1080px] min-h-[560px] w-full flex-col overflow-hidden bg-[#2f2f2f] lg:min-h-[620px]">
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
                // `swiper/css` `.swiper { position: relative }` beradi va u
                // Tailwind'ning `absolute` klassidan keyin yuklanadi — shuning
                // uchun `!absolute` kerak, aks holda slayder oqimda qolib
                // kontentni pastga surib yuboradi.
                className="!absolute inset-0 !h-full w-full"
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

            {/* ── Kontent ustuni: yuqorida sarlavha, pastda slayder boshqaruvi ──
                Oraliqdagi bo'sh joy `flex-1` bilan taqsimlanadi, shuning uchun
                blok istalgan ekran balandligiga moslashadi. */}
            {/* Yuqoridagi bo'shliq — heder balandligi (mobil 77px, desktop
                112px) ustiga Figma'dagi zaxira. Past ekranda zaxira qisqaradi,
                lekin matn hech qachon heder ostiga kirmaydi. */}
            <div className="pointer-events-none relative z-10 flex min-h-0 flex-1 flex-col pt-[77px] pb-[13px] lg:pt-[clamp(120px,12.6vh,136px)] lg:pb-[clamp(20px,3vh,32px)]">
                <Container className="flex flex-col gap-[16px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
                    <h1
                        style={{ '--rise-delay': '100ms' }}
                        className="hero-rise pointer-events-auto font-display text-[30px] leading-[34px] tracking-[0.6px] text-white uppercase lg:text-[clamp(40px,min(7.4vh,4.3vw),80px)] lg:leading-[1.05] lg:tracking-[1.6px]"
                    >
                        Профессионалы
                        <br />
                        для съёмок
                    </h1>

                    {/* Figma'da o'ng ustun eni 512px — matn aynan 2 qatorga bo'linadi */}
                    <div className="flex flex-col gap-[12px] lg:w-[clamp(320px,34vw,512px)] lg:gap-[clamp(12px,2.2vh,24px)]">
                        <p
                            style={{ '--rise-delay': '220ms' }}
                            className="hero-rise pointer-events-auto text-[16px] leading-[22px] text-white lg:text-[clamp(16px,1.86vh,20px)] lg:leading-[1.3]"
                        >
                            Модели. Фотографы. Видеографы. Площадки. Всё для создания крутого
                            контента.
                        </p>

                        <div
                            style={{ '--rise-delay': '340ms' }}
                            // 1024–1280 da o'ng ustun tor bo'ladi va ikkita tugma
                            // bir qatorga sig'masdi — shu oraliqda ular ustma-ust
                            // turadi, 1280 dan boshlab Figma'dagidek yonma-yon.
                            className="hero-rise pointer-events-auto flex flex-col gap-[12px] xl:flex-row xl:gap-[16px]"
                        >
                            <Button
                                href="/models"
                                variant="gold"
                                iconRight={<ArrowUpRight size={22} strokeWidth={2} className="size-[15px] lg:size-[22px]" />}
                                className="w-full xl:w-auto"
                            >
                                Найти исполнителя
                            </Button>
                            <Button
                                href="/company/projects/new"
                                variant="whiteStroke"
                                className="w-full xl:w-auto"
                            >
                                Разместить проект
                            </Button>
                        </div>
                    </div>
                </Container>

                {/* Figma'da sarlavha ostidan «10 000+» gacha 55px, undan pastki
                    qatorgacha 327px — shu nisbat 1:6 bo'lib saqlanadi. */}
                <div className="min-h-[16px] flex-[1]" />

                <Container className="flex justify-end">
                    <Stat
                        value={HERO_STATS.specialists.value}
                        label={HERO_STATS.specialists.label}
                    />
                </Container>

                <div className="min-h-[24px] flex-[6]" />

            {/* ── Slayder boshqaruvi + «2 000+» ────────────────────────────
                Mobil: o'qlar ekran chetlarida, o'rtada yozuv.
                Desktop: boshqaruv aynan markazda, «2 000+» esa chap chekkada
                oqimdan tashqarida — shunda u markazni surib yubormaydi. */}
                <Container className="relative flex items-center justify-between px-[12px] lg:justify-center lg:gap-[24px]">
                    <Stat
                        value={HERO_STATS.projects.value}
                        label={HERO_STATS.projects.label}
                        className="absolute bottom-0 left-6"
                    />

                    <NavArrow direction="prev" onClick={prev} label="Предыдущее направление" />

                    <div className="flex flex-col items-center justify-center gap-[12px] lg:w-[464px] lg:gap-[clamp(8px,1.5vh,16px)]">
                    <p className="text-[14px] tracking-[0.28px] text-[#c8c8c8] lg:text-[clamp(15px,1.86vh,20px)] lg:tracking-[0.4px]">
                        Выберите направление
                    </p>

                    {/* `key` slayd bilan almashadi — element qayta chiziladi va
                        `hero-swap` animatsiyasi boshidan ijro etiladi. Kechikish
                        rasmning crossfade'iga (FADE_SPEED) hamohang tanlangan. */}
                    <p
                        key={`${active.key}-label`}
                        style={{ '--swap-delay': '150ms' }}
                        className="hero-swap font-display text-[30px] leading-none tracking-[0.6px] whitespace-nowrap text-white uppercase lg:text-[clamp(34px,5.55vh,60px)] lg:tracking-[1.2px]"
                    >
                        {active.label}
                    </p>

                    <Link
                        key={`${active.key}-link`}
                        href={active.href}
                        style={{ '--swap-delay': '230ms' }}
                        className="hero-swap group flex items-center justify-center gap-[12px] border-b border-white p-[12px] text-[14px] font-medium whitespace-nowrap text-white transition-opacity hover:opacity-80 lg:p-[clamp(8px,1.5vh,16px)] lg:text-[clamp(15px,1.67vh,18px)]"
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
                </Container>
            </div>
        </section>
    )
}
