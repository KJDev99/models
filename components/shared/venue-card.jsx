import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/format'
import { FAVORITE_TYPES } from '@/lib/favorites'
import FavoriteButton from '@/components/shared/favorite-button'

// Площадка kartochkasi (Figma: Площадки 120:1121).
export default function VenueCard({ venue, basePath = '/venues' }) {
    if (!venue) return null

    const { id, slug, name, city, area, pricePerHour, photos, cover } = venue
    const image = cover || photos?.[0]?.url

    return (
        <article className="group relative overflow-hidden rounded-[16px] border border-black/8 bg-white transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <Link href={`${basePath}/${slug || id}`} className="block">
                <div className="relative aspect-[4/3] bg-light-white">
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
                            Нет фото
                        </span>
                    )}
                </div>

                <div className="p-4">
                    <h3 className="truncate text-base text-black lg:text-lg">{name}</h3>
                    <p className="mt-1 truncate text-sm text-grey">{city || '—'}</p>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        {area != null && <span className="text-sm text-grey">{area} м²</span>}
                        {pricePerHour != null && (
                            <span className="text-base text-black">
                                {formatPrice(pricePerHour)}
                                <span className="text-sm text-grey"> / час</span>
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            <FavoriteButton
                className="absolute right-3 top-3"
                item={{ type: FAVORITE_TYPES.VENUE, id, slug, title: name, image }}
            />
        </article>
    )
}
