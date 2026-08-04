'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Container from '@/components/ui/container'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Breadcrumb from '@/components/ui/breadcrumb'
import Spinner from '@/components/ui/spinner'
import EmptyState from '@/components/ui/empty-state'
import StatusBadge from '@/components/ui/status-badge'
import ApplyModal from '@/components/shared/apply-modal'
import AuthRequiredModal from '@/components/shared/auth-required-modal'
import ComplaintModal from '@/components/shared/complaint-modal'
import { formatDate, formatPrice } from '@/lib/format'
import { ROLES } from '@/lib/roles'
import { useAuth } from '@/lib/use-auth'
import { useApiStore } from '@/store/useApiStore'

// Figma: Съёмка для fashion-бренда (145:10604), "заказчик видит страницу"
// (173:5026) va "Исполнитель видит страницу" (173:5690) — bitta sahifa,
// rolga qarab boshqa amallar ko'rinadi.
export default function ProjectDetail({ slug, basePath = '/projects' }) {
    const getData = useApiStore((s) => s.getData)
    const { authed, role, user } = useAuth()

    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [applyModal, setApplyModal] = useState(false)
    const [authModal, setAuthModal] = useState(false)
    const [complaintModal, setComplaintModal] = useState(false)

    useEffect(() => {
        if (!slug) return
        let alive = true
        getData(`/projects/${slug}/`).then((res) => {
            if (!alive) return
            setProject(res.success ? res.data : null)
            setLoading(false)
        })
        return () => {
            alive = false
        }
    }, [slug, getData])

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Spinner size={32} />
            </div>
        )
    }

    if (!project) {
        return (
            <Container className="my-12">
                <EmptyState
                    title="Проект не найден"
                    description="Возможно, кастинг завершён или ссылка устарела."
                    actionText="Все проекты"
                    actionHref={basePath}
                />
            </Container>
        )
    }

    const isOwner = authed && String(project.ownerId) === String(user?.id)
    const canApply = authed && role === ROLES.EXECUTOR && !isOwner

    const facts = [
        { label: 'Гонорар', value: project.fee != null ? formatPrice(project.fee) : 'По договорённости' },
        { label: 'Дата съёмки', value: formatDate(project.startDate) },
        { label: 'Город', value: project.city },
        { label: 'Площадка', value: project.venue?.name },
        { label: 'Откликов', value: project.responsesCount },
        { label: 'Приём заявок до', value: formatDate(project.deadline) },
    ].filter((f) => f.value != null && f.value !== '—')

    return (
        <Container className="my-8 lg:my-12">
            <div className="mb-6">
                <Breadcrumb
                    items={[
                        { name: 'Главная', href: '/' },
                        { name: 'Проекты', href: basePath },
                        { name: project.title },
                    ]}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
                <div className="flex min-w-0 flex-col gap-6">
                    <Card>
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                            {project.status && <StatusBadge status={project.status} />}
                            {project.category && (
                                <span className="text-sm text-grey">{project.category}</span>
                            )}
                        </div>

                        <h1 className="text-[28px] leading-tight font-medium text-black lg:text-[40px]">
                            {project.title}
                        </h1>

                        {project.company && (
                            <Link
                                href={`/companies/${project.company.slug || project.company.id}`}
                                className="mt-3 inline-block text-base text-gold hover:opacity-80"
                            >
                                {project.company.name}
                            </Link>
                        )}

                        {project.description && (
                            <p className="mt-6 whitespace-pre-line text-base text-black">
                                {project.description}
                            </p>
                        )}
                    </Card>

                    {project.requirements?.length > 0 && (
                        <Card title="Требования к исполнителям">
                            <ul className="flex flex-col gap-3">
                                {project.requirements.map((r, i) => (
                                    <li key={i} className="flex items-start gap-2 text-base text-black">
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                                        {r}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}

                    {project.roles?.length > 0 && (
                        <Card title="Нужны исполнители">
                            <div className="flex flex-wrap gap-2">
                                {project.roles.map((r, i) => (
                                    <span
                                        key={i}
                                        className="rounded-full bg-light-white px-4 py-2 text-base text-black"
                                    >
                                        {r}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>

                <aside className="flex flex-col gap-6">
                    <Card>
                        <dl className="flex flex-col gap-3">
                            {facts.map((f) => (
                                <div key={f.label} className="flex items-start justify-between gap-4">
                                    <dt className="text-sm text-grey">{f.label}</dt>
                                    <dd className="text-right text-base text-black">{f.value}</dd>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-6 flex flex-col gap-3">
                            {isOwner ? (
                                <Button href={`/company/projects/${project.id}`} full>
                                    Управлять проектом
                                </Button>
                            ) : canApply ? (
                                <Button onClick={() => setApplyModal(true)} full>
                                    Откликнуться
                                </Button>
                            ) : (
                                <Button onClick={() => setAuthModal(true)} full>
                                    Откликнуться
                                </Button>
                            )}
                        </div>
                    </Card>

                    <button
                        type="button"
                        onClick={() => (authed ? setComplaintModal(true) : setAuthModal(true))}
                        className="text-sm text-grey underline-offset-4 transition-colors hover:text-danger hover:underline"
                    >
                        Пожаловаться на проект
                    </button>
                </aside>
            </div>

            <ApplyModal open={applyModal} onClose={() => setApplyModal(false)} project={project} />
            <AuthRequiredModal
                open={authModal}
                onClose={() => setAuthModal(false)}
                action="откликнуться на проект"
            />
            <ComplaintModal
                open={complaintModal}
                onClose={() => setComplaintModal(false)}
                target={{ type: 'project', id: project.id, name: project.title }}
            />
        </Container>
    )
}
