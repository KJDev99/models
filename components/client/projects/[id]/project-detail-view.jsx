'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Tabs from '@/components/ui/tabs'
import Spinner from '@/components/ui/spinner'
import EmptyState from '@/components/ui/empty-state'
import StatusBadge from '@/components/ui/status-badge'
import ExecutorCard from '@/components/shared/executor-card'
import ModerationNotice from '@/components/shared/moderation-notice'
import { formatDate, formatPrice } from '@/lib/format'
import { useApiStore } from '@/store/useApiStore'

// Figma: проект "активен" (216:5469) / "отклонен" (216:5737) — bitta sahifa,
// holatiga qarab yuqorida banner chiqadi.
const TABS = [
    { label: 'Отклики', value: 'responses' },
    { label: 'Приглашённые', value: 'invited' },
    { label: 'Утверждённые', value: 'approved' },
]

export default function ClientProjectDetail({ id }) {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState('responses')

    // setState `.then()` ichida chaqiriladi — effekt tanasida sinxron
    // holat o'zgartirish React Compiler qoidalarini buzadi.
    const load = useCallback(() => {
        getDataToken(`/projects/${id}/`).then((res) => {
            setProject(res.success ? res.data : null)
            setLoading(false)
        })
    }, [id, getDataToken])

    useEffect(() => {
        if (id) load()
    }, [id, load])

    if (loading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Spinner size={32} />
            </div>
        )
    }

    if (!project) {
        return <EmptyState title="Проект не найден" actionText="К проектам" actionHref="/client/projects" />
    }

    const people = project[tab] || []

    return (
        <div className="flex flex-col gap-6">
            <ModerationNotice status={project.status} reason={project.rejectReason} />

            <Card
                title={project.title}
                action={
                    <div className="flex flex-wrap gap-2">
                        <StatusBadge status={project.status} />
                        <Button href={`/client/projects/${id}/edit`} variant="whiteStroke" size="sm">
                            Редактировать
                        </Button>
                    </div>
                }
            >
                <p className="whitespace-pre-line text-base text-black">{project.description}</p>

                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="flex justify-between gap-4">
                        <dt className="text-sm text-grey">Дата съёмки</dt>
                        <dd className="text-base text-black">{formatDate(project.startDate)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-sm text-grey">Гонорар</dt>
                        <dd className="text-base text-black">{formatPrice(project.fee)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-sm text-grey">Город</dt>
                        <dd className="text-base text-black">{project.city || '—'}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-sm text-grey">Откликов</dt>
                        <dd className="text-base text-black">{project.responsesCount ?? 0}</dd>
                    </div>
                </dl>
            </Card>

            <Card title="Исполнители" padded={false} className="border-0 bg-transparent">
                <Tabs items={TABS} value={tab} onChange={setTab} className="mb-6" />

                {people.length === 0 ? (
                    <EmptyState
                        title="Пока никого"
                        description="Пригласите исполнителей из каталога — они появятся здесь."
                        actionText="В каталог"
                        actionHref="/client/models"
                    />
                ) : (
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
                        {people.map((e) => (
                            <ExecutorCard key={e.id} executor={e} basePath="/client/models" />
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}
