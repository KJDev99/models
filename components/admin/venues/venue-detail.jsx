'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Banknote, Expand, MapPin, SquarePen, Users } from 'lucide-react'
import { AdminBreadcrumb } from '@/components/admin/ui/admin-form'
import { AdminRowMenu, AdminStatus } from '@/components/admin/ui/admin-ui'
import { publicationMenu } from '@/components/admin/ui/admin-menu-items'
import { DeleteModal } from '@/components/admin/ui/admin-modals'
import { PROJECT_STATUS } from '@/components/admin/ui/admin-statuses'
import { PHOTO_ITEMS, PHOTO_TABS, VENUE } from '@/components/venues/[slug]/venue-detail-data'

// ─────────────────────────────────────────────────────────────────────────────
// Maydon sahifasi — Figma «Studio Loft 21» 343:12110 / mobil 456:23609.
// Ochiq saytdagi sahifa, «Забронировать» o'rniga holat, tahrirlash va «⋮».
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminVenueDetail({ venue = VENUE }) {
    const router = useRouter()
    const [status, setStatus] = useState('active')
    const [removing, setRemoving] = useState(false)
    const [tab, setTab] = useState('all')
    const [shown, setShown] = useState(8)

    const state = PROJECT_STATUS[status]
    const photos = PHOTO_ITEMS[tab] || PHOTO_ITEMS.all

    return (
        <>
            <AdminBreadcrumb
                items={[
                    { label: 'Административная панель', href: '/admin/dashboard' },
                    { label: venue.name },
                ]}
            />

            <div className="flex flex-col gap-[16px] lg:gap-[24px]">
                <div className="flex flex-col gap-[16px] lg:flex-row lg:items-stretch">
                    <div className="relative h-[280px] shrink-0 overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:h-[600px] lg:w-[554px]">
                        <Image
                            src={venue.photos[0]}
                            alt={venue.name}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 554px"
                            className="object-cover"
                        />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
                        <div className="flex flex-wrap items-center justify-between gap-[12px]">
                            <h1 className="text-[20px] font-medium text-black lg:text-[32px]">
                                {venue.name}
                            </h1>
                            <div className="flex items-center gap-[12px] lg:gap-[16px]">
                                <AdminStatus tone={state.tone} className="lg:w-[130px]">
                                    {state.label}
                                </AdminStatus>
                                <button
                                    type="button"
                                    onClick={() => router.push('/admin/venues/v-1/edit')}
                                    aria-label="Редактировать"
                                    className="flex size-[32px] cursor-pointer items-center justify-center rounded-[6px] bg-gold/25 p-[4px] text-black transition-colors hover:bg-gold/40"
                                >
                                    <SquarePen size={24} strokeWidth={2} />
                                </button>
                                <span className="flex size-[32px] items-center justify-center rounded-[6px] bg-gold/25 p-[4px] text-black">
                                    <AdminRowMenu
                                        items={publicationMenu({
                                            status,
                                            onEdit: () => router.push('/admin/venues/v-1/edit'),
                                            onPause: () => setStatus('paused'),
                                            onResume: () => setStatus('active'),
                                            onFinish: () => setStatus('archive'),
                                            onDelete: () => setRemoving(true),
                                        })}
                                    />
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-[16px] text-[14px] font-medium text-grey lg:text-[16px]">
                            <Meta icon={Expand}>{venue.area} м²</Meta>
                            <Meta icon={Users}>до {venue.capacity} чел.</Meta>
                            <Meta icon={MapPin}>{venue.city}</Meta>
                            <Meta icon={Banknote}>
                                от {venue.pricePerHour.toLocaleString('ru-RU')} ₽/час
                            </Meta>
                        </div>

                        <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                            <h2 className="text-[16px] font-bold text-black lg:text-[18px]">
                                О площадке
                            </h2>
                            <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                                {venue.about}
                            </p>
                        </div>

                        <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                            <h2 className="text-[16px] font-bold text-black lg:text-[18px]">
                                Подходит для
                            </h2>
                            <div className="flex flex-wrap gap-[8px] lg:gap-[16px]">
                                {venue.suitableFor.map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-[6px] bg-light-white px-[12px] py-[8px] text-[12px] font-medium text-grey lg:text-[16px]"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto flex items-center gap-[12px] rounded-[6px] bg-light-white p-[12px] lg:p-[16px]">
                            <span className="relative block size-[32px] shrink-0 overflow-hidden rounded-full bg-white lg:size-[39px]">
                                <Image
                                    src={venue.owner.logo}
                                    alt={venue.owner.name}
                                    fill
                                    sizes="39px"
                                    className="object-cover"
                                />
                            </span>
                            <span className="flex min-w-0 flex-col gap-[2px]">
                                <span className="truncate text-[14px] font-medium text-black lg:text-[16px]">
                                    {venue.owner.name}
                                </span>
                                <span className="truncate text-[12px] text-grey">
                                    {venue.owner.note}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-[16px] lg:flex-row lg:items-stretch">
                    <Card title="Характеристики">
                        <div className="grid gap-[16px] lg:grid-cols-2 lg:gap-x-[24px]">
                            {venue.specs.flat().map(([label, value]) => (
                                <div key={label} className="flex gap-[16px]">
                                    <span className="w-[140px] shrink-0 text-[14px] font-medium text-grey lg:w-[160px] lg:text-[16px]">
                                        {label}
                                    </span>
                                    <span className="min-w-0 flex-1 text-[14px] font-medium text-black lg:text-[16px]">
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Стоимость">
                        <div className="flex flex-col gap-[16px]">
                            {venue.prices.map(([label, value]) => (
                                <div key={label} className="flex gap-[16px]">
                                    <span className="min-w-0 flex-1 text-[14px] font-medium text-grey lg:text-[16px]">
                                        {label}
                                    </span>
                                    <span className="min-w-0 flex-1 text-[14px] font-medium text-black lg:text-[16px]">
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <Card title="Оснащение">
                    <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                        {venue.equipment}
                    </p>
                </Card>

                <div className="flex flex-col gap-[16px] lg:gap-[24px]">
                    <h2 className="font-display text-[24px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:tracking-[0.64px]">
                        Фотографии
                    </h2>

                    <div className="flex flex-wrap gap-[12px] lg:gap-[16px]">
                        {PHOTO_TABS.map((item) => {
                            const on = item.key === tab
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => {
                                        setTab(item.key)
                                        setShown(8)
                                    }}
                                    className={`flex cursor-pointer items-center gap-[8px] rounded-[6px] px-[16px] py-[12px] text-[14px] font-medium transition-colors lg:gap-[12px] lg:p-[16px] lg:text-[16px] ${
                                        on
                                            ? 'bg-gold text-white'
                                            : 'border border-gold text-gold hover:bg-gold/10'
                                    }`}
                                >
                                    {item.label}
                                    <span>({item.count})</span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4 lg:gap-[16px]">
                        {photos.slice(0, shown).map((src, i) => (
                            <span
                                key={i}
                                className="relative block h-[140px] overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:h-[250px]"
                            >
                                <Image
                                    src={src}
                                    alt=""
                                    fill
                                    sizes="(max-width: 1024px) 50vw, 323px"
                                    className="object-cover"
                                />
                            </span>
                        ))}
                    </div>

                    {shown < photos.length && (
                        <button
                            type="button"
                            onClick={() => setShown(shown + 8)}
                            className="w-full cursor-pointer self-center rounded-[6px] border border-gold p-[16px] text-[14px] font-medium text-gold transition-colors hover:bg-gold/10 lg:w-[200px] lg:text-[16px]"
                        >
                            Показать еще
                        </button>
                    )}
                </div>

                <Card title="Адрес площадки">
                    <p className="text-[14px] font-medium text-black lg:text-[16px]">
                        {venue.address}
                    </p>
                    {/* Xarita — haqiqiy karta ulanmagan, Figma'dagi joy egallovchi. */}
                    <div className="h-[200px] w-full rounded-[6px] bg-[#e8eaed] lg:h-[400px]" />
                </Card>
            </div>

            <DeleteModal
                open={removing}
                onClose={() => setRemoving(false)}
                name={venue.name}
                onConfirm={() => router.push('/admin/venues')}
            />
        </>
    )
}

function Meta({ icon: Icon, children }) {
    return (
        <span className="flex items-center gap-[8px]">
            <Icon size={20} strokeWidth={1.75} className="shrink-0 text-gold" />
            {children}
        </span>
    )
}

function Card({ title, children }) {
    return (
        <section className="flex min-w-0 flex-1 flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
            <h2 className="font-display text-[24px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:tracking-[0.64px]">
                {title}
            </h2>
            {children}
        </section>
    )
}
