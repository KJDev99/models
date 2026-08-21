'use client'

import React, { useCallback, useMemo } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Container from '@/components/ui/container'
import AdminVenueDetail from '@/components/admin/venues/venue-detail'
import { useApi, useAction } from '@/lib/use-api'
import * as customerApi from '@/lib/api/customer'
import { portfolioFromMedia, venueDetail } from '@/lib/adapters'

// ─────────────────────────────────────────────────────────────────────────────
// «Заказчик» kabinetidagi maydon sahifasi — Figma «Активен» 230:7018 /
// «Отклонен» 230:7420, mobil 415:16667 / 415:17081.
//
// Sahifaning o'zi ochiq saytdagi maydon sahifasi bilan bir xil (adminkada ham
// shu komponent ishlatiladi), farqi — yo'lakcha, manzillar va rad etilgan
// holatdagi banner.
//
// Ma'lumot: GET /customer/venues/{id} (backend/customer.md).
// ─────────────────────────────────────────────────────────────────────────────
export default function ClientVenueDetail({ id }) {
    const editHref = `/client/venues/${id}/edit`

    const fetcher = useCallback(() => customerApi.venue(id), [id])
    const { data, loading, error, reload } = useApi(fetcher, { enabled: Boolean(id) })

    const venue = useMemo(() => venueDetail(data), [data])
    const photos = useMemo(() => portfolioFromMedia(data?.media), [data])

    const draft = useAction(customerApi.draftVenue)
    const submit = useAction(customerApi.submitVenue)
    const archive = useAction(customerApi.archiveVenue)
    const remove = useAction(customerApi.deleteVenue)

    async function run(promise, message) {
        const res = await promise
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success(message)
        reload()
    }

    if (loading || error || !venue) {
        return (
            <Container>
                <div className="py-[16px] lg:py-[24px]">
                    {loading ? (
                        <div className="h-[600px] animate-pulse rounded-[6px] bg-black/5" />
                    ) : (
                        <p className="rounded-[6px] bg-white p-[40px] text-center text-[14px] text-grey lg:text-[16px]">
                            {error?.message || 'Площадка не найдена'}
                        </p>
                    )}
                </div>
            </Container>
        )
    }

    return (
        <Container>
            <div className="py-[16px] lg:py-[24px]">
                <AdminVenueDetail
                    venue={venue}
                    photoTabs={photos.tabs}
                    photoItems={photos.items}
                    editHref={editHref}
                    backHref="/client/dashboard"
                    breadcrumb={[
                        { label: 'Главная', href: '/' },
                        { label: 'Личный кабинет', href: '/client/dashboard' },
                        { label: venue.name },
                    ]}
                    banner={
                        venue.status === 'rejected' ? (
                            <RejectedBanner
                                editHref={editHref}
                                comment={data?.moderation_comment}
                            />
                        ) : null
                    }
                    onPause={() => run(draft.run(id), 'Площадка снята с публикации')}
                    onResume={() => run(submit.run(id), 'Площадка отправлена на модерацию')}
                    onFinish={() => run(archive.run(id), 'Площадка в архиве')}
                    onDelete={async () => {
                        const res = await remove.run(id)
                        if (!res.success) toast.error(res.error.message)
                        else toast.success('Площадка удалена')
                    }}
                />
            </div>
        </Container>
    )
}

// Rad etilgan e'lon izohi (Figma 230:7420).
function RejectedBanner({ editHref, comment }) {
    return (
        <div className="flex flex-col gap-[12px] rounded-[6px] bg-[#fdecec] p-[12px] lg:flex-row lg:items-center lg:justify-between lg:p-[16px]">
            <div className="flex flex-col gap-[8px]">
                <p className="text-[14px] font-bold text-[#d14343] lg:text-[16px]">
                    Площадка отклонена
                </p>
                <p className="text-[12px] leading-[18px] text-[#d14343] lg:text-[14px] lg:leading-[20px]">
                    {comment || 'Проверьте данные площадки и отправьте её на модерацию повторно.'}
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
