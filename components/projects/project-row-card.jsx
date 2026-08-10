'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Banknote, Calendar, Heart, MapPin, User } from 'lucide-react'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'

// ─────────────────────────────────────────────────────────────────────────────
// Ro'yxat («список») ko'rinishidagi loyiha qatori.
// Figma: 145:11618 (desktop, 1001×332) va 373:17675 ichidagi mobil variant.
//
// Tuzilishi: logotip + nom va parametrlar (calendar · marker-pin-01 · user-03 ·
// bank-note-01), o'ng chekkada «Подать заявку» va yurakcha; ostida qisqacha
// tavsif, «Кого ищем» chiplari va kompaniya yo'lakchasi.
// ─────────────────────────────────────────────────────────────────────────────

// Ro'yxatda beshta talab ko'rinadi, qolgani «+N» bo'lib yig'iladi (Figma 151:11959).
const VISIBLE_REQUIREMENTS = 5

function Meta({ icon: Icon, children }) {
    return (
        <span className="flex items-center gap-[8px] text-[14px] whitespace-nowrap text-black">
            <Icon size={17} strokeWidth={1.75} className="shrink-0 text-gold" />
            {children}
        </span>
    )
}

export default function ProjectRowCard({ project }) {
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const liked = items.some((i) => i.type === FAVORITE_TYPES.PROJECT && i.id === project.id)

    const href = `/projects/${project.slug}`
    const shown = project.requirements.slice(0, VISIBLE_REQUIREMENTS)
    const rest = project.requirements.length - shown.length

    function onLike() {
        toggle({
            type: FAVORITE_TYPES.PROJECT,
            id: project.id,
            slug: project.slug,
            title: project.title,
            image: project.image,
        })
    }

    return (
        <article className="flex flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:p-[24px]">
            <div className="flex flex-col gap-[12px] lg:flex-row lg:items-start lg:gap-[16px]">
                {/* Logotip va nom: mobilda bir qatorda, yurakcha o'ng chekkada */}
                <div className="flex items-center gap-[12px] lg:contents">
                    <Link
                        href={href}
                        className="relative block size-[40px] shrink-0 overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:size-[49px]"
                    >
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="49px"
                            className="object-cover"
                        />
                    </Link>

                    <Link
                        href={href}
                        className="min-w-0 flex-1 truncate text-[16px] font-medium text-black transition-colors hover:text-gold lg:hidden"
                    >
                        {project.title}
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

                {/* Nom va parametrlar */}
                <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
                    <Link
                        href={href}
                        className="hidden text-[16px] font-medium text-black transition-colors hover:text-gold lg:block"
                    >
                        {project.title}
                    </Link>

                    <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px]">
                        <Meta icon={Calendar}>{project.date}</Meta>
                        <Meta icon={MapPin}>{project.city}</Meta>
                        <Meta icon={User}>{project.need}</Meta>
                        <Meta icon={Banknote}>{project.price}</Meta>
                    </div>
                </div>

                {/* Desktop: tugma va yurakcha o'ng chekkada */}
                <div className="hidden shrink-0 items-center gap-[16px] lg:flex">
                    <Link
                        href={href}
                        className="flex items-center justify-center rounded-[6px] border border-gold px-[24px] py-[12px] text-[14px] font-medium whitespace-nowrap text-gold transition-colors hover:bg-gold hover:text-white"
                    >
                        Подать заявку
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

            <p className="line-clamp-3 text-[14px] leading-[20px] text-grey lg:line-clamp-2 lg:text-[16px] lg:leading-[22px]">
                {project.summary}
            </p>

            {/* Кого ищем — Figma 151:11941 */}
            <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                <p className="text-[14px] font-bold text-black lg:text-[16px]">Кого ищем</p>

                <div className="flex flex-wrap gap-[8px] lg:gap-[16px]">
                    {shown.map((item) => (
                        <span
                            key={item}
                            className="flex items-center justify-center rounded-[6px] bg-light-white px-[12px] py-[8px] text-[12px] font-medium whitespace-nowrap text-grey lg:text-[16px]"
                        >
                            {item}
                        </span>
                    ))}

                    {rest > 0 && (
                        <span className="flex items-center justify-center rounded-[6px] bg-light-white px-[12px] py-[8px] text-[12px] font-medium whitespace-nowrap text-grey lg:text-[16px]">
                            +{rest}
                        </span>
                    )}
                </div>
            </div>

            {/* Kompaniya yo'lakchasi — Figma 151:11963 */}
            <Link
                href={project.company.href}
                className="flex items-center gap-[12px] rounded-[6px] bg-light-white p-[12px] transition-colors hover:bg-gold/10 lg:p-[16px]"
            >
                <span className="relative block size-[32px] shrink-0 overflow-hidden rounded-full bg-white lg:size-[39px]">
                    <Image
                        src={project.company.logo}
                        alt={project.company.name}
                        fill
                        sizes="39px"
                        className="object-contain"
                    />
                </span>

                <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                    <span className="truncate text-[14px] leading-[20px] font-medium text-black lg:text-[16px]">
                        {project.company.name}
                    </span>
                    <span className="truncate text-[12px] leading-[15px] text-grey">
                        {project.company.note}
                    </span>
                </span>

                <span className="hidden shrink-0 text-[12px] whitespace-nowrap text-grey lg:block">
                    {project.company.projects}
                </span>
            </Link>

            {/* Mobil: tugma pastda, to'liq kenglikda */}
            <Link
                href={href}
                className="flex items-center justify-center rounded-[6px] border border-gold px-[24px] py-[12px] text-[14px] font-medium text-gold transition-colors hover:bg-gold hover:text-white lg:hidden"
            >
                Подать заявку
            </Link>
        </article>
    )
}
