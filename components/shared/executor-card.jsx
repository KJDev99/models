import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatAge, formatPrice } from '@/lib/format'
import { FAVORITE_TYPES } from '@/lib/favorites'
import FavoriteButton from '@/components/shared/favorite-button'

// Model / fotograf / videograf kartochkasi.
// basePath: '/models' | '/photographers' | '/videographers' — kabinet ichida
// boshqa prefiks berilishi mumkin (masalan '/client/models').
export default function ExecutorCard({ executor, basePath = '/models' }) {
    if (!executor) return null

    const {
        id,
        slug,
        name,
        city,
        age,
        height,
        price,
        cover,
        photos,
        category,
    } = executor

    const image = cover || photos?.[0]?.url

    return (
        <article className="group relative overflow-hidden rounded-[16px] border border-black/8 bg-white transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <Link href={`${basePath}/${slug || id}`} className="block">
                <div className="relative aspect-[3/4] bg-light-white">
                    {image ? (
                        <Image
                            src={image}
                            alt={name || ''}
                            fill
                            sizes="(max-width: 1024px) 50vw, 25vw"
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
                    <p className="mt-1 truncate text-sm text-grey">
                        {[city, category].filter(Boolean).join(' • ') || '—'}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-grey">
                        {age != null && <span>{formatAge(age)}</span>}
                        {height != null && <span>{height} см</span>}
                    </div>

                    {price != null && (
                        <p className="mt-3 text-base text-black">
                            от {formatPrice(price)}
                            <span className="text-sm text-grey"> / смена</span>
                        </p>
                    )}
                </div>
            </Link>

            <FavoriteButton
                className="absolute right-3 top-3"
                item={{
                    type: FAVORITE_TYPES.EXECUTOR,
                    id,
                    slug,
                    title: name,
                    image,
                }}
            />
        </article>
    )
}
