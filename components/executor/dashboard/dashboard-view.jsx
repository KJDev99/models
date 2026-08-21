'use client'

import React, { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Calendar,
    Image as ImageIcon,
    MapPin,
    Ruler,
    Scale,
    Settings,
    SquarePen,
} from 'lucide-react'
import Container from '@/components/ui/container'
import { AdminStatus } from '@/components/admin/ui/admin-ui'
import { PROJECT_STATUS } from '@/components/admin/ui/admin-statuses'
import DetailGallery from '@/components/shared/detail/detail-gallery'
import DetailPortfolio from '@/components/shared/detail/detail-portfolio'
import ModelSummary from '@/components/models/[slug]/model-summary'
import {
    DetailInfoCard,
    DetailInfoCards,
    DetailProjects,
} from '@/components/shared/detail/detail-info-cards'
import { PORTFOLIO_STEP } from '@/components/models/[slug]/model-detail-data'
import { CabinetBreadcrumb, CabinetEmptyBlock, CabinetTitle } from '@/components/shared/cabinet/cabinet-ui'
import ExecutorProfileSettingsModal from '@/components/executor/dashboard/profile-settings-modal'
import { EMPTY_PROFILE } from '@/components/executor/dashboard/dashboard-data'
import DetailReviews from '@/components/shared/detail/detail-reviews'
import { useApi } from '@/lib/use-api'
import * as performerApi from '@/lib/api/performer'
import { performerCabinet, portfolioFromMedia } from '@/lib/adapters'

// ─────────────────────────────────────────────────────────────────────────────
// «Исполнитель» kabinetining bosh sahifasi — o'z anketasi.
// Figma: to'ldirilmagan 260:11717 · Активна 260:11332 · На модерации 265:15457 ·
// Отклонена 265:14663. Mobil: 415:17509 · 434:15890 · 434:16635 · 434:16328.
//
// Sahifa ochiq saytdagi model anketasi bilan bir xil komponentlardan yig'iladi,
// farqi — yurakcha o'rnida holat + qalam + shesternya (265:14965) va pastdagi
// «Пригласить в проект» tugmasi yo'q.
// ─────────────────────────────────────────────────────────────────────────────

const BREADCRUMB = [
    { label: 'Главная', href: '/' },
    { label: 'Личный кабинет' },
]

const QUESTIONNAIRE = '/executor/questionnaire'

// To'ldirilmagan anketadagi ikonkalar — `ModelSummary`dagi bilan bir xil.
const ICONS = { calendar: Calendar, ruler: Ruler, scale: Scale }

