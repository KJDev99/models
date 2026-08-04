'use client'

import React from 'react'
import Image from 'next/image'
import Avatar from '@/components/ui/avatar'
import StatusBadge from '@/components/ui/status-badge'
import Rating from '@/components/ui/rating'

// Ochiq profil sahifalarining yuqori bloki: анкета исполнителя, площадка,
// профиль компании / частного лица / агентства.
export default function ProfileHeader({
    cover,
    avatar,
    name,
    subtitle,
    city,
    rating,
    reviewsCount,
    status,
    actions,
    children,
}) {
    return (
        <section className="overflow-hidden rounded-[16px] border border-black/8 bg-white">
            {cover && (
                <div className="relative h-[180px] bg-light-white lg:h-[280px]">
                    <Image src={cover} alt="" fill sizes="100vw" className="object-cover" priority />
                </div>
            )}

            <div className="flex flex-wrap items-start gap-5 p-5 lg:p-8">
                <Avatar src={avatar} name={name} size="xl" className={cover ? '-mt-16 border-4 border-white' : ''} />

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-[26px] leading-tight font-medium text-black lg:text-[36px]">
                            {name}
                        </h1>
                        {status && <StatusBadge status={status} />}
                    </div>

                    {subtitle && <p className="mt-1 text-base text-grey">{subtitle}</p>}

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-grey">
                        {city && <span>{city}</span>}
                        {rating != null && (
                            <span className="flex items-center gap-2">
                                <Rating value={rating} size={16} />
                                {reviewsCount != null && <span>{reviewsCount} отзывов</span>}
                            </span>
                        )}
                    </div>

                    {children}
                </div>

                {actions && <div className="flex w-full flex-wrap gap-3 lg:w-auto">{actions}</div>}
            </div>
        </section>
    )
}
