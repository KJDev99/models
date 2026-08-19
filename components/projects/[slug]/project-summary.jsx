'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Heart, MapPin, User } from 'lucide-react'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'

// ─────────────────────────────────────────────────────────────────────────────
// Loyihaning asosiy kartochkasi — Figma 145:10659 (770×600, oq, radius 6, p-24).
//
// Tuzilishi:
//   nom + yurakcha → parametrlar (calendar · marker-pin-01 · user-03)
//   «О проекте» matni
//   «Кого ищем» — light-white chiplar
//   pastda: narx + «Подать заявку» va kompaniya kartasi (Figma 171:2539)
// ─────────────────────────────────────────────────────────────────────────────

function Meta({ icon: Icon, children }) {
    return (
        <span className="flex items-center gap-[8px] text-[14px] font-medium whitespace-nowrap text-grey lg:text-[16px]">
            <Icon
                size={24}
                strokeWidth={1.75}
                className="size-[20px] shrink-0 text-gold lg:size-[24px]"
            />
            {children}
        </span>
    )
}

function SectionTitle({ children }) {
    return (
        <h2 className="font-sans text-[16px] leading-normal font-bold text-black lg:text-[18px]">
            {children}
        </h2>
    )
}

export default function ProjectSummary({ project, onApply }) {
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const liked = items.some((i) => i.type === FAVORITE_TYPES.PROJECT && i.id === project.slug)

    function onLike() {
        toggle({
            type: FAVORITE_TYPES.PROJECT,
            id: project.slug,
            slug: project.slug,
            title: project.title,
            image: project.image,
        })
    }

    return (
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
            {/* Yuqorigi guruh: nom, «О проекте» va «Кого ищем» (Figma 145:11076) */}
            <div className="flex flex-col gap-[16px] lg:gap-[24px]">
                {/* Nom va parametrlar (Figma 145:11077, gap 16) */}
                <div className="flex flex-col gap-[16px]">
                    <div className="flex items-center justify-between gap-[16px]">
                        <h1 className="font-sans text-[18px] leading-[24px] font-medium text-black lg:text-[32px] lg:leading-[39px]">
                            {project.title}
                        </h1>

                        <button
                            type="button"
                            onClick={onLike}
                            aria-label={liked ? 'Убрать из избранного' : 'В избранное'}
                            className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] ui-icon-btn backdrop-blur-[2.5px]"
                        >
                            <Heart
                                size={24}
                                strokeWidth={2}
                                className={liked ? 'fill-current' : ''}
                            />
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px]">
                        <Meta icon={Calendar}>{project.date}</Meta>
                        <Meta icon={MapPin}>{project.city}</Meta>
                        <Meta icon={User}>{project.need}</Meta>
                    </div>
                </div>

                {/* О проекте */}
                <div className="flex flex-col gap-[16px]">
                    <SectionTitle>О проекте</SectionTitle>
                    <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                        {project.about}
                    </p>
                </div>

                {/* Кого ищем — light-white chiplar (Figma 145:10686) */}
                <div className="flex flex-col gap-[16px]">
                    <SectionTitle>Кого ищем</SectionTitle>
                    <div className="flex flex-wrap gap-[8px] lg:gap-[16px]">
                        {project.requirements.map((item) => (
                            <span
                                key={item}
                                className="flex items-center justify-center rounded-[6px] bg-light-white px-[12px] py-[8px] text-[12px] font-medium whitespace-nowrap text-grey lg:text-[16px]"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Narx + «Подать заявку» va kompaniya (Figma 145:11166) */}
            <div className="flex flex-col gap-[16px] lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-[12px] sm:flex-row sm:items-center sm:gap-[24px]">
                    <p className="text-[18px] leading-[24px] font-bold whitespace-nowrap text-black lg:text-[20px]">
                        {project.price}
                    </p>

                    <button
                        type="button"
                        onClick={onApply}
                        className="flex w-full cursor-pointer items-center justify-center rounded-[6px] border border-gold px-[24px] py-[12px] text-[14px] font-medium whitespace-nowrap text-gold transition-colors hover:bg-gold hover:text-white sm:w-fit lg:py-[16px] lg:text-[18px]"
                    >
                        Подать заявку
                    </button>
                </div>

                <Link
                    href={project.company.href}
                    className="flex items-center gap-[12px] rounded-[6px] bg-light-white p-[16px] transition-colors hover:bg-gold/10 lg:w-[224px]"
                >
                    <span className="relative block size-[32px] shrink-0 overflow-hidden rounded-full bg-white">
                        <Image
                            src={project.company.logo}
                            alt={project.company.name}
                            fill
                            sizes="32px"
                            className="object-contain"
                        />
                    </span>
                    <span className="flex min-w-0 flex-col gap-[2px]">
                        <span className="truncate text-[16px] leading-[20px] font-medium text-black">
                            {project.company.name}
                        </span>
                        <span className="truncate text-[12px] leading-[15px] text-grey">
                            {project.company.more}
                        </span>
                    </span>
                </Link>
            </div>
        </div>
    )
}
