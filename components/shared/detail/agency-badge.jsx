'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// «Исполнитель состоит в агентстве» yorlig'i — Figma 345:19391.
// Anketada «Пригласить в проект» yonida, o'ng chekkada turadi.
//
// Ma'lumot GET /site/performers/{id} javobidagi `agency` blokidan keladi
// (`lib/adapters.js` → `performerAgency`). Backend bu blokni bermasa,
// `model.agency` — `null` va yorliq umuman chizilmaydi.
// ─────────────────────────────────────────────────────────────────────────────
export default function AgencyBadge({ agency }) {
    if (!agency) return null

    return (
        <Link
            href={`/agencies/${agency.slug || agency.id}`}
            className="flex w-full items-center gap-[12px] rounded-[6px] border border-gold p-[16px] transition-colors hover:bg-gold/10 lg:w-fit lg:self-end"
        >
            <span className="relative block size-[37px] shrink-0 overflow-hidden rounded-[6px] bg-light-white">
                <Image
                    src={agency.logo || '/img/placeholder.svg'}
                    alt=""
                    fill
                    sizes="37px"
                    className="object-contain"
                />
            </span>
            <span className="flex min-w-0 flex-col gap-[2px]">
                <span className="truncate text-[14px] font-medium text-black lg:text-[16px]">
                    {agency.name}
                </span>
                <span className="truncate text-[12px] text-grey">Агентство</span>
            </span>
        </Link>
    )
}
