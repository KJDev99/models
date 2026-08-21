'use client'

import React, { useCallback, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Image as ImageIcon, Mail, Phone, SquarePen } from 'lucide-react'
import toast from 'react-hot-toast'
import Container from '@/components/ui/container'
import Button from '@/components/ui/button'
import { CabinetBreadcrumb } from '@/components/shared/cabinet/cabinet-ui'
import { rowMenu } from '@/components/admin/ui/admin-menu-items'
import { DeleteModal } from '@/components/admin/ui/admin-modals'
import AgencyExecutorsBlock from '@/components/agency/dashboard/executors-block'
import AgencyProfileModal from '@/components/agency/dashboard/profile-modal'
import { EMPTY_AGENCY, EXECUTORS_STEP } from '@/components/agency/dashboard/dashboard-data'
import { useApi, useAction } from '@/lib/use-api'
import * as agencyApi from '@/lib/api/agency'
import { agencyCabinet } from '@/lib/adapters'

// ─────────────────────────────────────────────────────────────────────────────
// «Агентство» kabinetining bosh sahifasi.
// Figma: to'ldirilgan 270:20518 (mobil 437:17337), bo'sh 270:19929
// (mobil 435:15962), «Редактировать профиль» oynasi 270:21182 / 270:20938.
//
// Chapda 554px logotip, o'ngda oq kartochka: nom, izoh, «О агентстве»,
// «Контакты», to'rtta plitka va «Добавить исполнителя». Ostida «Исполнители».
// ─────────────────────────────────────────────────────────────────────────────

const BREADCRUMB = [{ label: 'Главная', href: '/' }, { label: 'Личный кабинет' }]

