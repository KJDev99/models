'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'
import EmptyState from '@/components/ui/empty-state'
import StatusBadge from '@/components/ui/status-badge'
import Gallery from '@/components/shared/gallery'
import ModerationNotice from '@/components/shared/moderation-notice'
import { formatDate, formatPrice } from '@/lib/format'
import { useApiStore } from '@/store/useApiStore'

// Figma: площадка "Активен" (230:7018) / "Отклонен" (230:7420).
export default function CompanyVenueDetail({ id }) {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const [venue, setVenue] = useState(null)
    const [loading, setLoading] = useState(true)

    // setState `.then()` ichida chaqiriladi — effekt tanasida sinxron
    // holat o'zgartirish React Compiler qoidalarini buzadi.
    const load = useCallback(() => {
        getDataToken(`/venues/${id}/`).then((res) => {
            setVenue(res.success ? res.data : null)
            setLoading(false)
        })
    }, [id, getDataToken])

    useEffect(() => {
        if (id) load()
    }, [id, load])

    if (loading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Spinner size={32} />
            </div>
        )
    }

    if (!venue) {
        return <EmptyState title="Площадка не найдена" actionText="К площадкам" actionHref="/company/venues" />
    }

    return (
        <div className="flex flex-col gap-6">
            <ModerationNotice status={venue.status} reason={venue.rejectReason} />

            <Card
                title={venue.name}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={venue.status} />
                        <Button href={`/company/venues/${id}/edit`} variant="whiteStroke" size="sm">
                            Редактировать
                        </Button>
                    </div>
                }
            >
                <dl className="grid gap-3 sm:grid-cols-2">
                    <div className="flex justify-between gap-4">
                        <dt className="text-sm text-grey">Город</dt>
                        <dd className="text-base text-black">{venue.city || '—'}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-sm text-grey">Площадь</dt>
                        <dd className="text-base text-black">{venue.area ? `${venue.area} м²` : '—'}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-sm text-grey">Цена за час</dt>
                        <dd className="text-base text-black">{formatPrice(venue.pricePerHour)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-sm text-grey">Бронирований</dt>
                        <dd className="text-base text-black">{venue.bookingsCount ?? 0}</dd>
                    </div>
                </dl>

                {venue.description && (
                    <p className="mt-6 whitespace-pre-line text-base text-black">{venue.description}</p>
                )}
            </Card>

            <Card title="Фотографии">
                <Gallery photos={venue.photos || []} />
            </Card>

            <Card title="Заявки на бронирование">
                {venue.bookings?.length ? (
                    <ul className="flex flex-col gap-4">
                        {venue.bookings.map((b) => (
                            <li
                                key={b.id}
                                className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 pb-4 last:border-0 last:pb-0"
                            >
                                <div>
                                    <p className="text-base text-black">{b.client?.name}</p>
                                    <p className="text-sm text-grey">
                                        {formatDate(b.date)} • {b.timeFrom}–{b.timeTo}
                                    </p>
                                </div>
                                <StatusBadge status={b.status} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-base text-grey">Заявок пока нет.</p>
                )}
            </Card>
        </div>
    )
}
