'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import Button from '@/components/ui/button'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'

// ─────────────────────────────────────────────────────────────────────────────
// Figma: «Актуальные проекты» kartochkasi — desktop 52:1091, mobil 373:17107.
// Yuqorida rasm (200px) + yurakcha va narx yorlig'i, ostida oq blok.
// ─────────────────────────────────────────────────────────────────────────────
export default function ProjectCard({ project, className = '' }) {
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const liked = items.some((i) => i.type === FAVORITE_TYPES.PROJECT && i.id === project.id)

    function onLike(e) {
        e.preventDefault()
        toggle({
            type: FAVORITE_TYPES.PROJECT,
            id: project.id,
            slug: project.slug,
            title: project.title,
            image: project.image,
        })
    }

    return (
        <article className={`flex flex-col overflow-hidden rounded-[6px] ${className}`}>
            {/* Rasm bloki */}
            <div className="relative h-[200px] w-full shrink-0 rounded-[6px] bg-[#787878]">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 284px, 323px"
                    className="rounded-[6px] object-cover"
                />

                <button
                    type="button"
                    onClick={onLike}
                    aria-label={liked ? 'Убрать из избранного' : 'В избранное'}
                    className="absolute top-[12px] right-[12px] flex cursor-pointer items-center rounded-[6px] bg-black/30 p-[4px] transition-colors hover:bg-black/50"
                >
                    <Heart
                        size={24}
                        strokeWidth={2}
                        className={liked ? 'fill-gold text-gold' : 'text-white'}
                    />
                </button>

                <span className="absolute right-0 bottom-0 flex items-center justify-center rounded-tl-[6px] bg-white px-[12px] py-[8px] text-[12px] font-medium text-black uppercase lg:text-[14px]">
                    {project.price}
                </span>
            </div>

            {/* Matn bloki */}
            <div className="flex flex-1 flex-col gap-[10px] bg-white p-[12px] lg:p-[16px]">
                <Link
                    href={`/projects/${project.slug}`}
                    className="text-[14px] leading-[20px] font-semibold text-black transition-colors hover:text-gold lg:text-[18px] lg:leading-[24px]"
                >
                    {project.title}
                </Link>

                <p className="text-[12px] leading-[18px] text-grey lg:text-[16px] lg:leading-[22px]">
                    {project.description}
                </p>

                <p className="text-[12px] font-medium text-gold lg:text-[14px]">{project.need}</p>

                <div className="flex items-center gap-[10px] text-[12px] text-grey lg:text-[14px]">
                    <span>{project.date}</span>
                    <span className="size-[4px] shrink-0 rounded-full bg-grey" />
                    <span>{project.city}</span>
                </div>

                <Button
                    href={`/projects/${project.slug}`}
                    variant="goldStroke"
                    className="mt-auto w-full px-[12px] py-[8px] text-[12px] lg:px-[16px] lg:py-[12px] lg:text-[16px]"
                >
                    Подать заявку
                </Button>
            </div>
        </article>
    )
}
