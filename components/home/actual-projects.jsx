'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { ArrowUpRight } from 'lucide-react'
import Button from '@/components/ui/button'
import Container from '@/components/ui/container'
import ProjectCard from '@/components/projects/project-card'
import { useApi } from '@/lib/use-api'
import * as site from '@/lib/api/site'
import { projectCard } from '@/lib/adapters'

import 'swiper/css'
import 'swiper/css/free-mode'

// ─────────────────────────────────────────────────────────────────────────────
// Figma: «Актуальные проекты» — desktop 52:1048, mobil 373:17103.
// Desktop: 4 ta teng kartochka bir qatorda, sarlavha yonida «Все проекты».
// Mobil: gorizontal svayp, tugma pastda to'liq kenglikda.
// ─────────────────────────────────────────────────────────────────────────────
// Eng yangi e'lonlar (backend/site.md → GET /site/projects?sort=new).
const fetchProjects = () => site.projects({ sort: 'new', page_size: 4 })

export default function ActualProjects() {
    const { data } = useApi(fetchProjects)
    const projects = (data?.items || []).map(projectCard)

    // Backendda e'lon bo'lmasa butun blok chizilmaydi.
    if (projects.length === 0) return null

    return (
        <Container as="section" className="flex flex-col gap-[16px] lg:gap-[32px]">
            <header className="flex items-center justify-between gap-[16px]">
                <h2 className="font-display text-[24px] leading-[26px] tracking-[0.48px] text-black uppercase lg:text-[48px] lg:leading-none lg:tracking-[0.96px]">
                    Актуальные проекты
                </h2>

                {/* Button'ning bazaviy `inline-flex` klassi CSS'da `hidden`dan
                    keyin turadi, shuning uchun ko'rinishni tashqi o'ram
                    boshqaradi (Figma mobil 353:20899 — sarlavha yonida tugma yo'q). */}
                <span className="hidden lg:inline-flex">
                    <Button
                        href="/projects"
                        variant="gold"
                        iconRight={<ArrowUpRight size={22} strokeWidth={2} className="size-[15px] lg:size-[22px]" />}
                    >
                        Все проекты
                    </Button>
                </span>
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
                    {projects.map((project) => (
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
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} className="min-w-0 flex-1" />
                ))}
            </div>

            <Button
                href="/projects"
                variant="gold"
                iconRight={<ArrowUpRight size={22} strokeWidth={2} className="size-[15px] lg:size-[22px]" />}
                full
                className="lg:hidden"
            >
                Все проекты
            </Button>
        </Container>
    )
}
