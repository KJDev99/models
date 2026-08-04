'use client'

import React, { useEffect, useState } from 'react'
import Container from '@/components/ui/container'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Breadcrumb from '@/components/ui/breadcrumb'
import Spinner from '@/components/ui/spinner'
import EmptyState from '@/components/ui/empty-state'
import Gallery from '@/components/shared/gallery'
import ProfileHeader from '@/components/shared/profile-header'
import ReviewCard from '@/components/shared/review-card'
import FavoriteButton from '@/components/shared/favorite-button'
import AuthRequiredModal from '@/components/shared/auth-required-modal'
import InviteModal from '@/components/shared/invite-modal'
import ComplaintModal from '@/components/shared/complaint-modal'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { formatAge, formatPrice } from '@/lib/format'
import { ROLES } from '@/lib/roles'
import { useAuth } from '@/lib/use-auth'
import { useApiStore } from '@/store/useApiStore'

// Модель / фотограф / видеограф анкетаси (Figma: 129:5247, 129:7022, 136:7645).
// Uchala katalog uchun bitta komponent — farqi `type` va breadcrumb'da.
export default function ExecutorDetail({ slug, type = 'model', basePath = '/models', typeLabel = 'Модели' }) {
    const getData = useApiStore((s) => s.getData)
    const { authed, role } = useAuth()

    const [executor, setExecutor] = useState(null)
    const [loading, setLoading] = useState(true)
    const [authModal, setAuthModal] = useState(false)
    const [inviteModal, setInviteModal] = useState(false)
    const [complaintModal, setComplaintModal] = useState(false)

    useEffect(() => {
        if (!slug) return
        let alive = true
        getData(`/executors/${slug}/`).then((res) => {
            if (!alive) return
            setExecutor(res.success ? res.data : null)
            setLoading(false)
        })
        return () => {
            alive = false
        }
    }, [slug, getData])

    // Mehmon himoyalangan amalni bosganda "Требуется вход" chiqadi.
    function guarded(action) {
        return () => (authed ? action() : setAuthModal(true))
    }

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Spinner size={32} />
            </div>
        )
    }

    if (!executor) {
        return (
            <Container className="my-12">
                <EmptyState
                    title="Анкета не найдена"
                    description="Возможно, исполнитель скрыл профиль или ссылка устарела."
                    actionText="В каталог"
                    actionHref={basePath}
                />
            </Container>
        )
    }

    const canInvite = authed && [ROLES.CLIENT, ROLES.COMPANY, ROLES.AGENCY].includes(role)

    const params = [
        { label: 'Возраст', value: executor.age != null ? formatAge(executor.age) : null },
        { label: 'Рост', value: executor.height ? `${executor.height} см` : null },
        { label: 'Параметры', value: executor.measurements },
        { label: 'Размер одежды', value: executor.clothingSize },
        { label: 'Размер обуви', value: executor.shoeSize },
        { label: 'Цвет волос', value: executor.hairColor },
        { label: 'Цвет глаз', value: executor.eyeColor },
        { label: 'Город', value: executor.city },
        { label: 'Опыт', value: executor.experience },
        { label: 'Стоимость смены', value: executor.price != null ? formatPrice(executor.price) : null },
    ].filter((p) => p.value)

    return (
        <Container className="my-8 lg:my-12">
            <div className="mb-6">
                <Breadcrumb
                    items={[
                        { name: 'Главная', href: '/' },
                        { name: typeLabel, href: basePath },
                        { name: executor.name },
                    ]}
                />
            </div>

            <ProfileHeader
                cover={executor.cover}
                avatar={executor.avatar || executor.photos?.[0]?.url}
                name={executor.name}
                subtitle={executor.category}
                city={executor.city}
                rating={executor.rating}
                reviewsCount={executor.reviewsCount}
                actions={
                    <>
                        {canInvite && (
                            <Button onClick={guarded(() => setInviteModal(true))}>
                                Пригласить в проект
                            </Button>
                        )}
                        <Button variant="whiteStroke" onClick={guarded(() => {})} href={authed ? `/chat?to=${executor.id}` : undefined}>
                            Написать
                        </Button>
                        <FavoriteButton
                            className="border border-black/10"
                            item={{
                                type: FAVORITE_TYPES.EXECUTOR,
                                id: executor.id,
                                slug: executor.slug,
                                title: executor.name,
                                image: executor.avatar,
                            }}
                        />
                    </>
                }
            />

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
                <div className="flex min-w-0 flex-col gap-6">
                    {executor.about && (
                        <Card title="О себе">
                            <p className="whitespace-pre-line text-base text-black">{executor.about}</p>
                        </Card>
                    )}

                    <Card title="Портфолио">
                        <Gallery photos={executor.photos || []} />
                    </Card>

                    {executor.projects?.length > 0 && (
                        <Card title="Опыт участия в проектах">
                            <ul className="flex flex-col gap-4">
                                {executor.projects.map((p) => (
                                    <li
                                        key={p.id}
                                        className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 pb-4 last:border-0 last:pb-0"
                                    >
                                        <div>
                                            <p className="text-base text-black">{p.title}</p>
                                            {p.company && <p className="text-sm text-grey">{p.company}</p>}
                                        </div>
                                        <span className="text-sm text-grey">{p.year}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}

                    <Card title={`Отзывы${executor.reviewsCount ? ` (${executor.reviewsCount})` : ''}`}>
                        {executor.reviews?.length ? (
                            <div className="flex flex-col gap-4">
                                {executor.reviews.map((r) => (
                                    <ReviewCard key={r.id} review={r} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-base text-grey">Отзывов пока нет.</p>
                        )}
                    </Card>
                </div>

                <aside className="flex flex-col gap-6">
                    <Card title="Параметры">
                        <dl className="flex flex-col gap-3">
                            {params.map((p) => (
                                <div key={p.label} className="flex items-center justify-between gap-4">
                                    <dt className="text-sm text-grey">{p.label}</dt>
                                    <dd className="text-base text-black">{p.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </Card>

                    <button
                        type="button"
                        onClick={guarded(() => setComplaintModal(true))}
                        className="text-sm text-grey underline-offset-4 transition-colors hover:text-danger hover:underline"
                    >
                        Пожаловаться на анкету
                    </button>
                </aside>
            </div>

            <AuthRequiredModal
                open={authModal}
                onClose={() => setAuthModal(false)}
                action="связаться с исполнителем"
            />
            <InviteModal
                open={inviteModal}
                onClose={() => setInviteModal(false)}
                executor={executor}
            />
            <ComplaintModal
                open={complaintModal}
                onClose={() => setComplaintModal(false)}
                target={{ type: 'executor', id: executor.id, name: executor.name }}
            />
        </Container>
    )
}
