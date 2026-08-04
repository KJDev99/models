'use client'

import React, { useEffect, useState } from 'react'
import Container from '@/components/ui/container'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Breadcrumb from '@/components/ui/breadcrumb'
import Spinner from '@/components/ui/spinner'
import EmptyState from '@/components/ui/empty-state'
import ProfileHeader from '@/components/shared/profile-header'
import ProjectCard from '@/components/shared/project-card'
import ExecutorCard from '@/components/shared/executor-card'
import VenueCard from '@/components/shared/venue-card'
import ReviewCard from '@/components/shared/review-card'
import ComplaintModal from '@/components/shared/complaint-modal'
import AuthRequiredModal from '@/components/shared/auth-required-modal'
import { useAuth } from '@/lib/use-auth'
import { useApiStore } from '@/store/useApiStore'

// Bitta komponent uch xil ochiq profil uchun:
//   agency  — Агентство (Figma: LUMEN AGENCY 164:13583)
//   company — Профиль компании (171:2745)
//   person  — Профиль частное лицо (173:3550)
const CONFIG = {
    agency: { endpoint: '/agencies/', crumb: 'Агентства', crumbHref: '/agencies', showExecutors: true },
    company: { endpoint: '/companies/', crumb: 'Компании', crumbHref: '/projects', showVenues: true },
    person: { endpoint: '/persons/', crumb: 'Заказчики', crumbHref: '/projects' },
}

export default function OrganizationDetail({ slug, kind = 'agency' }) {
    const cfg = CONFIG[kind] || CONFIG.agency
    const getData = useApiStore((s) => s.getData)
    const { authed } = useAuth()

    const [org, setOrg] = useState(null)
    const [loading, setLoading] = useState(true)
    const [complaintModal, setComplaintModal] = useState(false)
    const [authModal, setAuthModal] = useState(false)

    useEffect(() => {
        if (!slug) return
        let alive = true
        getData(`${cfg.endpoint}${slug}/`).then((res) => {
            if (!alive) return
            setOrg(res.success ? res.data : null)
            setLoading(false)
        })
        return () => {
            alive = false
        }
    }, [slug, cfg.endpoint, getData])

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Spinner size={32} />
            </div>
        )
    }

    if (!org) {
        return (
            <Container className="my-12">
                <EmptyState
                    title="Профиль не найден"
                    description="Возможно, профиль скрыт или ссылка устарела."
                    actionText="На главную"
                    actionHref="/"
                />
            </Container>
        )
    }

    return (
        <Container className="my-8 lg:my-12">
            <div className="mb-6">
                <Breadcrumb
                    items={[
                        { name: 'Главная', href: '/' },
                        { name: cfg.crumb, href: cfg.crumbHref },
                        { name: org.name },
                    ]}
                />
            </div>

            <ProfileHeader
                cover={org.cover}
                avatar={org.logo || org.avatar}
                name={org.name}
                subtitle={org.type || org.industry}
                city={org.city}
                rating={org.rating}
                reviewsCount={org.reviewsCount}
                actions={
                    <Button
                        variant="whiteStroke"
                        href={authed ? `/chat?to=${org.id}` : undefined}
                        onClick={authed ? undefined : () => setAuthModal(true)}
                    >
                        Написать
                    </Button>
                }
            />

            <div className="mt-8 flex flex-col gap-6">
                {org.about && (
                    <Card title="О нас">
                        <p className="whitespace-pre-line text-base text-black">{org.about}</p>
                    </Card>
                )}

                {cfg.showExecutors && org.executors?.length > 0 && (
                    <Card title={`Исполнители (${org.executors.length})`}>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                            {org.executors.map((e) => (
                                <ExecutorCard key={e.id} executor={e} />
                            ))}
                        </div>
                    </Card>
                )}

                {cfg.showVenues && org.venues?.length > 0 && (
                    <Card title="Площадки">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 lg:gap-6">
                            {org.venues.map((v) => (
                                <VenueCard key={v.id} venue={v} />
                            ))}
                        </div>
                    </Card>
                )}

                {org.projects?.length > 0 && (
                    <Card title="Проекты">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 lg:gap-6">
                            {org.projects.map((p) => (
                                <ProjectCard key={p.id} project={p} />
                            ))}
                        </div>
                    </Card>
                )}

                <Card title="Отзывы">
                    {org.reviews?.length ? (
                        <div className="flex flex-col gap-4">
                            {org.reviews.map((r) => (
                                <ReviewCard key={r.id} review={r} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-base text-grey">Отзывов пока нет.</p>
                    )}
                </Card>

                <button
                    type="button"
                    onClick={() => (authed ? setComplaintModal(true) : setAuthModal(true))}
                    className="self-start text-sm text-grey underline-offset-4 transition-colors hover:text-danger hover:underline"
                >
                    Пожаловаться на профиль
                </button>
            </div>

            <ComplaintModal
                open={complaintModal}
                onClose={() => setComplaintModal(false)}
                target={{ type: kind, id: org.id, name: org.name }}
            />
            <AuthRequiredModal
                open={authModal}
                onClose={() => setAuthModal(false)}
                action="написать сообщение"
            />
        </Container>
    )
}
