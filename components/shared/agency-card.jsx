import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FAVORITE_TYPES } from '@/lib/favorites'
import FavoriteButton from '@/components/shared/favorite-button'

// Агентство kartochkasi (Figma: Агентства 155:12722).
export default function AgencyCard({ agency, basePath = '/agencies' }) {
    if (!agency) return null

    const { id, slug, name, city, logo, cover, executorsCount } = agency
    const image = cover || logo

    return (
        <article className="group relative overflow-hidden rounded-[16px] border border-black/8 bg-white transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <Link href={`${basePath}/${slug || id}`} className="block">
                <div className="relative aspect-[16/9] bg-light-white">
                    {image ? (
                        <Image
                            src={image}
                            alt={name || ''}
                            fill
                            sizes="(max-width: 1024px) 100vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                    ) : (
                        <span className="flex h-full items-center justify-center text-sm text-grey">
                            Нет обложки
                        </span>
                    )}
                </div>

                <div className="p-5">
                    <h3 className="truncate text-base text-black lg:text-lg">{name}</h3>
                    <p className="mt-1 truncate text-sm text-grey">{city || '—'}</p>
                    {executorsCount != null && (
                        <p className="mt-3 text-sm text-grey">{executorsCount} исполнителей</p>
                    )}
                </div>
            </Link>

            <FavoriteButton
                className="absolute right-3 top-3"
                item={{ type: FAVORITE_TYPES.AGENCY, id, slug, title: name, image }}
            />
        </article>
    )
}
