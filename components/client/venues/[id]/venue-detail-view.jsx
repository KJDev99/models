'use client'

import React from 'react'
import Link from 'next/link'
import Container from '@/components/ui/container'
import AdminVenueDetail from '@/components/admin/venues/venue-detail'
import { VENUE } from '@/components/venues/[slug]/venue-detail-data'

// ─────────────────────────────────────────────────────────────────────────────
// «Заказчик» kabinetidagi maydon sahifasi — Figma «Активен» 230:7018 /
// «Отклонен» 230:7420, mobil 415:16667 / 415:17081.
//
// Sahifaning o'zi ochiq saytdagi maydon sahifasi bilan bir xil (adminkada ham
// shu komponent ishlatiladi), farqi — yo'lakcha, manzillar va rad etilgan
// holatdagi banner.
// ─────────────────────────────────────────────────────────────────────────────
export default function ClientVenueDetail({ id = 'v-1', initialStatus = 'active' }) {
    const editHref = `/client/venues/${id}/edit`

    return (
        <Container>
            <div className="py-[16px] lg:py-[24px]">
                <AdminVenueDetail
                    initialStatus={initialStatus}
                    editHref={editHref}
                    backHref="/client/dashboard"
                    breadcrumb={[
                        { label: 'Главная', href: '/' },
                        { label: 'Личный кабинет', href: '/client/dashboard' },
                        { label: VENUE.name },
                    ]}
                    banner={
                        initialStatus === 'rejected' ? (
                            <RejectedBanner editHref={editHref} />
                        ) : null
                    }
                />
            </div>
        </Container>
    )
}

// Rad etilgan maydon uchun izoh (Figma 230:7424).
function RejectedBanner({ editHref }) {
    return (
        <div className="flex flex-col gap-[12px] rounded-[6px] bg-[#fdecec] p-[12px] lg:flex-row lg:items-center lg:justify-between lg:p-[16px]">
            <div className="flex flex-col gap-[8px]">
                <p className="text-[14px] font-bold text-[#d14343] lg:text-[16px]">
                    Площадка отклонена
                </p>
                <p className="text-[12px] leading-[18px] text-[#d14343] lg:text-[14px] lg:leading-[20px]">
                    Необходимо добавить фотографии площадки и указать точный адрес.
                </p>
            </div>
            <Link
                href={editHref}
                className="flex shrink-0 items-center justify-center rounded-[6px] bg-white px-[16px] py-[12px] text-[14px] font-medium text-black transition-colors hover:bg-light-white lg:px-[24px] lg:py-[16px] lg:text-[16px]"
            >
                Исправить площадку
            </Link>
        </div>
    )
}
