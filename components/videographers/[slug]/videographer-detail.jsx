'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Container from '@/components/ui/container'
import Breadcrumb from '@/components/ui/breadcrumb'
import VideographerCard from '@/components/videographers/videographer-card'
import { VIDEOGRAPHERS } from '@/components/videographers/videographers-data'
import VideographerSummary from '@/components/videographers/[slug]/videographer-summary'
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
    PORTFOLIO_ITEMS,
    PORTFOLIO_STEP,
    PORTFOLIO_TABS,
    REVIEWS,
    REVIEWS_STEP,
    VIDEOGRAPHER,
} from '@/components/videographers/[slug]/videographer-detail-data'
import { useAuth } from '@/lib/use-auth'

// ─────────────────────────────────────────────────────────────────────────────
// Videograf anketasi. Figma: desktop 136:7645, mobil 366:17914.
//
// Фотографы anketasi bilan bir xil qolip, farqlari:
//   · portfolio kadrlari video — qoraytirish va play belgisi (Figma 138:8030)
//   · «О видеографе», «Информация» 4 + 5 qator
//   · parametrlar: yosh · tajriba · keyslar · shahar
//
// Modallar, portfolio, otzivlar umumiy komponentlardan olinadi.
// ─────────────────────────────────────────────────────────────────────────────
export default function VideographerDetail({ slug }) {
    const { authed } = useAuth()

    const [authModal, setAuthModal] = useState(false)
    const [inviteModal, setInviteModal] = useState(false)
    const [sentModal, setSentModal] = useState(false)
    const [reviewModal, setReviewModal] = useState(false)

    const videographer = { ...VIDEOGRAPHER, slug: slug || VIDEOGRAPHER.slug }

    // Mehmon bo'lsa — avval «Требуется вход» oynasi (Figma 164:14791).
    function guard(open) {
        return () => (authed ? open(true) : setAuthModal(true))
    }

    const breadcrumb = [
        { name: 'Главная', href: '/' },
        { name: 'Видеографы', href: '/videographers' },
        { name: videographer.name },
    ]

    // «Другие видеографы» — katalogdan dastlabki 4 ta anketa.
    const others = VIDEOGRAPHERS.slice(0, 4)

    return (
        <div className="flex flex-col gap-[24px] bg-light-white pt-[16px] lg:pt-[24px] pb-[40px] lg:gap-[50px] lg:pb-[100px]">
            <Container className="flex flex-col gap-[16px] lg:gap-[24px]">
                <Breadcrumb items={breadcrumb} />

                {/* Hero: surat + asosiy kartochka (Figma 136:7683 — 554 + 16 + 770) */}
                <div className="flex flex-col gap-[16px] lg:flex-row lg:gap-[16px]">
                    <div className="relative h-[400px] w-full shrink-0 overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:h-[600px] lg:w-[554px]">
                        <Image
                            src={videographer.photo}
                            alt={videographer.name}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 554px"
                            className="object-cover"
                        />
                    </div>

                    <VideographerSummary
                        videographer={videographer}
                        onInvite={guard(setInviteModal)}
                    />
                </div>
            </Container>

            <Container>
                <DetailInfoCards>
                    <DetailInfoCard title="Информация" columns={videographer.info} />
                    <DetailInfoCard title="Стоимость" columns={[videographer.prices]} />
                </DetailInfoCards>
            </Container>

            <Container>
                <DetailProjects title="Опыт в проектах" projects={videographer.projects} />
            </Container>

            <Container>
                <DetailPortfolio
                    tabs={PORTFOLIO_TABS}
                    items={PORTFOLIO_ITEMS}
                    step={PORTFOLIO_STEP}
                    video
                />
            </Container>

            <Container>
                <DetailReviews
                    rating={videographer.rating}
                    reviews={REVIEWS}
                    step={REVIEWS_STEP}
                    onLeaveReview={guard(setReviewModal)}
                />
            </Container>

            <Container className="flex flex-col gap-[16px] lg:gap-[32px]">
                {/* Figma'da sarlavha «Другие фотографы» deb qolib ketgan (136:7872) —
                    bu ko'chirishdagi xato, sahifaga to'g'ri keladigan nom qo'yildi. */}
                <h2 className="font-display text-[24px] leading-[26px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:leading-none lg:tracking-[0.64px]">
                    Другие видеографы
                </h2>

                {/* Mobil — gorizontal lenta, kartochka 284×350 */}
                <div className="-mx-[12px] flex gap-[12px] overflow-x-auto overscroll-x-contain pl-[12px] scrollbar-hide lg:hidden">
                    {others.map((item) => (
                        <div key={item.id} className="w-[284px] shrink-0">
                            <VideographerCard videographer={item} />
                        </div>
                    ))}
                    {/* Oxirida 12px bo'sh joy (gap hisobiga) */}
                    <span aria-hidden className="w-0 shrink-0" />
                </div>

                {/* Desktop (Figma 138:8217) — 4 ustun, kartochka 323×400 */}
                <div className="hidden gap-[16px] lg:grid lg:grid-cols-4">
                    {others.map((item) => (
                        <VideographerCard
                            key={item.id}
                            videographer={item}
                            className="lg:h-[400px]"
                        />
                    ))}
                </div>
            </Container>

            <AuthRequiredModal open={authModal} onClose={() => setAuthModal(false)} />

            <InviteModal
                open={inviteModal}
                onClose={() => setInviteModal(false)}
                onSent={() => {
                    setInviteModal(false)
                    setSentModal(true)
                }}
            />

            <InviteSentModal open={sentModal} onClose={() => setSentModal(false)} />

            <ReviewModal open={reviewModal} onClose={() => setReviewModal(false)} />
        </div>
    )
}
