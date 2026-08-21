'use client'

import React, { useCallback, useMemo, useState } from 'react'
import Image from 'next/image'
import Container from '@/components/ui/container'
import Breadcrumb from '@/components/ui/breadcrumb'
import PhotographerCard from '@/components/photographers/photographer-card'
import PhotographerSummary from '@/components/photographers/[slug]/photographer-summary'
import DetailPortfolio from '@/components/shared/detail/detail-portfolio'
import DetailReviews from '@/components/shared/detail/detail-reviews'
import {
    DetailInfoCard,
    DetailInfoCards,
    DetailProjects,
} from '@/components/shared/detail/detail-info-cards'
import {
    AuthRequiredModal,
    InviteModal,
    InviteSentModal,
    ReviewModal,
} from '@/components/shared/detail/detail-modals'
import {
    PORTFOLIO_STEP,
    REVIEWS_STEP,
} from '@/components/photographers/[slug]/photographer-detail-data'
import DetailState from '@/components/shared/detail/detail-state'
import { useApi } from '@/lib/use-api'
import * as site from '@/lib/api/site'
import { performerDetail, portfolioFromMedia } from '@/lib/adapters'
import { useAuth } from '@/lib/use-auth'

// ─────────────────────────────────────────────────────────────────────────────
// Fotograf anketasi. Figma: desktop 129:7022, mobil 364:15567.
//
// Модели anketasidan farqi:
//   · galereya — bitta 554×600 surat (eskizlar ustuni yo'q)
//   · «Информация» kartochkasi «Параметры» o'rniga (4 + 4 ustun)
//   · parametrlar qatorida yosh / tajriba / suratga olishlar soni / shahar
//
// Modallar, portfolio, otzivlar va sahifa qolipi umumiy komponentlardan
// olinadi — funksiyalari Модели bilan bir xil.
// ─────────────────────────────────────────────────────────────────────────────
export default function PhotographerDetail({ slug }) {
    const { authed } = useAuth()

    const [authModal, setAuthModal] = useState(false)
    const [inviteModal, setInviteModal] = useState(false)
    const [sentModal, setSentModal] = useState(false)
    const [reviewModal, setReviewModal] = useState(false)

    const fetcher = useCallback(() => site.performer(slug), [slug])
    const { data: raw, loading, error, reload } = useApi(fetcher, { enabled: Boolean(slug) })

    const photographer = useMemo(() => performerDetail(raw), [raw])
    const portfolio = useMemo(() => portfolioFromMedia(raw?.media), [raw])

    // Mehmon bo'lsa — avval «Требуется вход» oynasi (Figma 164:14791).
    const guard = useCallback(
        (open) => () => (authed ? open(true) : setAuthModal(true)),
        [authed],
    )

    if (loading || error || !photographer) {
        return (
            <DetailState
                loading={loading}
                error={error}
                onRetry={reload}
                breadcrumb={[
                    { name: 'Главная', href: '/' },
                    { name: 'Фотографы', href: '/photographers' },
                ]}
            />
        )
    }

    const breadcrumb = [
        { name: 'Главная', href: '/' },
        { name: 'Фотографы', href: '/photographers' },
        { name: photographer.name },
    ]

    const others = photographer.related || []

    return (
        <div className="flex flex-col gap-[24px] bg-light-white pt-[16px] lg:pt-[24px] pb-[40px] lg:gap-[50px] lg:pb-[100px]">
            <Container className="flex flex-col gap-[16px] lg:gap-[24px]">
                <Breadcrumb items={breadcrumb} />

                {/* Hero: surat + asosiy kartochka (Figma 129:7059 — 554 + 16 + 770) */}
                <div className="flex flex-col gap-[16px] lg:flex-row lg:gap-[16px]">
                    <div className="relative h-[400px] w-full shrink-0 overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:h-[600px] lg:w-[554px]">
                        <Image
                            src={photographer.photo}
                            alt={photographer.name}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 554px"
                            className="object-cover"
                        />
                    </div>

                    <PhotographerSummary
                        photographer={photographer}
                        onInvite={guard(setInviteModal)}
                    />
                </div>
            </Container>

            <Container>
                <DetailInfoCards>
                    <DetailInfoCard title="Информация" columns={photographer.info} />
                    <DetailInfoCard title="Стоимость" columns={[photographer.prices]} />
                </DetailInfoCards>
            </Container>

            <Container>
                <DetailProjects title="Опыт в проектах" projects={photographer.projects} />
            </Container>

            <Container>
                <DetailPortfolio
                    tabs={portfolio.tabs}
                    items={portfolio.items}
                    step={PORTFOLIO_STEP}
                />
            </Container>

            <Container>
                <DetailReviews
                    rating={photographer.rating}
                    reviews={photographer.reviews}
                    step={REVIEWS_STEP}
                    onLeaveReview={guard(setReviewModal)}
                />
            </Container>

            <Container className="flex flex-col gap-[16px] lg:gap-[32px]">
                <h2 className="font-display text-[24px] leading-[26px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:leading-none lg:tracking-[0.64px]">
                    Другие фотографы
                </h2>

                {/* Mobil — gorizontal lenta, kartochka 284×350 */}
                <div className="-mx-[12px] flex gap-[12px] overflow-x-auto overscroll-x-contain pl-[12px] scrollbar-hide lg:hidden">
                    {others.map((item) => (
                        <div key={item.id} className="w-[284px] shrink-0">
                            <PhotographerCard photographer={item} />
                        </div>
                    ))}
                    {/* Oxirida 12px bo'sh joy (gap hisobiga) */}
                    <span aria-hidden className="w-0 shrink-0" />
                </div>

                {/* Desktop (Figma 135:7524) — 4 ustun, kartochka 323×400 */}
                <div className="hidden gap-[16px] lg:grid lg:grid-cols-4">
                    {others.map((item) => (
                        <PhotographerCard
                            key={item.id}
                            photographer={item}
                            className="lg:h-[400px]"
                        />
                    ))}
                </div>
            </Container>

            <AuthRequiredModal open={authModal} onClose={() => setAuthModal(false)} />

            <InviteModal
                open={inviteModal}
                onClose={() => setInviteModal(false)}
                performerId={photographer.id}
                onSent={() => {
                    setInviteModal(false)
                    setSentModal(true)
                }}
            />

            <InviteSentModal open={sentModal} onClose={() => setSentModal(false)} />

            <ReviewModal
                open={reviewModal}
                onClose={() => setReviewModal(false)}
                targetId={photographer.id}
                onSent={reload}
            />
        </div>
    )
}
