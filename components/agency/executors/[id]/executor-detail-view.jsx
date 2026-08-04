'use client'

import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Avatar from '@/components/ui/avatar'
import Spinner from '@/components/ui/spinner'
import EmptyState from '@/components/ui/empty-state'
import StatusBadge from '@/components/ui/status-badge'
import Gallery from '@/components/shared/gallery'
import ConfirmModal from '@/components/ui/confirm-modal'
import ModerationNotice from '@/components/shared/moderation-notice'
import { formatAge, formatPrice } from '@/lib/format'
import { useApiStore } from '@/store/useApiStore'

// Figma: "Модели - Катерина Журавлева" agentlik kabinetida (345:19306).
export default function AgencyExecutorDetail({ id }) {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const deleteDataToken = useApiStore((s) => s.deleteDataToken)

    const [executor, setExecutor] = useState(null)
    const [loading, setLoading] = useState(true)
    const [removeOpen, setRemoveOpen] = useState(false)

    // setState `.then()` ichida chaqiriladi — effekt tanasida sinxron
    // holat o'zgartirish React Compiler qoidalarini buzadi.
    const load = useCallback(() => {
        getDataToken(`/agencies/mine/executors/${id}/`).then((res) => {
            setExecutor(res.success ? res.data : null)
            setLoading(false)
        })
    }, [id, getDataToken])

    useEffect(() => {
        if (id) load()
    }, [id, load])

    async function remove() {
        const res = await deleteDataToken(`/agencies/mine/executors/${id}/`)
        if (res.success) {
            toast.success('Исполнитель откреплён от агентства')
            window.location.href = '/agency/executors'
        } else {
            toast.error('Не удалось открепить')
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Spinner size={32} />
            </div>
        )
    }

    if (!executor) {
        return (
            <EmptyState
                title="Анкета не найдена"
                actionText="К исполнителям"
                actionHref="/agency/executors"
            />
        )
    }

    const params = [
        { label: 'Возраст', value: executor.age != null ? formatAge(executor.age) : null },
        { label: 'Рост', value: executor.height ? `${executor.height} см` : null },
        { label: 'Параметры', value: executor.measurements },
        { label: 'Город', value: executor.city },
        { label: 'Стоимость смены', value: executor.price != null ? formatPrice(executor.price) : null },
    ].filter((p) => p.value)

    return (
        <div className="flex flex-col gap-6">
            <ModerationNotice status={executor.status} reason={executor.rejectReason} />

            <Card
                title={executor.name}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={executor.status} />
                        <Button href={`/agency/executors/${id}/edit`} variant="whiteStroke" size="sm">
                            Редактировать
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => setRemoveOpen(true)}>
                            Открепить
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-wrap items-start gap-5">
                    <Avatar src={executor.avatar} name={executor.name} size="xl" />
                    <dl className="flex min-w-[240px] flex-1 flex-col gap-3">
                        {params.map((p) => (
                            <div key={p.label} className="flex items-center justify-between gap-4">
                                <dt className="text-sm text-grey">{p.label}</dt>
                                <dd className="text-base text-black">{p.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {executor.about && (
                    <p className="mt-6 whitespace-pre-line text-base text-black">{executor.about}</p>
                )}
            </Card>

            <Card title="Портфолио">
                <Gallery photos={executor.photos || []} />
            </Card>

            <ConfirmModal
                open={removeOpen}
                onClose={() => setRemoveOpen(false)}
                onConfirm={remove}
                title="Открепить исполнителя?"
                description="Анкета останется на платформе, но перестанет относиться к вашему агентству."
                confirmText="Открепить"
                danger
            />
        </div>
    )
}