export default function ExecutorDashboard({ openSettings = false }) {
    const [settings, setSettings] = useState(openSettings)

    // GET /performer/cabinet — anketa, bo'limlar holati va usta qadami
    // bitta so'rovda keladi (backend/performer.md).
    const fetcher = useCallback(() => performerApi.cabinet(), [])
    const { data, loading, reload } = useApi(fetcher)

    const executor = useMemo(() => performerCabinet(data), [data])
    const portfolio = useMemo(() => portfolioFromMedia(data?.media), [data])

    if (loading || !executor) {
        return (
            <Container>
                <div className="my-[24px] h-[400px] animate-pulse rounded-[6px] bg-black/5 lg:my-[40px] lg:h-[600px]" />
            </Container>
        )
    }

    const status = executor.status
    const filled = executor.filled
    const state = PROJECT_STATUS[status]
    const EXECUTOR = executor

    const actions = (
        <div className="flex shrink-0 items-center gap-[12px] lg:gap-[16px]">
            {filled && state && (
                <AdminStatus tone={state.tone} className="lg:w-[130px]">
                    {state.label}
                </AdminStatus>
            )}
            <Link
                href={QUESTIONNAIRE}
                aria-label="Редактировать анкету"
                className="ui-icon-btn flex size-[32px] items-center justify-center rounded-[6px] p-[4px]"
            >
                <SquarePen size={24} strokeWidth={2} />
            </Link>
            <button
                type="button"
                onClick={() => setSettings(true)}
                aria-label="Настройка профиля"
                className="ui-icon-btn flex size-[32px] cursor-pointer items-center justify-center rounded-[6px] p-[4px]"
            >
                <Settings size={24} strokeWidth={2} />
            </button>
        </div>
    )

    return (
        <div className="flex flex-col gap-[24px] bg-light-white pt-[16px] pb-[40px] lg:gap-[50px] lg:pt-[24px] lg:pb-[100px]">
            <Container className="flex flex-col gap-[16px] lg:gap-[24px]">
                <CabinetBreadcrumb items={BREADCRUMB} />

                {status === 'rejected' && (
                    <RejectedBanner comment={executor.moderationComment} />
                )}

                <div className="flex flex-col gap-[16px] lg:flex-row lg:gap-[16px]">
                    {filled ? (
                        <>
                            <DetailGallery photos={EXECUTOR.photos} alt={EXECUTOR.name} />
                            <ModelSummary model={EXECUTOR} actions={actions} />
                        </>
                    ) : (
                        <>
                            <EmptyGallery />
                            <EmptySummary actions={actions} profile={executor} />
                        </>
                    )}
                </div>
            </Container>

            <Container>
                {filled ? (
                    <DetailInfoCards>
                        <DetailInfoCard
                            title="Параметры"
                            columns={[EXECUTOR.params.slice(0, 6), EXECUTOR.params.slice(6)]}
                        />
                        <DetailInfoCard title="Стоимость" columns={[EXECUTOR.prices]} />
                    </DetailInfoCards>
                ) : (
                    <DetailInfoCards>
                        <EmptyCard title="Параметры" block={EMPTY_PROFILE.blocks.params} />
                        <EmptyCard title="Стоимость" block={EMPTY_PROFILE.blocks.prices} />
                    </DetailInfoCards>
                )}
            </Container>

            <Container>
                {filled ? (
                    <DetailProjects title="Опыт участия в проектах" projects={EXECUTOR.projects} />
                ) : (
                    <EmptyCard
                        title="Опыт участия в проектах"
                        block={EMPTY_PROFILE.blocks.projects}
                    />
                )}
            </Container>

            <Container>
                {filled ? (
                    <DetailPortfolio
                        tabs={portfolio.tabs}
                        items={portfolio.items}
                        step={PORTFOLIO_STEP}
                    />
                ) : (
                    <div className="flex flex-col gap-[16px] lg:gap-[24px]">
                        <CabinetTitle>Портфолио</CabinetTitle>
                        <CabinetEmptyBlock {...EMPTY_PROFILE.blocks.portfolio} />
                    </div>
                )}
            </Container>

            {/* Отзывы — kabinetda «Оставить отзыв» tugmasi yo'q
                (Figma 320:12206 / 260:11332). */}
            <Container className="flex flex-col gap-[16px] lg:gap-[24px]">
                {executor.reviews.length > 0 ? (
                    <DetailReviews rating={executor.rating} reviews={executor.reviews} step={6} />
                ) : (
                    <>
                        <CabinetTitle>Отзывы</CabinetTitle>
                        <CabinetEmptyBlock {...EMPTY_PROFILE.blocks.reviews} />
                    </>
                )}
            </Container>

            {settings && (
                <ExecutorProfileSettingsModal
                    open
                    onClose={() => setSettings(false)}
                    profile={executor}
                    onSaved={reload}
                />
            )}
        </div>
    )
}

// Rad etilgan anketa izohi (Figma 265:14667).
function RejectedBanner({ comment }) {
    return (
        <div className="flex flex-col gap-[12px] rounded-[6px] bg-[#fdecec] p-[12px] lg:flex-row lg:items-center lg:justify-between lg:p-[16px]">
            <div className="flex flex-col gap-[8px]">
                <p className="text-[14px] font-bold text-[#d14343] lg:text-[16px]">
                    Анкета отклонена
                </p>
                <p className="text-[12px] leading-[18px] text-[#d14343] lg:text-[14px] lg:leading-[20px]">
                    {comment || 'Проверьте данные анкеты и отправьте её на модерацию повторно.'}
                </p>
            </div>
            <Link
                href={QUESTIONNAIRE}
                className="flex shrink-0 items-center justify-center rounded-[6px] bg-white px-[16px] py-[12px] text-[14px] font-medium text-black transition-colors hover:bg-light-white lg:px-[24px] lg:py-[16px] lg:text-[16px]"
            >
                Исправить профиль
            </Link>
        </div>
    )
}

