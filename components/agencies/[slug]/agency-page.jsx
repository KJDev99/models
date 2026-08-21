'use client'

import React, { useCallback, useMemo } from 'react'
import Image from 'next/image'
import Container from '@/components/ui/container'
import Breadcrumb from '@/components/ui/breadcrumb'
import AgencySummary from '@/components/agencies/[slug]/agency-summary'
import AgencyExecutors from '@/components/agencies/[slug]/agency-executors'
import {
    EXECUTORS_SORT_OPTIONS,
    EXECUTORS_STEP,
} from '@/components/agencies/[slug]/agency-detail-data'
import DetailState from '@/components/shared/detail/detail-state'
import { useApi } from '@/lib/use-api'
import * as site from '@/lib/api/site'
import { agencyDetail } from '@/lib/adapters'

// ─────────────────────────────────────────────────────────────────────────────
// Agentlik sahifasi. Figma: desktop 164:13583, mobil 377:14960.
//
// Boshqa anketa sahifalaridan farqi: galereya, portfolio va sharhlar yo'q —
// faqat logotip, agentlik haqidagi kartochka va «Исполнители» ro'yxati.
// ─────────────────────────────────────────────────────────────────────────────
export default function AgencyPage({ slug }) {
    const fetcher = useCallback(() => site.agency(slug), [slug])
    const { data: raw, loading, error, reload } = useApi(fetcher, { enabled: Boolean(slug) })

    const agency = useMemo(() => agencyDetail(raw), [raw])

    if (loading || error || !agency) {
        return (
            <DetailState
                loading={loading}
                error={error}
                onRetry={reload}
                breadcrumb={[
                    { name: 'Главная', href: '/' },
                    { name: 'Агентства', href: '/agencies' },
                ]}
            />
        )
    }

    const breadcrumb = [
        { name: 'Главная', href: '/' },
        { name: 'Агентства', href: '/agencies' },
        { name: agency.name },
    ]

    return (
        <div className="flex flex-col gap-[24px] bg-light-white pt-[16px] lg:pt-[24px] pb-[40px] lg:gap-[50px] lg:pb-[100px]">
            <Container className="flex flex-col gap-[16px] lg:gap-[24px]">
                <Breadcrumb items={breadcrumb} />

                {/* Hero: logotip + asosiy kartochka (Figma 164:13621) */}
                <div className="flex flex-col gap-[16px] lg:flex-row lg:gap-[16px]">
                    <div className="relative h-[280px] w-full shrink-0 overflow-hidden rounded-[6px] bg-white lg:size-[554px]">
                        <Image
                            src={agency.logo}
                            alt={agency.name}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 554px"
                            className="object-cover"
                        />
                    </div>

                    <AgencySummary agency={agency} />
                </div>
            </Container>

            <Container>
                <AgencyExecutors
                    executors={agency.executors}
                    tabs={agency.executorTabs}
                    step={EXECUTORS_STEP}
                    sortOptions={EXECUTORS_SORT_OPTIONS}
                />
            </Container>
        </div>
    )
}
