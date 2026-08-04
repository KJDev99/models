'use client'

import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Avatar from '@/components/ui/avatar'
import Spinner from '@/components/ui/spinner'
import Textarea from '@/components/ui/textarea'
import EmptyState from '@/components/ui/empty-state'
import StatusBadge from '@/components/ui/status-badge'
import ConfirmModal from '@/components/ui/confirm-modal'
import Modal from '@/components/ui/modal'
import Gallery from '@/components/shared/gallery'
import { formatAge, formatDate, formatPrice } from '@/lib/format'
import { useApiStore } from '@/store/useApiStore'

// Figma: Анкета (334:14442) + "Опубликовать профиль?" (344:15883)
// + "Отклонить профиль" (344:15121) + Заблокировать (345:18087).
export default function AdminExecutorDetail({ id }) {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const postDataToken = useApiStore((s) => s.postDataToken)

    const [executor, setExecutor] = useState(null)
    const [loading, setLoading] = useState(true)
    const [approveOpen, setApproveOpen] = useState(false)
    const [rejectOpen, setRejectOpen] = useState(false)
    const [blockOpen, setBlockOpen] = useState(false)
    const [reason, setReason] = useState('')

    // setState `.then()` ichida chaqiriladi — effekt tanasida sinxron
    // holat o'zgartirish React Compiler qoidalarini buzadi.
    const load = useCallback(() => {
        getDataToken(`/admin/executors/${id}/`).then((res) => {
            setExecutor(res.success ? res.data : null)
            setLoading(false)
        })
    }, [id, getDataToken])

    useEffect(() => {
        if (id) load()
    }, [id, load])

    async function act(action, body) {
        const res = await postDataToken(`/admin/executors/${id}/${action}/`, body || {})
        if (res.success) {
            toast.success('Готово')
            setApproveOpen(false)
            setRejectOpen(false)
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

    if (!executor) {
        return <EmptyState title="Анкета не найдена" actionText="К списку" actionHref="/admin/executors" />
    }

    const rows = [
        { label: 'Тип', value: executor.type },
        { label: 'Возраст', value: executor.age != null ? formatAge(executor.age) : null },
        { label: 'Рост', value: executor.height ? `${executor.height} см` : null },
        { label: 'Параметры', value: executor.measurements },
        { label: 'Город', value: executor.city },
        { label: 'Агентство', value: executor.agency?.name },
        { label: 'Телефон', value: executor.phone },
        { label: 'Почта', value: executor.email },
        { label: 'Стоимость смены', value: executor.price != null ? formatPrice(executor.price) : null },
        { label: 'Создана', value: formatDate(executor.createdAt) },
    ].filter((r) => r.value)

    return (
        <div className="flex flex-col gap-6">
            <Card
                title={executor.name}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={executor.status} />
                        <Button size="sm" onClick={() => setApproveOpen(true)}>
                            Опубликовать
                        </Button>
                        <Button variant="whiteStroke" size="sm" onClick={() => setRejectOpen(true)}>
                            Отклонить
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => setBlockOpen(true)}>
                            Заблокировать
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-wrap items-start gap-5">
                    <Avatar src={executor.avatar} name={executor.name} size="xl" />
                    <dl className="flex min-w-[240px] flex-1 flex-col gap-3">
                        {rows.map((r) => (
                            <div key={r.label} className="flex items-center justify-between gap-4">
                                <dt className="text-sm text-grey">{r.label}</dt>
                                <dd className="text-base text-black">{r.value}</dd>
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
                open={approveOpen}
                onClose={() => setApproveOpen(false)}
                onConfirm={() => act('approve')}
                title="Опубликовать профиль?"
                description="Анкета появится в каталоге и станет доступна заказчикам."
                confirmText="Опубликовать"
            />

            <Modal
                open={rejectOpen}
                onClose={() => setRejectOpen(false)}
                title="Отклонить профиль"
                description="Укажите причину — исполнитель увидит её в кабинете."
                footer={
                    <>
                        <Button variant="danger" onClick={() => act('reject', { reason })}>
                            Отклонить
                        </Button>
                        <Button variant="whiteStroke" onClick={() => setRejectOpen(false)}>
                            Отмена
                        </Button>
                    </>
                }
            >
                <Textarea
                    label="Причина"
                    value={reason}
                    maxLength={500}
                    onChange={(e) => setReason(e.target.value)}
                />
            </Modal>

            <ConfirmModal
                open={blockOpen}
                onClose={() => setBlockOpen(false)}
                onConfirm={() => act('block', { reason })}
                title="Заблокировать исполнителя?"
                description="Аккаунт потеряет доступ к платформе, анкета скроется из каталога."
                confirmText="Заблокировать"
                danger
            />
        </div>
    )
}
