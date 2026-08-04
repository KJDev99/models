'use client'

import React, { useEffect, useState } from 'react'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Avatar from '@/components/ui/avatar'
import Spinner from '@/components/ui/spinner'
import EmptyState from '@/components/ui/empty-state'
import Gallery from '@/components/shared/gallery'
import ModerationNotice from '@/components/shared/moderation-notice'
import { STATUS } from '@/lib/statuses'
import { formatAge, formatPrice } from '@/lib/format'
import { useApiStore } from '@/store/useApiStore'

// Figma: "Анкета активна" (260:11332), "На модерации" (265:15457),
// "Анкета отклонена" (265:14663) — bitta sahifa, holat bannerи bilan.
export default function ExecutorDashboard() {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let alive = true
        getDataToken('/executors/mine/').then((res) => {
            if (!alive) return
            setProfile(res.success ? res.data : null)
            setLoading(false)
        })
        return () => {
            alive = false
        }
    }, [getDataToken])

    if (loading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Spinner size={32} />
            </div>
        )
    }

    if (!profile) {
        return (
            <EmptyState
                title="Анкета не заполнена"
                description="Заполните анкету — после модерации она появится в каталоге и вас начнут приглашать."
                actionText="Заполнить анкету"
                actionHref="/executor/questionnaire"
            />
        )
    }

    const params = [
        { label: 'Возраст', value: profile.age != null ? formatAge(profile.age) : null },
        { label: 'Рост', value: profile.height ? `${profile.height} см` : null },
        { label: 'Параметры', value: profile.measurements },
        { label: 'Город', value: profile.city },
        { label: 'Стоимость смены', value: profile.price != null ? formatPrice(profile.price) : null },
    ].filter((p) => p.value)

    const stats = [
        { label: 'Просмотров анкеты', value: profile.viewsCount ?? 0 },
        { label: 'Приглашений', value: profile.invitesCount ?? 0 },
        { label: 'Откликов', value: profile.responsesCount ?? 0 },
        { label: 'Отзывов', value: profile.reviewsCount ?? 0 },
    ]

    return (
        <div className="flex flex-col gap-6">
            <ModerationNotice
                status={profile.status || STATUS.DRAFT}
                reason={profile.rejectReason}
                actionText={
                    profile.status === STATUS.REJECTED ? 'Исправить анкету' : 'Редактировать анкету'
                }
                actionHref="/executor/questionnaire"
            />

            <Card
                title="Моя анкета"
                action={
                    <Button href="/executor/questionnaire" variant="whiteStroke" size="sm">
                        Редактировать
                    </Button>
                }
            >
                <div className="flex flex-wrap items-start gap-5">
                    <Avatar src={profile.avatar} name={profile.name} size="xl" />
                    <dl className="flex min-w-[240px] flex-1 flex-col gap-3">
                        {params.map((p) => (
                            <div key={p.label} className="flex items-center justify-between gap-4">
                                <dt className="text-sm text-grey">{p.label}</dt>
                                <dd className="text-base text-black">{p.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {profile.about && (
                    <p className="mt-6 whitespace-pre-line text-base text-black">{profile.about}</p>
                )}
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s) => (
                    <Card key={s.label}>
                        <p className="text-sm text-grey">{s.label}</p>
                        <p className="mt-2 text-[28px] leading-none text-black">{s.value}</p>
                    </Card>
                ))}
            </div>

            <Card
                title="Портфолио"
                action={
                    <Button href="/executor/portfolio" variant="whiteStroke" size="sm">
                        Управлять
                    </Button>
                }
            >
                <Gallery photos={(profile.photos || []).slice(0, 8)} />
            </Card>
        </div>
    )
}
