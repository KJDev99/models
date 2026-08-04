'use client'

import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'
import Textarea from '@/components/ui/textarea'
import EmptyState from '@/components/ui/empty-state'
import StatusBadge from '@/components/ui/status-badge'
import Modal from '@/components/ui/modal'
import ConfirmModal from '@/components/ui/confirm-modal'
import ExecutorCard from '@/components/shared/executor-card'
import { formatDate, formatPrice } from '@/lib/format'
import { useApiStore } from '@/store/useApiStore'

// Figma: проект admin ko'rinishida — "активен" (343:11886).
export default function AdminProjectDetail({ id }) {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const postDataToken = useApiStore((s) => s.postDataToken)

    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [approveOpen, setApproveOpen] = useState(false)
    const [rejectOpen, setRejectOpen] = useState(false)
    const [reason, setReason] = useState('')

    // setState `.then()` ichida chaqiriladi — effekt tanasida sinxron
    // holat o'zgartirish React Compiler qoidalarini buzadi.
    const load = useCallback(() => {
        getDataToken(`/admin/projects/${id}/`).then((res) => {
            setProject(res.success ? res.data : null)
            setLoading(false)
        })
    }, [id, getDataToken])

    useEffect(() => {
        if (id) load()
    }, [id, load])

    async function act(action, body) {
        const res = await postDataToken(`/admin/projects/${id}/${action}/`, body || {})
        if (res.success) {
            toast.success('Готово')
            setApproveOpen(false)
            setRejectOpen(false)
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

    if (!project) {
        return <EmptyState title="Проект не найден" actionText="К списку" actionHref="/admin/projects" />
    }

    return (
        <div className="flex flex-col gap-6">
            <Card
                title={project.title}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={project.status} />
                        <Button size="sm" onClick={() => setApproveOpen(true)}>
                            Опубликовать
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => setRejectOpen(true)}>
                            Отклонить
                        </Button>
                    </div>
                }
            >
                <p className="whitespace-pre-line text-base text-black">{project.description}</p>

                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="flex justify-between gap-4">
                        <dt className="text-sm text-grey">Заказчик</dt>
                        <dd className="text-base text-black">
                            {project.company?.name || project.owner?.name || '—'}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-sm text-grey">Дата съёмки</dt>
                        <dd className="text-base text-black">{formatDate(project.startDate)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-sm text-grey">Гонорар</dt>
                        <dd className="text-base text-black">{formatPrice(project.fee)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-sm text-grey">Откликов</dt>
                        <dd className="text-base text-black">{project.responsesCount ?? 0}</dd>
                    </div>
                </dl>
            </Card>

            <Card title="Участники">
                {project.approved?.length ? (
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                        {project.approved.map((e) => (
                            <ExecutorCard key={e.id} executor={e} basePath="/admin/executors" />
                        ))}
                    </div>
                ) : (
                    <p className="text-base text-grey">Утверждённых исполнителей нет.</p>
                )}
            </Card>

            <ConfirmModal
                open={approveOpen}
                onClose={() => setApproveOpen(false)}
                onConfirm={() => act('approve')}
                title="Опубликовать проект?"
                description="Проект появится в открытом каталоге кастингов."
                confirmText="Опубликовать"
            />

            <Modal
                open={rejectOpen}
                onClose={() => setRejectOpen(false)}
                title="Отклонить проект"
                description="Причина будет видна заказчику в кабинете."
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
        </div>
    )
}
