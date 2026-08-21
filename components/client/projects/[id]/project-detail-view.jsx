'use client'

import React, { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, SquarePen, User } from 'lucide-react'
import Container from '@/components/ui/container'
import { ClientBreadcrumb } from '@/components/client/ui/client-ui'
import { AdminRowMenu, AdminStatus } from '@/components/admin/ui/admin-ui'
import { publicationMenu } from '@/components/admin/ui/admin-menu-items'
import { DeleteModal } from '@/components/admin/ui/admin-modals'
import { PROJECT_STATUS } from '@/components/admin/ui/admin-statuses'
import { useApi, useAction } from '@/lib/use-api'
import * as customerApi from '@/lib/api/customer'
import { projectDetail } from '@/lib/adapters'

// ─────────────────────────────────────────────────────────────────────────────
// «Заказчик» kabinetidagi loyiha sahifasi — Figma «активен» 216:5469 /
// «отклонен» 216:5737, mobil 413:15206 / 413:15417.
//
// Ochiq saytdagi loyiha sahifasining o'zi, faqat «Подать заявку» o'rniga
// holat yorlig'i, tahrirlash va «⋮». Rad etilganda tepada pushti banner.
// ─────────────────────────────────────────────────────────────────────────────
export default function ClientProjectDetail({ id }) {
    const router = useRouter()
    const [removing, setRemoving] = useState(false)

    // GET /customer/projects/{id} — o'z loyihasi (backend/customer.md).
    const fetcher = useCallback(() => customerApi.project(id), [id])
    const { data, loading, error, reload } = useApi(fetcher, { enabled: Boolean(id) })

    const project = useMemo(() => projectDetail(data), [data])
    const details = project?.detailsBlocks || { intro: '', blocks: [] }

    const archive = useAction(customerApi.archiveProject)
    const draft = useAction(customerApi.draftProject)
    const submit = useAction(customerApi.submitProject)
    const remove = useAction(customerApi.deleteProject)

    async function run(promise, message) {
        const res = await promise
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success(message)
        reload()
    }

    if (loading || error || !project) {
        return (
            <Container>
                <div className="py-[16px] lg:py-[24px]">
                    {loading ? (
                        <div className="h-[600px] animate-pulse rounded-[6px] bg-black/5" />
                    ) : (
                        <p className="rounded-[6px] bg-white p-[40px] text-center text-[14px] text-grey lg:text-[16px]">
                            {error?.message || 'Проект не найден'}
                        </p>
                    )}
                </div>
            </Container>
        )
    }

    const status = project.status
    const state = PROJECT_STATUS[status] || PROJECT_STATUS.draft
    const editHref = `/client/projects/${id}/edit`

    return (
        <Container>
            <div className="flex flex-col gap-[16px] py-[16px] lg:gap-[24px] lg:py-[24px]">
                <ClientBreadcrumb
                    items={[
                        { label: 'Главная', href: '/' },
                        { label: 'Личный кабинет', href: '/client/dashboard' },
                        { label: project.title },
                    ]}
                />

                {/* Rad etilgan loyiha uchun izoh (Figma 216:5741). */}
                {status === 'rejected' && (
                    <div className="flex flex-col gap-[12px] rounded-[6px] bg-[#fdecec] p-[12px] lg:flex-row lg:items-center lg:justify-between lg:p-[16px]">
                        <div className="flex flex-col gap-[8px]">
                            <p className="text-[14px] font-bold text-[#d14343] lg:text-[16px]">
                                Проект отклонён
                            </p>
                            <p className="text-[12px] leading-[18px] text-[#d14343] lg:text-[14px] lg:leading-[20px]">
                                Необходимо дополнить описание проекта и указать точный адрес съёмки.
                            </p>
                        </div>
                        <Link
                            href={editHref}
                            className="flex shrink-0 items-center justify-center rounded-[6px] bg-white px-[16px] py-[12px] text-[14px] font-medium text-black transition-colors hover:bg-light-white lg:px-[24px] lg:py-[16px] lg:text-[16px]"
                        >
                            Исправить проект
                        </Link>
                    </div>
                )}

                {/* ── Rasm + asosiy kartochka (Figma 216:5473) ──────────────── */}
                <div className="flex flex-col gap-[12px] lg:flex-row lg:items-stretch lg:gap-[16px]">
                    <div className="relative h-[280px] shrink-0 overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:h-[600px] lg:w-[554px]">
                        <Image
                            src={project.image}
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
                                    <AdminStatus tone={state.tone}>{state.label}</AdminStatus>
                                    <Link
                                        href={editHref}
                                        aria-label="Редактировать"
                                        className="ui-icon-btn flex size-[32px] items-center justify-center rounded-[6px] p-[4px]"
                                    >
                                        <SquarePen size={24} strokeWidth={2} />
                                    </Link>
                                    <span className="ui-icon-btn flex size-[32px] items-center justify-center rounded-[6px] p-[4px]">
                                        <AdminRowMenu compact
                                            items={publicationMenu({
                                                status,
                                                onEdit: () => router.push(editHref),
                                                // «Пауза» — arxivga, «Возобновить» —
                                                // qayta moderatsiyaga (backend/customer.md).
                                                onPause: () =>
                                                    run(draft.run(id), 'Проект снят с публикации'),
                                                onResume: () =>
                                                    run(submit.run(id), 'Проект отправлен на модерацию'),
                                                onFinish: () =>
                                                    run(archive.run(id), 'Проект завершён'),
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

                            <Block title="О проекте">
                                <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                                    {project.about}
                                </p>
                            </Block>

                            <Block title="Кого ищем">
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
                            </Block>
                        </div>

                        <p className="text-[16px] font-bold text-black lg:text-[18px]">
                            {project.price}
                        </p>
                    </div>
                </div>

                {/* ── Подробнее о проекте (Figma 216:5551) ──────────────────── */}
                <section className="flex flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
                    <h2 className="font-display text-[24px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:tracking-[0.64px]">
                        Подробнее о проекте
                    </h2>
                    <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                        {details.intro}
                    </p>
                    {details.blocks.map((block) => (
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

                {/* ── Место съёмки (Figma 216:5630) ─────────────────────────── */}
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
                onConfirm={async () => {
                    const res = await remove.run(id)
                    setRemoving(false)
                    if (!res.success) {
                        toast.error(res.error.message)
                        return
                    }
                    toast.success('Проект удалён')
                    router.push('/client/dashboard')
                }}
            />
        </Container>
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

function Meta({ icon: Icon, children }) {
    return (
        <span className="flex items-center gap-[8px]">
            <Icon size={20} strokeWidth={1.75} className="shrink-0 text-gold" />
            {children}
        </span>
    )
}
