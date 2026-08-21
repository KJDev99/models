'use client'

import React, { useCallback, useMemo, useState } from 'react'
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
import DetailState from '@/components/shared/detail/detail-state'
import ModelSummary from '@/components/models/[slug]/model-summary'
import {
    DetailInfoCard,
    DetailInfoCards,
    DetailProjects,
} from '@/components/shared/detail/detail-info-cards'
import { PORTFOLIO_STEP, REVIEWS_STEP } from '@/components/models/[slug]/model-detail-data'
import { useApi, useAction } from '@/lib/use-api'
import * as agencyApi from '@/lib/api/agency'
import { mapStatus, performerDetail, portfolioFromMedia } from '@/lib/adapters'
import { useAuthStore } from '@/store/useAuthStore'

// ─────────────────────────────────────────────────────────────────────────────
// «Агентство» kabinetidagi ijrochi anketasi — Figma 345:19306,
// mobil 437:18308.
//
// Sahifa ochiq saytdagi anketa bilan bir xil komponentlardan yig'iladi,
// farqi — yurakcha o'rnida holat + qalam + «⋮» (345:19901) va pastdagi
// «Пригласить в проект» o'rnida agentlik yorlig'i (345:19391).
//
// Ma'lumot: GET /agency/performers/{id} (backend/agency.md).
// ─────────────────────────────────────────────────────────────────────────────
export default function AgencyExecutorDetail({ id }) {
    const router = useRouter()
    const user = useAuthStore((s) => s.user)
    const [removing, setRemoving] = useState(false)

    const fetcher = useCallback(() => agencyApi.performer(id), [id])
    const { data: raw, loading, error, reload } = useApi(fetcher, { enabled: Boolean(id) })

    const model = useMemo(() => performerDetail(raw), [raw])
    const portfolio = useMemo(() => portfolioFromMedia(raw?.media), [raw])

    const hide = useAction(agencyApi.setPerformerHidden)
    const remove = useAction(agencyApi.deletePerformer)

    if (loading || error || !model) {
        return (
            <DetailState
                loading={loading}
                error={error}
                onRetry={reload}
                breadcrumb={[
                    { name: 'Главная', href: '/' },
                    { name: 'Личный кабинет', href: '/agency/dashboard' },
                ]}
            />
        )
    }

    // Backend holatini adminka yorliqlariga o'giradi: `mapStatus()` `moderation`
    // va `paused` beradi, qolganlari «Активен».
    const mapped = mapStatus(model.status)
    const status = USER_STATUS[mapped] ? mapped : 'active'
    const state = USER_STATUS[status]
    const editHref = `/agency/executors/${id}/edit`

    async function toggle() {
        const res = await hide.run(id, status !== 'paused')
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success(status === 'paused' ? 'Анкета опубликована' : 'Анкета скрыта')
        reload()
    }

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
                <AdminRowMenu
                    compact
                    items={rowMenu({
                        status,
                        onEdit: () => router.push(editHref),
                        onToggle: toggle,
                        onBlock: toggle,
                        onUnblock: toggle,
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
                <Image
                    src={user?.logo_url || '/img/placeholder.svg'}
                    alt=""
                    fill
                    sizes="37px"
                    className="object-contain"
                />
            </span>
            <span className="flex min-w-0 flex-col gap-[2px]">
                <span className="truncate text-[14px] font-medium text-black lg:text-[16px]">
                    {user?.agency_name || user?.name || 'Агентство'}
                </span>
                <span className="truncate text-[12px] text-grey">Личный кабинет</span>
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
                        { label: model.name },
                    ]}
                />

                <div className="flex flex-col gap-[16px] lg:flex-row lg:gap-[16px]">
                    <DetailGallery photos={model.photos} alt={model.name} />
                    <ModelSummary model={model} actions={actions} footer={agencyBadge} />
                </div>
            </Container>

            <Container>
                <DetailInfoCards>
                    <DetailInfoCard title="Параметры" columns={model.info} />
                    <DetailInfoCard title="Стоимость" columns={[model.prices]} />
                </DetailInfoCards>
            </Container>

            {model.projects.length > 0 && (
                <Container>
                    <DetailProjects title="Опыт участия в проектах" projects={model.projects} />
                </Container>
            )}

            <Container>
                <DetailPortfolio
                    tabs={portfolio.tabs}
                    items={portfolio.items}
                    step={PORTFOLIO_STEP}
                />
            </Container>

            <Container>
                <DetailReviews rating={model.rating} reviews={model.reviews} step={REVIEWS_STEP} />
            </Container>

            <DeleteModal
                open={removing}
                onClose={() => setRemoving(false)}
                name={model.name}
                onConfirm={async () => {
                    setRemoving(false)
                    const res = await remove.run(id)
                    if (!res.success) {
                        toast.error(res.error.message)
                        return
                    }
                    toast.success('Исполнитель удалён')
                    router.push('/agency/executors')
                }}
            />
        </div>
    )
}