export default function AgencyDashboard({ openSettings = false }) {
    const router = useRouter()
    const [editing, setEditing] = useState(openSettings)
    const [removing, setRemoving] = useState(null)

    // GET /agency/cabinet — profil, hisoblagichlar va ijrochilar (backend/agency.md).
    const fetcher = useCallback(() => agencyApi.cabinet(), [])
    const { data, loading, reload } = useApi(fetcher)

    const AGENCY = useMemo(() => agencyCabinet(data), [data])

    const removePerformer = useAction(agencyApi.deletePerformer)
    const hidePerformer = useAction(agencyApi.setPerformerHidden)

    if (loading || !AGENCY) {
        return (
            <Container>
                <div className="my-[24px] h-[400px] animate-pulse rounded-[6px] bg-black/5 lg:my-[40px] lg:h-[600px]" />
            </Container>
        )
    }

    const executors = AGENCY.executors
    // Profil to'ldirilgan deb hisoblaymiz, agar logotip yoki tavsif bo'lsa.
    const filled = Boolean(data?.logo_url || data?.about)
    const EXECUTOR_TABS = agencyTabs(AGENCY.statsRaw)

    return (
        <div className="flex flex-col gap-[24px] bg-light-white pt-[16px] pb-[40px] lg:gap-[50px] lg:pt-[24px] lg:pb-[100px]">
            <Container className="flex flex-col gap-[16px] lg:gap-[24px]">
                <CabinetBreadcrumb items={BREADCRUMB} />

                <div className="flex flex-col gap-[16px] lg:flex-row lg:items-stretch lg:gap-[16px]">
                    {/* Logotip — Figma 270:20531: 554×554 kvadrat, rasm to'liq to'ldiradi. */}
                    <div className="relative flex h-[280px] shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-white lg:h-auto lg:min-h-[400px] lg:w-[554px]">
                        {data?.logo_url ? (
                            <Image
                                src={AGENCY.logo}
                                alt={AGENCY.name}
                                fill
                                sizes="(max-width: 1024px) 100vw, 554px"
                                className="object-cover"
                            />
                        ) : (
                            <span className="flex size-full items-center justify-center bg-[#d9d9d9]">
                                <ImageIcon
                                    size={200}
                                    strokeWidth={1}
                                    aria-hidden
                                    className="text-[#c4c4c4]"
                                />
                            </span>
                        )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
                        <div className="flex items-start justify-between gap-[16px]">
                            <h1 className="font-display text-[24px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:tracking-[0.64px]">
                                {AGENCY.name}
                            </h1>
                            <button
                                type="button"
                                onClick={() => setEditing(true)}
                                aria-label="Редактировать профиль"
                                className="ui-icon-btn flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] p-[4px]"
                            >
                                <SquarePen size={24} strokeWidth={2} />
                            </button>
                        </div>

                        <p className="flex flex-wrap items-center gap-[12px] text-[14px] text-grey lg:text-[16px]">
                            {filled && <span>{AGENCY.kind}</span>}
                            {filled && <span aria-hidden className="size-[3px] rounded-full bg-grey" />}
                            <span>{AGENCY.city}</span>
                        </p>

                        <Block title="О агентстве">
                            <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                                {filled ? AGENCY.about : EMPTY_AGENCY.about}
                            </p>
                        </Block>

                        <Block title="Контакты">
                            {filled ? (
                                <div className="flex flex-wrap items-center gap-[16px] lg:gap-[24px]">
                                    {AGENCY.phone && <Contact icon={Phone}>{AGENCY.phone}</Contact>}
                                    {AGENCY.email && <Contact icon={Mail}>{AGENCY.email}</Contact>}
                                </div>
                            ) : (
                                <p className="text-[14px] text-grey lg:text-[16px]">
                                    {EMPTY_AGENCY.contacts}
                                </p>
                            )}
                        </Block>

                        <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4 lg:gap-[16px]">
                            {(AGENCY.stats.length ? AGENCY.stats : EMPTY_AGENCY.stats).map((stat) => (
                                <div
                                    key={stat.label}
                                    className="flex flex-col gap-[12px] rounded-[6px] bg-light-white p-[16px]"
                                >
                                    <p className="text-[20px] font-medium text-black lg:text-[24px]">
                                        {stat.value}
                                    </p>
                                    <p className="text-[12px] text-grey lg:text-[14px]">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <Button
                            href="/agency/executors/new"
                            variant="gold"
                            full
                            className="mt-auto lg:w-[353px]"
                        >
                            Добавить исполнителя
                        </Button>
                    </div>
                </div>
            </Container>

            <Container>
                <AgencyExecutorsBlock
                    executors={executors}
                    tabs={EXECUTOR_TABS}
                    step={EXECUTORS_STEP}
                    emptyTitle={EMPTY_AGENCY.emptyTitle}
                    emptyText={EMPTY_AGENCY.emptyText}
                    menuItems={(item) =>
                        rowMenu({
                            status: item.status,
                            onEdit: () => router.push(item.editHref),
                            onToggle: async () => {
                                const res = await hidePerformer.run(item.id, !item.isHidden)
                                if (!res.success) {
                                    toast.error(res.error.message)
                                    return
                                }
                                toast.success('Видимость анкеты изменена')
                                reload()
                            },
                            onDelete: () => setRemoving(item),
                        })
                    }
                />
            </Container>

            {editing && (
                <AgencyProfileModal
                    open
                    onClose={() => setEditing(false)}
                    profile={AGENCY}
                    onSaved={reload}
                />
            )}

            <DeleteModal
                open={Boolean(removing)}
                onClose={() => setRemoving(null)}
                name={removing?.name}
                onConfirm={async () => {
                    const res = await removePerformer.run(removing.id)
                    setRemoving(null)
                    if (!res.success) {
                        toast.error(res.error.message)
                        return
                    }
                    toast.success('Исполнитель удалён')
                    reload()
                }}
            />
        </div>
    )
}

function Block({ title, children }) {
    return (
        <div className="flex flex-col gap-[12px] lg:gap-[16px]">
            <h2 className="text-[16px] font-bold text-black lg:text-[18px]">{title}</h2>
            {children}
        </div>
    )
}

function Contact({ icon: Icon, children }) {
    return (
        <span className="flex items-center gap-[8px] text-[14px] text-grey lg:text-[16px]">
            <Icon size={24} strokeWidth={1.75} className="size-[20px] shrink-0 text-gold lg:size-[24px]" />
            {children}
        </span>
    )
}

// «Исполнители» bo'limi tablari — sonlar kabinet hisoblagichlaridan
// (Figma 270:20604). `key` — backendga yuboriladigan `specialty`.
function agencyTabs(stats = {}) {
    return [
        { key: 'all', label: 'Все', count: stats.performers ?? 0 },
        { key: 'model', label: 'Модели', count: stats.models ?? 0 },
        { key: 'photographer', label: 'Фотографы', count: stats.photographers ?? 0 },
        { key: 'videographer', label: 'Видеографы', count: stats.videographers ?? 0 },
    ]
}