// Rasm o'rniga bo'sh maydon — 554×600, ichida 200px ikonka (Figma 260:11730).
function EmptyGallery() {
    return (
        <div className="flex h-[400px] shrink-0 items-center justify-center rounded-[6px] bg-[#d9d9d9] lg:h-[600px] lg:w-[554px]">
            <ImageIcon size={200} strokeWidth={1} aria-hidden className="text-[#c4c4c4]" />
        </div>
    )
}

// To'ldirilmagan anketaning asosiy kartochkasi (Figma 415:17936).
// Kartochka chapdagi bo'sh maydon bilan bir balandlikda — 600px (260:11746),
// rasm esa qolgan bo'sh joyni egallaydi (415:17937 — aspect 722/309, flex-1).
function EmptySummary({ actions, profile }) {
    return (
        <div className="flex min-w-0 flex-1 flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:h-[600px] lg:gap-[24px] lg:p-[24px]">
            <div className="flex flex-col gap-[16px]">
                <div className="flex items-center justify-between gap-[16px]">
                    <h1 className="text-[18px] leading-[24px] font-medium text-black lg:text-[32px] lg:leading-[39px]">
                        {profile?.name || EMPTY_PROFILE.name}
                    </h1>
                    {actions}
                </div>

                {/* Ma'lumot yo'q — Figma'da yosh, bo'y va vazn o'rnida chiziqcha. */}
                <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px] text-[14px] font-medium text-grey lg:text-[16px]">
                    <EmptyMeta icon="calendar" />
                    <EmptyMeta icon="ruler" />
                    <EmptyMeta icon="scale" />
                    <span className="flex items-center gap-[8px]">
                        <MapPin
                            size={24}
                            strokeWidth={1.75}
                            className="size-[20px] shrink-0 text-gold lg:size-[24px]"
                        />
                        {profile?.city || EMPTY_PROFILE.city}
                    </span>
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[16px] text-center">
                <div className="relative h-[160px] w-full max-w-[652px] shrink-0 lg:h-auto lg:min-h-0 lg:flex-1">
                    <Image
                        src={EMPTY_PROFILE.image}
                        alt=""
                        fill
                        sizes="652px"
                        className="object-contain"
                    />
                </div>
                <p className="text-[16px] font-semibold text-black lg:text-[20px]">
                    {EMPTY_PROFILE.title}
                </p>
                <p className="text-[14px] leading-[20px] text-grey lg:text-[18px] lg:leading-[24px]">
                    {EMPTY_PROFILE.text}
                </p>
                <Link
                    href={QUESTIONNAIRE}
                    className="ui-shine relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-[6px] border border-gold px-[24px] py-[12px] text-[14px] font-medium whitespace-nowrap text-gold transition-colors hover:bg-gold hover:text-white lg:w-[240px] lg:py-[16px] lg:text-[18px]"
                >
                    <span className="relative">Заполнить профиль</span>
                </Link>
            </div>
        </div>
    )
}

// Qiymati yo'q parametr — ikonka va chiziqcha (Figma 260:11757).
// Tarozi ikonkasi lucide'da yo'q, shuning uchun `ModelSummary`dagidek `Scale`.
function EmptyMeta({ icon }) {
    const Icon = ICONS[icon]
    return (
        <span className="flex items-center gap-[8px]">
            <Icon
                size={24}
                strokeWidth={1.75}
                className="size-[20px] shrink-0 text-gold lg:size-[24px]"
            />
            -
        </span>
    )
}

// Bo'sh bo'lim kartochkasi (Figma 260:11803).
function EmptyCard({ title, block }) {
    return (
        <section className="flex min-w-0 flex-1 flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
            <CabinetTitle>{title}</CabinetTitle>
            <CabinetEmptyBlock {...block} />
        </section>
    )
}
