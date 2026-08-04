'use client'

import React, { useEffect, useState } from 'react'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Avatar from '@/components/ui/avatar'
import EmptyState from '@/components/ui/empty-state'
import Spinner from '@/components/ui/spinner'
import StatusBadge from '@/components/ui/status-badge'
import { formatPhone } from '@/lib/format'
import { useApiStore } from '@/store/useApiStore'

// Figma: Профиль компании (208:4733) va "Пустой профиль" (260:12521).
export default function CompanyDashboard() {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const [company, setCompany] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let alive = true
        getDataToken('/companies/mine/').then((res) => {
            if (!alive) return
            setCompany(res.success ? res.data : null)
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

    if (!company) {
        return (
            <EmptyState
                title="Профиль компании не заполнен"
                description="Добавьте название, ИНН и контакты — без этого проекты не пройдут модерацию."
                actionText="Заполнить профиль"
                actionHref="/company/settings"
            />
        )
    }

    const rows = [
        { label: 'Название', value: company.name },
        { label: 'ИНН', value: company.inn },
        { label: 'Город', value: company.city },
        { label: 'Телефон', value: formatPhone(company.phone) },
        { label: 'Почта', value: company.email },
        { label: 'Сайт', value: company.site },
    ].filter((r) => r.value)

    const stats = [
        { label: 'Активных проектов', value: company.activeProjects ?? 0 },
        { label: 'Площадок', value: company.venuesCount ?? 0 },
        { label: 'Откликов', value: company.responsesCount ?? 0 },
        { label: 'Отзывов', value: company.reviewsCount ?? 0 },
    ]

    return (
        <div className="flex flex-col gap-6">
            <Card
                title="Профиль компании"
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        {company.status && <StatusBadge status={company.status} />}
                        <Button href="/company/settings" variant="whiteStroke" size="sm">
                            Редактировать
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-wrap items-start gap-5">
                    <Avatar src={company.logo} name={company.name} size="xl" />
                    <dl className="flex min-w-[240px] flex-1 flex-col gap-3">
                        {rows.map((r) => (
                            <div key={r.label} className="flex items-center justify-between gap-4">
                                <dt className="text-sm text-grey">{r.label}</dt>
                                <dd className="text-base text-black">{r.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {company.about && (
                    <p className="mt-6 whitespace-pre-line text-base text-black">{company.about}</p>
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
        </div>
    )
}
