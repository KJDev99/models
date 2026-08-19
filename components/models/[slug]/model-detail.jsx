'use client'

import React, { useState } from 'react'
import Container from '@/components/ui/container'
import Breadcrumb from '@/components/ui/breadcrumb'
import ModelCard from '@/components/models/model-card'
import { MODELS } from '@/components/models/models-data'
import DetailGallery from '@/components/shared/detail/detail-gallery'
import ModelSummary from '@/components/models/[slug]/model-summary'
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
    MODEL,
    PORTFOLIO_ITEMS,
    PORTFOLIO_STEP,
    PORTFOLIO_TABS,
    REVIEWS,
    REVIEWS_STEP,
} from '@/components/models/[slug]/model-detail-data'
import { useAuth } from '@/lib/use-auth'

// ─────────────────────────────────────────────────────────────────────────────
// Anketa sahifasi. Figma: desktop 129:5247, mobil 360:24036.
// Bo'limlar orasi 50px (desktop) / 24px (mobil) — Figma'dagi freym qadamlari.
//
// Hozircha ma'lumot `model-detail-data.js` dan keladi; backend ulanganda
// `/executors/{slug}/` javobi bilan almashtiriladi.
// ─────────────────────────────────────────────────────────────────────────────
export default function ModelDetail({ slug }) {
    const { authed } = useAuth()

    const [authModal, setAuthModal] = useState(false)
    const [inviteModal, setInviteModal] = useState(false)
    const [sentModal, setSentModal] = useState(false)
    const [reviewModal, setReviewModal] = useState(false)

    const model = { ...MODEL, slug: slug || MODEL.slug }

    // Mehmon bo'lsa — avval «Требуется вход» oynasi (Figma 164:14791).
    function guard(open) {
        return () => (authed ? open(true) : setAuthModal(true))
    }

    const breadcrumb = [
        { name: 'Главная', href: '/' },
        { name: 'Модели', href: '/models' },
        { name: model.name },
    ]

    // «Другие модели» — katalogdan dastlabki 4 ta anketa.
    const others = MODELS.slice(0, 4)

    return (
        <div className="flex flex-col gap-[24px] bg-light-white pt-[16px] lg:pt-[24px] pb-[40px] lg:gap-[50px] lg:pb-[100px]">
            <Container className="flex flex-col gap-[16px] lg:gap-[24px]">
                <Breadcrumb items={breadcrumb} />

                {/* Hero: galereya + asosiy kartochka */}
                <div className="flex flex-col gap-[16px] lg:flex-row lg:gap-[16px]">
                    <DetailGallery photos={model.photos} alt={model.name} />
                    <ModelSummary model={model} onInvite={guard(setInviteModal)} />
                </div>
            </Container>

            <Container>
                <DetailInfoCards>
                    {/* Figma'da «Параметры» ikki ustunga bo'lingan: 6 + 5 */}
                    <DetailInfoCard
                        title="Параметры"
                        columns={[model.params.slice(0, 6), model.params.slice(6)]}
                    />
                    <DetailInfoCard title="Стоимость" columns={[model.prices]} />
                </DetailInfoCards>
            </Container>

            <Container>
                <DetailProjects title="Опыт участия в проектах" projects={model.projects} />
            </Container>

            <Container>
                <DetailPortfolio
                    tabs={PORTFOLIO_TABS}
                    items={PORTFOLIO_ITEMS}
                    step={PORTFOLIO_STEP}
                />
            </Container>

            <Container>
                <DetailReviews
                    rating={model.rating}
                    reviews={REVIEWS}
                    step={REVIEWS_STEP}
                    onLeaveReview={guard(setReviewModal)}
                />
            </Container>

            <Container className="flex flex-col gap-[16px] lg:gap-[32px]">
                <h2 className="font-display text-[24px] leading-[26px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:leading-none lg:tracking-[0.64px]">
                    Другие модели
                </h2>
                {/* Mobil (Figma 373:15493) — gorizontal lenta, kartochka 284×350,
                    keyingisi ekran chetidan chiqib turadi. Konteyner padding'idan
                    chiqish uchun manfiy margin, chap chetda esa 12px qaytariladi. */}
                <div className="-mx-[12px] flex gap-[12px] overflow-x-auto overscroll-x-contain pl-[12px] scrollbar-hide lg:hidden">
                    {others.map((item) => (
                        <div key={item.id} className="w-[284px] shrink-0">
                            <ModelCard model={item} />
                        </div>
                    ))}
                    {/* Oxirgi kartochkadan keyin 12px bo'sh joy. `padding-right`
                        scroll oxirida hamma brauzerda hisobga olinmaydi, shuning
                        uchun nol enli element qo'yiladi — 12px gap'ni beradi. */}
                    <span aria-hidden className="w-0 shrink-0" />
                </div>

                {/* Desktop (Figma 129:6580) — 4 ustunli setka, kartochka 400px */}
                <div className="hidden gap-[16px] lg:grid lg:grid-cols-4">
                    {others.map((item) => (
                        <ModelCard key={item.id} model={item} className="lg:h-[400px]" />
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
