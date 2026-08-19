'use client'

import React, { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import {
    Banknote,
    ChevronRight,
    Expand,
    Eye,
    MapPin,
    MessageCircle,
    SquarePen,
    Users,
} from 'lucide-react'
import { AdminRowMenu, AdminStatus } from '@/components/admin/ui/admin-ui'
import { PROJECT_STATUS } from '@/components/admin/ui/admin-statuses'

import 'swiper/css'
import 'swiper/css/free-mode'

// ─────────────────────────────────────────────────────────────────────────────
// Adminkadagi maydon qatori — Figma «Площадки» 342:10467.
// Ochiq saytdagi qator kartochkasi, «Забронировать» va yurakcha o'rniga
// hisoblagichlar, holat, tahrirlash va «⋮»; pastida kompaniya yo'lakchasi.
// ─────────────────────────────────────────────────────────────────────────────

function Meta({ icon: Icon, children }) {
    return (
        <span className="flex items-center gap-[8px] text-[12px] whitespace-nowrap text-black lg:text-[14px]">
            <Icon size={17} strokeWidth={1.75} className="shrink-0 text-gold" />
            {children}
        </span>
    )
}

export default function AdminVenueRow({ venue, menuItems }) {
    const [swiper, setSwiper] = useState(null)
    const next = useCallback(() => swiper?.slideNext(), [swiper])

    const href = `/admin/venues/${venue.id}`
    const price = `от ${venue.pricePerHour.toLocaleString('ru-RU')} ₽/час`
    const state = PROJECT_STATUS[venue.status]

    return (
        <article className="flex flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:p-[24px]">
            <div className="flex flex-col gap-[12px] lg:flex-row lg:items-start lg:gap-[16px]">
                <Link
                    href={href}
                    className="relative block size-[40px] shrink-0 overflow-hidden rounded-full bg-[#d9d9d9] lg:size-[94px] lg:rounded-[6px]"
                >
                    <Image
                        src={venue.image}
                        alt={venue.name}
                        fill
                        sizes="94px"
                        className="object-cover"
                    />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
                    <Link
                        href={href}
                        className="text-[16px] font-medium text-black transition-colors hover:text-gold"
                    >
                        {venue.name}
                    </Link>

                    <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px]">
                        <Meta icon={Expand}>{venue.area} м²</Meta>
                        <Meta icon={Users}>до {venue.capacity} чел.</Meta>
                        <Meta icon={MapPin}>{venue.city}</Meta>
                        <Meta icon={Banknote}>{price}</Meta>
                    </div>

                    <div className="flex flex-wrap gap-[12px]">
                        <span className="rounded-[6px] border border-black/8 px-[12px] py-[8px] text-[12px] whitespace-nowrap text-black lg:text-[14px]">
                            {venue.type}
                        </span>
                    </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-[12px] lg:gap-[16px]">
                    <span className="flex items-center gap-[16px] text-[12px] text-grey lg:text-[14px]">
                        <span className="flex items-center gap-[8px]">
                            <MessageCircle size={20} strokeWidth={2} />
                            {venue.comments}
                        </span>
                        <span className="flex items-center gap-[8px]">
                            <Eye size={20} strokeWidth={2} />
                            {venue.views}
                        </span>
                    </span>

                    <AdminStatus tone={state.tone} className="lg:w-[133px]">
                        {state.label}
                    </AdminStatus>

                    <Link
                        href={`${href}/edit`}
                        aria-label="Редактировать"
                        className="flex size-[32px] items-center justify-center rounded-[6px] ui-icon-btn p-[4px]"
                    >
                        <SquarePen size={24} strokeWidth={2} />
                    </Link>
                    <span className="flex size-[32px] items-center justify-center rounded-[6px] ui-icon-btn p-[4px]">
                        <AdminRowMenu compact items={menuItems(venue)} />
                    </span>
                </div>
            </div>

            <div className="relative">
                <Swiper
                    modules={[FreeMode]}
                    onSwiper={setSwiper}
                    freeMode
                    slidesPerView="auto"
                    spaceBetween={16}
                    className="model-gallery w-full"
                >
                    {venue.gallery.map((src, i) => (
                        <SwiperSlide key={`${venue.id}-${i}`}>
                            <Link
                                href={href}
                                className="relative block h-[160px] w-full overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:h-[200px]"
                            >
                                <Image src={src} alt="" fill sizes="264px" className="object-cover" />
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button
                    type="button"
                    onClick={next}
                    aria-label="Следующее фото"
                    className="absolute top-1/2 right-[8px] z-10 hidden size-[32px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-[6px] bg-white/80 text-black backdrop-blur-[2.5px] transition-colors hover:bg-white lg:flex"
                >
                    <ChevronRight size={24} strokeWidth={2} />
                </button>
            </div>

            <div className="flex items-center gap-[12px] rounded-[6px] bg-light-white p-[12px] lg:p-[16px]">
                <span className="relative block size-[32px] shrink-0 overflow-hidden rounded-full bg-white lg:size-[39px]">
                    <Image
                        src={venue.company.logo}
                        alt={venue.company.name}
                        fill
                        sizes="39px"
                        className="object-contain"
                    />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                    <span className="truncate text-[14px] font-medium text-black lg:text-[16px]">
                        {venue.company.name}
                    </span>
                    <span className="truncate text-[12px] text-grey">{venue.company.note}</span>
                </span>
                <span className="hidden shrink-0 text-[12px] whitespace-nowrap text-grey lg:block">
                    {venue.company.projects}
                </span>
            </div>
        </article>
    )
}
