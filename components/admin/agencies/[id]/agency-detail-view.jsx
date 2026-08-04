'use client'

import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Avatar from '@/components/ui/avatar'
import Spinner from '@/components/ui/spinner'
import EmptyState from '@/components/ui/empty-state'
import StatusBadge from '@/components/ui/status-badge'
import ConfirmModal from '@/components/ui/confirm-modal'
import ExecutorCard from '@/components/shared/executor-card'
import { STATUS } from '@/lib/statuses'
import { formatDate, formatPhone } from '@/lib/format'
import { useApiStore } from '@/store/useApiStore'

// Figma: LUMEN AGENCY admin ko'rinishida (338:18370).
export default function AdminAgencyDetail({ id }) {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const postDataToken = useApiStore((s) => s.postDataToken)

    const [agency, setAgency] = useState(null)
    const [loading, setLoading] = useState(true)
    const [blockOpen, setBlockOpen] = useState(false)

    // setState `.then()` ichida chaqiriladi — effekt tanasida sinxron
    // holat o'zgartirish React Compiler qoidalarini buzadi.
    const load = useCallback(() => {
        getDataToken(`/admin/agencies/${id}/`).then((res) => {
            setAgency(res.success ? res.data : null)
            setLoading(false)
        })
    }, [id, getDataToken])

    useEffect(() => {
        if (id) load()
    }, [id, load])

    const blocked = agency?.status === STATUS.BLOCKED

    async function act(action) {
        const res = await postDataToken(`/admin/agencies/${id}/${action}/`, {})
        if (res.success) {
            toast.success('Готово')
            setBlockOpen(false)
            load()
        } else {
            toast.error('Не удалось выполнить действие')
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Spinner size={32} />
            </div>
        )
    }

    if (!agency) {
        return <EmptyState title="Агентство не найдено" actionText="К списку" actionHref="/admin/agencies" />
    }

    const rows = [
        { label: 'ИНН', value: agency.inn },
        { label: 'Город', value: agency.city },
        { label: 'Телефон', value: formatPhone(agency.phone) },
        { label: 'Почта', value: agency.email },
        { label: 'Сайт', value: agency.site },
        { label: 'Регистрация', value: formatDate(agency.createdAt) },
    ].filter((r) => r.value)

    return (
        <div className="flex flex-col gap-6">
            <Card
                title={agency.name}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={agency.status} />
                        <Button size="sm" onClick={() => act('approve')}>
                            Опубликовать
                        </Button>
                        <Button
                            variant={blocked ? 'gold' : 'danger'}
                            size="sm"
                            onClick={() => setBlockOpen(true)}
                        >
                            {blocked ? 'Разблокировать' : 'Заблокировать'}
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

            <Card title="Исполнители агентства">
                {agency.executors?.length ? (
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                        {agency.executors.map((e) => (
                            <ExecutorCard key={e.id} executor={e} basePath="/admin/executors" />
                        ))}
                    </div>
                ) : (
                    <p className="text-base text-grey">Исполнителей нет.</p>
                )}
            </Card>

            <ConfirmModal
                open={blockOpen}
                onClose={() => setBlockOpen(false)}
                onConfirm={() => act(blocked ? 'unblock' : 'block')}
                title={blocked ? 'Разблокировать агентство?' : 'Заблокировать агентство?'}
                description={
                    blocked
                        ? 'Агентство снова появится в каталоге.'
                        : 'Агентство и его анкеты будут скрыты с платформы.'
                }
                confirmText={blocked ? 'Разблокировать' : 'Заблокировать'}
                danger={!blocked}
            />
        </div>
    )
}
