'use client'

import React from 'react'
import Image from 'next/image'
import Container from '@/components/ui/container'
import Breadcrumb from '@/components/ui/breadcrumb'
import AgencySummary from '@/components/agencies/[slug]/agency-summary'
import AgencyExecutors from '@/components/agencies/[slug]/agency-executors'
import {
    AGENCY,
    EXECUTORS,
    EXECUTORS_SORT_OPTIONS,
    EXECUTORS_STEP,
    EXECUTOR_TABS,
} from '@/components/agencies/[slug]/agency-detail-data'

// ─────────────────────────────────────────────────────────────────────────────
// Agentlik sahifasi. Figma: desktop 164:13583, mobil 377:14960.
//
// Boshqa anketa sahifalaridan farqi: galereya, portfolio va sharhlar yo'q —
// faqat logotip, agentlik haqidagi kartochka va «Исполнители» ro'yxati.
// ─────────────────────────────────────────────────────────────────────────────
export default function AgencyPage({ slug }) {
    const agency = { ...AGENCY, slug: slug || AGENCY.slug }

    const breadcrumb = [
        { name: 'Главная', href: '/' },
        { name: 'Агентства', href: '/agencies' },
        { name: agency.name },
    ]

    return (
        <div className="flex flex-col gap-[24px] bg-light-white pt-[24px] pb-[40px] lg:gap-[50px] lg:pb-[100px]">
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
                    executors={EXECUTORS}
                    tabs={EXECUTOR_TABS}
                    step={EXECUTORS_STEP}
                    sortOptions={EXECUTORS_SORT_OPTIONS}
                />
            </Container>
        </div>
    )
}
