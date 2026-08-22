import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate, formatPrice } from '@/lib/format'
import { FAVORITE_TYPES } from '@/lib/favorites'
import FavoriteButton from '@/components/shared/favorite-button'
import StatusBadge from '@/components/ui/status-badge'

// Проект / кастинг kartochkasi (Figma: Проекты 141:8989).
export default function ProjectCard({ project, basePath = '/projects', showStatus = false }) {
    if (!project) return null

    const { id, slug, title, city, fee, startDate, cover, company, status, responsesCount } = project

    return (
        <article className="group relative overflow-hidden rounded-[16px] border border-black/8 bg-white transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <Link href={`${basePath}/${slug || id}`} className="block">
                {cover && (
                    <div className="relative aspect-[16/9] bg-light-white">
                        <Image
                            src={cover}
                            alt={title || ''}
                            fill
                            sizes="(max-width: 1024px) 100vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                    </div>
                )}

                <div className="p-5">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        {showStatus && status && <StatusBadge status={status} />}
                        {responsesCount != null && (
                            <span className="text-sm text-grey">{responsesCount} откликов</span>
                        )}
                    </div>

                    <h3 className="line-clamp-2 text-base text-black lg:text-lg">{title}</h3>

                    {company?.name && (
                        <p className="mt-1 truncate text-sm text-grey">{company.name}</p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-grey">
                        {/* Sana bo'lmasa `formatDate` «—» qaytaradi — taklif
                            ro'yxatida (`GET /performer/invites`) sana kelmaydi,
                            shunda shahar yonida yolg'iz chiziqcha turmasin. */}
                        <span>{[city, startDate && formatDate(startDate)].filter(Boolean).join(' • ')}</span>
                        {fee != null && <span className="text-base text-black">{formatPrice(fee)}</span>}
                    </div>
                </div>
            </Link>

            <FavoriteButton
                className="absolute right-3 top-3"
                item={{ type: FAVORITE_TYPES.PROJECT, id, slug, title, image: cover }}
            />
        </article>
    )
}
