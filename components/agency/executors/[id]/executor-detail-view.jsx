'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SquarePen } from 'lucide-react'
import toast from 'react-hot-toast'
import Container from '@/components/ui/container'
import { CabinetBreadcrumb } from '@/components/shared/cabinet/cabinet-ui'
import { AdminRowMenu, AdminStatus } from '@/components/admin/ui/admin-ui'
import { USER_STATUS } from '@/components/admin/ui/admin-statuses'
import { rowMenu } from '@/components/admin/ui/admin-menu-items'
import { DeleteModal } from '@/components/admin/ui/admin-modals'
import DetailGallery from '@/components/shared/detail/detail-gallery'
import DetailPortfolio from '@/components/shared/detail/detail-portfolio'
import DetailReviews from '@/components/shared/detail/detail-reviews'
import ModelSummary from '@/components/models/[slug]/model-summary'
import {
    DetailInfoCard,
    DetailInfoCards,
    DetailProjects,
} from '@/components/shared/detail/detail-info-cards'
import {
    MODEL,
    PORTFOLIO_ITEMS,
    PORTFOLIO_STEP,
    PORTFOLIO_TABS,
    REVIEWS,
    REVIEWS_STEP,
} from '@/components/models/[slug]/model-detail-data'
import { ReviewModal } from '@/components/shared/detail/detail-modals'
import { AGENCY } from '@/components/agency/dashboard/dashboard-data'

// ─────────────────────────────────────────────────────────────────────────────
// «Агентство» kabinetidagi ijrochi anketasi — Figma 345:19306,
// mobil 437:18308.
//
// Sahifa ochiq saytdagi anketa bilan bir xil komponentlardan yig'iladi,
// farqi — yurakcha o'rnida holat + qalam + «⋮» (345:19901) va pastdagi
// «Пригласить в проект» o'rnida agentlik yorlig'i (345:19391).
// ─────────────────────────────────────────────────────────────────────────────
export default function AgencyExecutorDetail({ id = 'e-1', initialStatus = 'active' }) {
    const router = useRouter()
    const [status, setStatus] = useState(initialStatus)
    const [removing, setRemoving] = useState(false)
    const [reviewModal, setReviewModal] = useState(false)

    const state = USER_STATUS[status]
    const editHref = `/agency/executors/${id}/edit`

    const actions = (
        <div className="flex shrink-0 items-center gap-[12px] lg:gap-[16px]">
            <AdminStatus tone={state.tone} className="lg:w-[130px]">
                {state.label}
            </AdminStatus>
            <Link
                href={editHref}
                aria-label="Редактировать"
                className="ui-icon-btn flex size-[32px] items-center justify-center rounded-[6px] p-[4px]"
            >
                <SquarePen size={24} strokeWidth={2} />
            </Link>
            <span className="ui-icon-btn flex size-[32px] items-center justify-center rounded-[6px] p-[4px]">
                <AdminRowMenu compact
                    items={rowMenu({
                        status,
                        onEdit: () => router.push(editHref),
                        onToggle: () => setStatus(status === 'paused' ? 'active' : 'paused'),
                        onBlock: () => setStatus('blocked'),
                        onUnblock: () => setStatus('active'),
                        onDelete: () => setRemoving(true),
                    })}
                />
            </span>
        </div>
    )

    // Agentlik yorlig'i — gold ramkali kartochka (Figma 345:19391).
    const agencyBadge = (
        <Link
            href="/agency/dashboard"
            className="flex w-full items-center gap-[12px] rounded-[6px] border border-gold p-[16px] transition-colors hover:bg-gold/10 lg:w-fit lg:self-end"
        >
            <span className="relative block size-[37px] shrink-0 overflow-hidden rounded-[6px] bg-light-white">
                <Image src={AGENCY.logo} alt="" fill sizes="37px" className="object-contain" />
            </span>
            <span className="flex min-w-0 flex-col gap-[2px]">
                <span className="truncate text-[14px] font-medium text-black lg:text-[16px]">
                    {AGENCY.name}
                </span>
                <span className="truncate text-[12px] text-grey">Еще 67 исполнителей</span>
            </span>
        </Link>
    )

    return (
        <div className="flex flex-col gap-[24px] bg-light-white pt-[16px] pb-[40px] lg:gap-[50px] lg:pt-[24px] lg:pb-[100px]">
            <Container className="flex flex-col gap-[16px] lg:gap-[24px]">
                <CabinetBreadcrumb
                    items={[
                        { label: 'Главная', href: '/' },
                        { label: 'Личный кабинет', href: '/agency/dashboard' },
                        { label: MODEL.name },
                    ]}
                />

                <div className="flex flex-col gap-[16px] lg:flex-row lg:gap-[16px]">
                    <DetailGallery photos={MODEL.photos} alt={MODEL.name} />
                    <ModelSummary model={MODEL} actions={actions} footer={agencyBadge} />
                </div>
            </Container>

            <Container>
                <DetailInfoCards>
                    <DetailInfoCard
                        title="Параметры"
                        columns={[MODEL.params.slice(0, 6), MODEL.params.slice(6)]}
                    />
                    <DetailInfoCard title="Стоимость" columns={[MODEL.prices]} />
                </DetailInfoCards>
            </Container>

            <Container>
                <DetailProjects title="Опыт участия в проектах" projects={MODEL.projects} />
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
                    rating={MODEL.rating}
                    reviews={REVIEWS}
                    step={REVIEWS_STEP}
                    onLeaveReview={() => setReviewModal(true)}
                />
            </Container>

            <ReviewModal open={reviewModal} onClose={() => setReviewModal(false)} />

            <DeleteModal
                open={removing}
                onClose={() => setRemoving(false)}
                name={MODEL.name}
                onConfirm={() => {
                    setRemoving(false)
                    toast.success('Исполнитель удалён')
                    router.push('/agency/dashboard')
                }}
            />
        </div>
    )
}
