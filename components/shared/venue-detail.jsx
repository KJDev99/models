'use client'

import React, { useEffect, useState } from 'react'
import Container from '@/components/ui/container'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Breadcrumb from '@/components/ui/breadcrumb'
import Spinner from '@/components/ui/spinner'
import EmptyState from '@/components/ui/empty-state'
import Gallery from '@/components/shared/gallery'
import ProfileHeader from '@/components/shared/profile-header'
import ReviewCard from '@/components/shared/review-card'
import BookingModal from '@/components/shared/booking-modal'
import AuthRequiredModal from '@/components/shared/auth-required-modal'
import ComplaintModal from '@/components/shared/complaint-modal'
import { formatPrice } from '@/lib/format'
import { useAuth } from '@/lib/use-auth'
import { useApiStore } from '@/store/useApiStore'

// Figma: площадка Studio Loft 21 (138:8324) + Забронировать (164:17004).
export default function VenueDetail({ slug, basePath = '/venues' }) {
    const getData = useApiStore((s) => s.getData)
    const { authed } = useAuth()

    const [venue, setVenue] = useState(null)
    const [loading, setLoading] = useState(true)
    const [bookingModal, setBookingModal] = useState(false)
    const [authModal, setAuthModal] = useState(false)
    const [complaintModal, setComplaintModal] = useState(false)

    useEffect(() => {
        if (!slug) return
        let alive = true
        getData(`/venues/${slug}/`).then((res) => {
            if (!alive) return
            setVenue(res.success ? res.data : null)
            setLoading(false)
        })
        return () => {
            alive = false
        }
    }, [slug, getData])

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Spinner size={32} />
            </div>
        )
    }

    if (!venue) {
        return (
            <Container className="my-12">
                <EmptyState
                    title="Площадка не найдена"
                    description="Возможно, объявление снято с публикации."
                    actionText="Все площадки"
                    actionHref={basePath}
                />
            </Container>
        )
    }

    const specs = [
        { label: 'Площадь', value: venue.area ? `${venue.area} м²` : null },
        { label: 'Высота потолков', value: venue.ceilingHeight ? `${venue.ceilingHeight} м` : null },
        { label: 'Залы', value: venue.hallsCount },
        { label: 'Город', value: venue.city },
        { label: 'Адрес', value: venue.address },
        { label: 'Цена за час', value: venue.pricePerHour != null ? formatPrice(venue.pricePerHour) : null },
        { label: 'Минимальная аренда', value: venue.minHours ? `${venue.minHours} ч` : null },
    ].filter((s) => s.value)

    return (
        <Container className="my-8 lg:my-12">
            <div className="mb-6">
                <Breadcrumb
                    items={[
                        { name: 'Главная', href: '/' },
                        { name: 'Площадки', href: basePath },
                        { name: venue.name },
                    ]}
                />
            </div>

            <ProfileHeader
                cover={venue.cover || venue.photos?.[0]?.url}
                avatar={venue.owner?.logo}
                name={venue.name}
                subtitle={venue.owner?.name}
                city={venue.city}
                rating={venue.rating}
                reviewsCount={venue.reviewsCount}
                actions={
                    <Button onClick={() => (authed ? setBookingModal(true) : setAuthModal(true))}>
                        Забронировать
                    </Button>
                }
            />

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
                <div className="flex min-w-0 flex-col gap-6">
                    <Card title="Фотографии">
                        <Gallery photos={venue.photos || []} />
                    </Card>

                    {venue.description && (
                        <Card title="Описание">
                            <p className="whitespace-pre-line text-base text-black">{venue.description}</p>
                        </Card>
                    )}

                    {venue.equipment?.length > 0 && (
                        <Card title="Оборудование">
                            <ul className="grid gap-3 sm:grid-cols-2">
                                {venue.equipment.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-base text-black">
                                        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}

                    <Card title="Отзывы">
                        {venue.reviews?.length ? (
                            <div className="flex flex-col gap-4">
                                {venue.reviews.map((r) => (
                                    <ReviewCard key={r.id} review={r} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-base text-grey">Отзывов пока нет.</p>
                        )}
                    </Card>
                </div>

                <aside className="flex flex-col gap-6">
                    <Card title="Характеристики">
                        <dl className="flex flex-col gap-3">
                            {specs.map((s) => (
                                <div key={s.label} className="flex items-start justify-between gap-4">
                                    <dt className="text-sm text-grey">{s.label}</dt>
                                    <dd className="text-right text-base text-black">{s.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </Card>

                    <button
                        type="button"
                        onClick={() => (authed ? setComplaintModal(true) : setAuthModal(true))}
                        className="text-sm text-grey underline-offset-4 transition-colors hover:text-danger hover:underline"
                    >
                        Пожаловаться на объявление
                    </button>
                </aside>
            </div>

            <BookingModal open={bookingModal} onClose={() => setBookingModal(false)} venue={venue} />
            <AuthRequiredModal
                open={authModal}
                onClose={() => setAuthModal(false)}
                action="забронировать площадку"
            />
            <ComplaintModal
                open={complaintModal}
                onClose={() => setComplaintModal(false)}
                target={{ type: 'venue', id: venue.id, name: venue.name }}
            />
        </Container>
    )
}
