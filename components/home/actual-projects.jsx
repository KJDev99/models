'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { ArrowUpRight } from 'lucide-react'
import Button from '@/components/ui/button'
import Container from '@/components/ui/container'
import ProjectCard from '@/components/home/project-card'
import { PROJECTS } from '@/components/home/home-data'

import 'swiper/css'
import 'swiper/css/free-mode'

// ─────────────────────────────────────────────────────────────────────────────
// Figma: «Актуальные проекты» — desktop 52:1048, mobil 373:17103.
// Desktop: 4 ta teng kartochka bir qatorda, sarlavha yonida «Все проекты».
// Mobil: gorizontal svayp, tugma pastda to'liq kenglikda.
// ─────────────────────────────────────────────────────────────────────────────
export default function ActualProjects() {
    return (
        <Container as="section" className="flex flex-col gap-[16px] lg:gap-[32px]">
            <header className="flex items-center justify-between gap-[16px]">
                <h2 className="font-display text-[24px] leading-[26px] tracking-[0.48px] text-black uppercase lg:text-[48px] lg:leading-none lg:tracking-[0.96px]">
                    Актуальные проекты
                </h2>

                <Button
                    href="/projects"
                    variant="gold"
                    iconRight={<ArrowUpRight size={24} strokeWidth={2} />}
                    className="hidden lg:inline-flex"
                >
                    Все проекты
                </Button>
            </header>

            {/* Mobil — svayp.
                Swiper CSS Tailwind'dan keyin yuklanadi va `.swiper{display:block}`
                `lg:hidden`ni bosib ketadi, shuning uchun ko'rinishni tashqi o'ram
                boshqaradi — aks holda desktopda ikkita qator chiqadi. */}
            <div className="lg:hidden">
                <Swiper
                    modules={[FreeMode]}
                    freeMode
                    slidesPerView="auto"
                    spaceBetween={12}
                    className="w-full"
                >
                    {PROJECTS.map((project) => (
                        // `.swiper-slide{width:100%}` ni yengish uchun ikki klassli selektor
                        <SwiperSlide
                            key={project.id}
                            className="[&.swiper-slide]:w-[284px]"
                        >
                            <ProjectCard project={project} className="h-full" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Desktop — 4 ta ustun */}
            <div className="hidden gap-[16px] lg:flex">
                {PROJECTS.map((project) => (
                    <ProjectCard key={project.id} project={project} className="min-w-0 flex-1" />
                ))}
            </div>

            <Button
                href="/projects"
                variant="gold"
                iconRight={<ArrowUpRight size={24} strokeWidth={2} />}
                full
                className="lg:hidden"
            >
                Все проекты
            </Button>
        </Container>
    )
}
