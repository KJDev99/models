'use client'

import React, { useCallback, useMemo, useState } from 'react'
import Container from '@/components/ui/container'
import Breadcrumb from '@/components/ui/breadcrumb'
import VenueCard from '@/components/venues/venue-card'
import VenueSummary from '@/components/venues/[slug]/venue-summary'
import { BookingModal, BookingSentModal } from '@/components/venues/[slug]/venue-modals'
import DetailGallery from '@/components/shared/detail/detail-gallery'
import DetailPortfolio from '@/components/shared/detail/detail-portfolio'
import DetailReviews from '@/components/shared/detail/detail-reviews'
import {
    DetailInfoCard,
    DetailInfoCards,
} from '@/components/shared/detail/detail-info-cards'
import { AuthRequiredModal, ReviewModal } from '@/components/shared/detail/detail-modals'
import { PHOTO_STEP, REVIEWS_STEP } from '@/components/venues/[slug]/venue-detail-data'
import DetailState from '@/components/shared/detail/detail-state'
import { useApi } from '@/lib/use-api'
import * as site from '@/lib/api/site'
import { portfolioFromMedia, venueCard, venueDetail } from '@/lib/adapters'
import { useAuth } from '@/lib/use-auth'
import { MapPin } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Maydon sahifasi. Figma: desktop 138:8324, mobil 373:14660.
//
// Ijrochi anketalaridan farqlari:
//   · «Характеристики» (5 + 6 qator) + «Стоимость» (4 qator)
//   · alohida «Оснащение» kartochkasi
//   · «Фотографии» — tablar bilan setka (portfolio bilan bir xil komponent)
//   · «Адрес площадки» — manzil va xarita bloki
//   · modallar: «Забронировать» → «Заявка отправлена»
// ─────────────────────────────────────────────────────────────────────────────
export default function VenuePage({ slug }) {
    const { authed } = useAuth()

    const [authModal, setAuthModal] = useState(false)
    const [bookModal, setBookModal] = useState(false)
    const [sentModal, setSentModal] = useState(false)
    const [reviewModal, setReviewModal] = useState(false)

    const fetcher = useCallback(() => site.venue(slug), [slug])
    const { data: raw, loading, error, reload } = useApi(fetcher, { enabled: Boolean(slug) })

    const venue = useMemo(() => venueDetail(raw), [raw])
    const photos = useMemo(() => portfolioFromMedia(raw?.media), [raw])
    // Backend «Другие площадки» bermaydi — o'sha shahardagi e'lonlar olinadi.
    const relatedFetcher = useCallback(
        () => site.venues({ city: raw?.city, page_size: 5 }),
        [raw?.city],
    )
    const { data: relatedData } = useApi(relatedFetcher, { enabled: Boolean(raw?.city) })

    // Mehmon bo'lsa — avval «Требуется вход» oynasi (Figma 164:14791).
    const guard = useCallback(
        (open) => () => (authed ? open(true) : setAuthModal(true)),
        [authed],
    )

    if (loading || error || !venue) {
        return (
            <DetailState
                loading={loading}
                error={error}
                onRetry={reload}
                breadcrumb={[
                    { name: 'Главная', href: '/' },
                    { name: 'Площадки', href: '/venues' },
                ]}
            />
        )
    }

    const breadcrumb = [
        { name: 'Главная', href: '/' },
        { name: 'Площадки', href: '/venues' },
        { name: venue.name },
    ]

    // «Другие площадки» — o'sha shahardagi boshqa e'lonlar (o'zidan tashqari).
    const others = (relatedData?.items || [])
        .map(venueCard)
        .filter((v) => v.id !== venue.id)
        .slice(0, 4)

    return (
        <div className="flex flex-col gap-[24px] bg-light-white pt-[16px] lg:pt-[24px] pb-[40px] lg:gap-[50px] lg:pb-[100px]">
            <Container className="flex flex-col gap-[16px] lg:gap-[24px]">
                <Breadcrumb items={breadcrumb} />

                {/* Hero: galereya + asosiy kartochka (Figma 138:8362) */}
                <div className="flex flex-col gap-[16px] lg:flex-row lg:gap-[16px]">
                    <DetailGallery photos={venue.photos} alt={venue.name} />
                    <VenueSummary venue={venue} onBook={guard(setBookModal)} />
                </div>
            </Container>

            <Container>
                <DetailInfoCards>
                    <DetailInfoCard title="Характеристики" columns={venue.specs} />
                    <DetailInfoCard title="Стоимость" columns={[venue.prices]} />
                </DetailInfoCards>
            </Container>

            {/* Оснащение — Figma 141:8781 */}
            {venue.equipment && (
            <Container>
                <section className="flex flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
                    <h2 className="font-display text-[18px] leading-none tracking-[0.36px] text-black uppercase lg:text-[24px] lg:tracking-[0.48px]">
                        Оснащение
                    </h2>
                    <p className="text-[14px] leading-[20px] font-medium text-grey lg:text-[16px] lg:leading-[22px]">
                        {venue.equipment}
                    </p>
                </section>
            </Container>
            )}

            {/* Фотографии — portfolio bilan bir xil komponent (Figma 138:8497) */}
            <Container>
                <DetailPortfolio
                    title="Фотографии"
                    tabs={photos.tabs}
                    items={photos.items}
                    step={PHOTO_STEP}
                />
            </Container>

            {/* Адрес площадки — Figma 159:13206 */}
            <Container>
                <section className="flex flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
                    <h2 className="font-display text-[18px] leading-none tracking-[0.36px] text-black uppercase lg:text-[24px] lg:tracking-[0.48px]">
                        Адрес площадки
                    </h2>

                    <div className="flex flex-wrap gap-[8px] lg:gap-[16px]">
                        <span className="text-[14px] leading-[20px] font-medium text-grey lg:text-[16px]">
                            Адрес:
                        </span>
                        <span className="text-[14px] leading-[20px] font-medium text-black lg:text-[16px]">
                            {venue.address}
                        </span>
                    </div>

                    {/* Figma'da bu joyda xarita skrinshoti turibdi. Backend
                        ulanganda shu konteynerga haqiqiy xarita (koordinatalar
                        bo'yicha) joylashtiriladi. */}
                    <div className="relative flex h-[200px] items-center justify-center overflow-hidden rounded-[6px] bg-light-white lg:h-[300px]">
                        <span className="flex flex-col items-center gap-[8px] text-center">
                            <MapPin size={32} strokeWidth={2} className="text-gold" />
                            <span className="px-[16px] text-[12px] leading-[16px] text-grey lg:text-[14px]">
                                {venue.address}
                            </span>
                        </span>
                    </div>
                </section>
            </Container>

            <Container>
                <DetailReviews
                    rating={venue.rating}
                    reviews={venue.reviews}
                    step={REVIEWS_STEP}
                    onLeaveReview={guard(setReviewModal)}
                />
            </Container>

            {others.length > 0 && (
            <Container className="flex flex-col gap-[16px] lg:gap-[32px]">
                <h2 className="font-display text-[24px] leading-[26px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:leading-none lg:tracking-[0.64px]">
                    Другие площадки
                </h2>

                {/* Mobil — gorizontal lenta, kartochka 284×350 */}
                <div className="-mx-[12px] flex gap-[12px] overflow-x-auto overscroll-x-contain pl-[12px] scrollbar-hide lg:hidden">
                    {others.map((item) => (
                        <div key={item.id} className="w-[284px] shrink-0">
                            <VenueCard venue={item} />
                        </div>
                    ))}
                    {/* Oxirida 12px bo'sh joy (gap hisobiga) */}
                    <span aria-hidden className="w-0 shrink-0" />
                </div>

                {/* Desktop (Figma 138:8582) — 4 ustun, kartochka 323×400 */}
                <div className="hidden gap-[16px] lg:grid lg:grid-cols-4">
                    {others.map((item) => (
                        <VenueCard key={item.id} venue={item} className="lg:h-[400px]" />
                    ))}
                </div>
            </Container>
            )}

            <AuthRequiredModal open={authModal} onClose={() => setAuthModal(false)} />

            <BookingModal
                open={bookModal}
                onClose={() => setBookModal(false)}
                venueId={venue.id}
                onSent={() => {
                    setBookModal(false)
                    setSentModal(true)
                }}
            />

            <BookingSentModal open={sentModal} onClose={() => setSentModal(false)} />

            <ReviewModal
                open={reviewModal}
                onClose={() => setReviewModal(false)}
                venueId={venue.id}
                targetId={venue.owner?.id}
                onSent={reload}
            />
        </div>
    )
}
