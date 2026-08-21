'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, SquarePen, User } from 'lucide-react'
import { AdminBreadcrumb } from '@/components/admin/ui/admin-form'
import { AdminRowMenu, AdminStatus } from '@/components/admin/ui/admin-ui'
import { publicationMenu } from '@/components/admin/ui/admin-menu-items'
import { DeleteModal } from '@/components/admin/ui/admin-modals'
import { PROJECT_STATUS } from '@/components/admin/ui/admin-statuses'
// `project` — `adminProjectDetail()` adapteri natijasi (lib/adapters.js).

// ─────────────────────────────────────────────────────────────────────────────
// Loyiha sahifasi — Figma «активен» 343:11886 / mobil 456:21576.
// Ochiq saytdagi sahifaning o'zi: «Подать заявку» o'rniga holat, tahrirlash
// va «⋮».
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminProjectDetail({
    project,
    details,
    editHref,
    backHref = '/admin/projects',
    decisionBar = null,
    onPause,
    onResume,
    onFinish,
    onDelete,
}) {
    const router = useRouter()
    const [removing, setRemoving] = useState(false)

    const status = project.status || 'draft'
    const state = PROJECT_STATUS[status] || PROJECT_STATUS.draft
    const blocks = details || project.detailsBlocks || { intro: '', blocks: [] }
    const href = editHref || `/admin/projects/${project.id}/edit`

    return (
        <>
            <AdminBreadcrumb
                items={[
                    { label: 'Административная панель', href: '/admin/dashboard' },
                    { label: project.title },
                ]}
            />

            {decisionBar}

            <div className="flex flex-col gap-[16px] lg:gap-[24px]">
                {/* ── Hero: rasm + asosiy kartochka (Figma 343:11890) ───────── */}
                <div className="flex flex-col gap-[16px] lg:flex-row lg:items-stretch">
                    <div className="relative h-[280px] shrink-0 overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:h-[600px] lg:w-[554px]">
                        <Image
                            src={project.image || FALLBACK_COVER}
                            alt={project.title}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 554px"
                            className="object-cover"
                        />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
                        <div className="flex flex-col gap-[16px] lg:gap-[24px]">
                            <div className="flex flex-wrap items-center justify-between gap-[12px]">
                                <h1 className="text-[20px] font-medium text-black lg:text-[32px]">
                                    {project.title}
                                </h1>
                                <div className="flex items-center gap-[12px] lg:gap-[16px]">
                                    <AdminStatus tone={state.tone} className="lg:w-[130px]">
                                        {state.label}
                                    </AdminStatus>
                                    <button
                                        type="button"
                                        onClick={() => router.push(href)}
                                        aria-label="Редактировать"
                                        className="flex size-[32px] cursor-pointer items-center justify-center rounded-[6px] ui-icon-btn p-[4px]"
                                    >
                                        <SquarePen size={24} strokeWidth={2} />
                                    </button>
                                    <span className="flex size-[32px] items-center justify-center rounded-[6px] ui-icon-btn p-[4px]">
                                        <AdminRowMenu compact
                                            items={publicationMenu({
                                                status,
                                                onEdit: () =>
                                                    router.push(href),
                                                onPause,
                                                onResume,
                                                onFinish,
                                                onDelete: () => setRemoving(true),
                                            })}
                                        />
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-[16px] text-[14px] font-medium text-grey lg:text-[16px]">
                                <Meta icon={Calendar}>{project.date}</Meta>
                                <Meta icon={MapPin}>{project.city}</Meta>
                                <Meta icon={User}>{project.need}</Meta>
                            </div>

                            <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                                <h2 className="text-[16px] font-bold text-black lg:text-[18px]">
                                    О проекте
                                </h2>
                                <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                                    {project.about}
                                </p>
                            </div>

                            <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                                <h2 className="text-[16px] font-bold text-black lg:text-[18px]">
                                    Кого ищем
                                </h2>
                                <div className="flex flex-wrap gap-[8px] lg:gap-[16px]">
                                    {project.requirements.map((item) => (
                                        <span
                                            key={item}
                                            className="rounded-[6px] bg-light-white px-[12px] py-[8px] text-[12px] font-medium text-grey lg:text-[16px]"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-[16px] lg:flex-row lg:items-center lg:justify-between">
                            <p className="text-[16px] font-bold text-black lg:text-[18px]">
                                {project.hourlyRate || project.budget || ''}
                            </p>

                            <div
                                className={`items-center gap-[12px] rounded-[6px] bg-light-white p-[12px] lg:p-[16px] ${
                                    project.company ? 'flex' : 'hidden'
                                }`}
                            >
                                <span className="relative block size-[32px] shrink-0 overflow-hidden rounded-full bg-white lg:size-[39px]">
                                    <Image
                                        src={project.company?.logo || FALLBACK_LOGO}
                                        alt={project.company?.name || ''}
                                        fill
                                        sizes="39px"
                                        className="object-contain"
                                    />
                                </span>
                                <span className="flex min-w-0 flex-col gap-[2px]">
                                    <span className="truncate text-[14px] font-medium text-black lg:text-[16px]">
                                        {project.company?.name}
                                    </span>
                                    <span className="truncate text-[12px] text-grey">
                                        {project.company?.more}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Подробнее о проекте (Figma 343:11974) ─────────────────── */}
                <section className="flex flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
                    <h2 className="font-display text-[24px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:tracking-[0.64px]">
                        Подробнее о проекте
                    </h2>
                    <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                        {blocks.intro}
                    </p>
                    {blocks.blocks.map((block) => (
                        <div key={block.title} className="flex flex-col gap-[8px] lg:gap-[12px]">
                            <h3 className="text-[14px] font-bold text-black lg:text-[16px]">
                                {block.title}
                            </h3>
                            <ul className="flex list-disc flex-col gap-[4px] ps-[24px] text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                                {block.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>

                {/* ── Место съёмки (Figma 343:12053) ────────────────────────── */}
                <section className="flex flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
                    <h2 className="font-display text-[24px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:tracking-[0.64px]">
                        Место съёмки
                    </h2>

                    <div className="flex flex-col gap-[8px] lg:gap-[12px]">
                        {[
                            ['Адрес:', project.address],
                            ['Время:', project.time],
                        ].map(([label, value]) => (
                            <div key={label} className="flex gap-[16px]">
                                <span className="w-[45px] shrink-0 text-[14px] font-medium text-grey lg:w-[60px] lg:text-[16px]">
                                    {label}
                                </span>
                                <span className="min-w-0 flex-1 text-[14px] font-medium text-black lg:text-[16px]">
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Xarita — haqiqiy karta ulanmagan, Figma'dagi joy egallovchi. */}
                    <div className="h-[200px] w-full rounded-[6px] bg-[#e8eaed] lg:h-[400px]" />
                </section>
            </div>

            <DeleteModal
                open={removing}
                onClose={() => setRemoving(false)}
                name={project.title}
                onConfirm={() => {
                    if (onDelete) onDelete()
                    else router.push(backHref)
                }}
            />
        </>
    )
}

// Zakazchik logotipi bo'lmasa (Figma'da doim bor).
const FALLBACK_LOGO = '/img/placeholder.svg'
const FALLBACK_COVER = '/img/placeholder.svg'

function Meta({ icon: Icon, children }) {
    return (
        <span className="flex items-center gap-[8px]">
            <Icon size={20} strokeWidth={1.75} className="shrink-0 text-gold" />
            {children}
        </span>
    )
}
