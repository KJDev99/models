'use client'

import React, { useEffect, useState } from 'react'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Avatar from '@/components/ui/avatar'
import Spinner from '@/components/ui/spinner'
import EmptyState from '@/components/ui/empty-state'
import StatusBadge from '@/components/ui/status-badge'
import ExecutorCard from '@/components/shared/executor-card'
import ModerationNotice from '@/components/shared/moderation-notice'
import { formatPhone } from '@/lib/format'
import { useApiStore } from '@/store/useApiStore'

// Figma: LUMEN AGENCY (270:20518) va "Пустой профиль" (270:19929).
export default function AgencyDashboard() {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const [agency, setAgency] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let alive = true
        getDataToken('/agencies/mine/').then((res) => {
            if (!alive) return
            setAgency(res.success ? res.data : null)
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

    if (!agency) {
        return (
            <EmptyState
                title="Профиль агентства не заполнен"
                description="Добавьте название, город и описание — после модерации агентство появится в каталоге."
                actionText="Заполнить профиль"
                actionHref="/agency/settings"
            />
        )
    }

    const rows = [
        { label: 'Название', value: agency.name },
        { label: 'Город', value: agency.city },
        { label: 'ИНН', value: agency.inn },
        { label: 'Телефон', value: formatPhone(agency.phone) },
        { label: 'Почта', value: agency.email },
        { label: 'Сайт', value: agency.site },
    ].filter((r) => r.value)

    const stats = [
        { label: 'Исполнителей', value: agency.executorsCount ?? 0 },
        { label: 'Активных проектов', value: agency.activeProjects ?? 0 },
        { label: 'Приглашений', value: agency.invitesCount ?? 0 },
        { label: 'Отзывов', value: agency.reviewsCount ?? 0 },
    ]

    return (
        <div className="flex flex-col gap-6">
            <ModerationNotice status={agency.status} reason={agency.rejectReason} />

            <Card
                title="Профиль агентства"
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        {agency.status && <StatusBadge status={agency.status} />}
                        <Button href="/agency/settings" variant="whiteStroke" size="sm">
                            Редактировать
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-wrap items-start gap-5">
                    <Avatar src={agency.logo} name={agency.name} size="xl" />
                    <dl className="flex min-w-[240px] flex-1 flex-col gap-3">
                        {rows.map((r) => (
                            <div key={r.label} className="flex items-center justify-between gap-4">
                                <dt className="text-sm text-grey">{r.label}</dt>
                                <dd className="text-base text-black">{r.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {agency.about && (
                    <p className="mt-6 whitespace-pre-line text-base text-black">{agency.about}</p>
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
                title="Наши исполнители"
                action={
                    <Button href="/agency/executors" variant="whiteStroke" size="sm">
                        Все исполнители
                    </Button>
                }
            >
                {agency.executors?.length ? (
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                        {agency.executors.slice(0, 8).map((e) => (
                            <ExecutorCard key={e.id} executor={e} basePath="/agency/executors" />
                        ))}
                    </div>
                ) : (
                    <p className="text-base text-grey">Исполнителей пока нет.</p>
                )}
            </Card>
        </div>
    )
}
