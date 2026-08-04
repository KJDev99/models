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
import ProjectCard from '@/components/shared/project-card'
import { STATUS } from '@/lib/statuses'
import { formatDate, formatPhone } from '@/lib/format'
import { useApiStore } from '@/store/useApiStore'

// Figma: "Профиль компании - проекты" admin ko'rinishida (338:16465) +
// Заблокировать / Разблокировать (345:18087, 345:18890).
export default function AdminClientDetail({ id }) {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const postDataToken = useApiStore((s) => s.postDataToken)

    const [client, setClient] = useState(null)
    const [loading, setLoading] = useState(true)
    const [blockOpen, setBlockOpen] = useState(false)

    // setState `.then()` ichida chaqiriladi — effekt tanasida sinxron
    // holat o'zgartirish React Compiler qoidalarini buzadi.
    const load = useCallback(() => {
        getDataToken(`/admin/clients/${id}/`).then((res) => {
            setClient(res.success ? res.data : null)
            setLoading(false)
        })
    }, [id, getDataToken])

    useEffect(() => {
        if (id) load()
    }, [id, load])

    const blocked = client?.status === STATUS.BLOCKED

    async function toggleBlock() {
        const res = await postDataToken(
            `/admin/clients/${id}/${blocked ? 'unblock' : 'block'}/`,
            {}
        )
        if (res.success) {
            toast.success(blocked ? 'Аккаунт разблокирован' : 'Аккаунт заблокирован')
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

    if (!client) {
        return <EmptyState title="Заказчик не найден" actionText="К списку" actionHref="/admin/clients" />
    }

    const rows = [
        { label: 'Тип', value: client.isCompany ? 'Компания' : 'Частное лицо' },
        { label: 'ИНН', value: client.inn },
        { label: 'Город', value: client.city },
        { label: 'Телефон', value: formatPhone(client.phone) },
        { label: 'Почта', value: client.email },
        { label: 'Регистрация', value: formatDate(client.createdAt) },
    ].filter((r) => r.value)

    return (
        <div className="flex flex-col gap-6">
            <Card
                title={client.name}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={client.status} />
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
                    <Avatar src={client.logo || client.avatar} name={client.name} size="xl" />
                    <dl className="flex min-w-[240px] flex-1 flex-col gap-3">
                        {rows.map((r) => (
                            <div key={r.label} className="flex items-center justify-between gap-4">
                                <dt className="text-sm text-grey">{r.label}</dt>
                                <dd className="text-base text-black">{r.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </Card>

            <Card title="Проекты">
                {client.projects?.length ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
                        {client.projects.map((p) => (
                            <ProjectCard key={p.id} project={p} basePath="/admin/projects" showStatus />
                        ))}
                    </div>
                ) : (
                    <p className="text-base text-grey">Проектов нет.</p>
                )}
            </Card>

            <ConfirmModal
                open={blockOpen}
                onClose={() => setBlockOpen(false)}
                onConfirm={toggleBlock}
                title={blocked ? 'Разблокировать аккаунт?' : 'Заблокировать аккаунт?'}
                description={
                    blocked
                        ? 'Заказчик снова получит доступ к платформе.'
                        : 'Заказчик потеряет доступ, его проекты будут скрыты.'
                }
                confirmText={blocked ? 'Разблокировать' : 'Заблокировать'}
                danger={!blocked}
            />
        </div>
    )
}
