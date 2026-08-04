'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Avatar from '@/components/ui/avatar'
import Spinner from '@/components/ui/spinner'
import Textarea from '@/components/ui/textarea'
import EmptyState from '@/components/ui/empty-state'
import StatusBadge from '@/components/ui/status-badge'
import Modal from '@/components/ui/modal'
import ConfirmModal from '@/components/ui/confirm-modal'
import Gallery from '@/components/shared/gallery'
import { formatDate } from '@/lib/format'
import { useApiStore } from '@/store/useApiStore'

// Figma: Анкета на модерации (344:14840) + "Отклонить профиль" (344:15121)
// + "Опубликовать профиль?" (344:15883).
export default function AdminModerationDetail({ id }) {
    const router = useRouter()
    const getDataToken = useApiStore((s) => s.getDataToken)
    const postDataToken = useApiStore((s) => s.postDataToken)

    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [approveOpen, setApproveOpen] = useState(false)
    const [rejectOpen, setRejectOpen] = useState(false)
    const [reason, setReason] = useState('')

    // setState `.then()` ichida chaqiriladi — effekt tanasida sinxron
    // holat o'zgartirish React Compiler qoidalarini buzadi.
    const load = useCallback(() => {
        getDataToken(`/admin/moderation/${id}/`).then((res) => {
            setItem(res.success ? res.data : null)
            setLoading(false)
        })
    }, [id, getDataToken])

    useEffect(() => {
        if (id) load()
    }, [id, load])

    async function act(action, body) {
        const res = await postDataToken(`/admin/moderation/${id}/${action}/`, body || {})
        if (res.success) {
            toast.success('Готово')
            router.push('/admin/moderation')
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

    if (!item) {
        return <EmptyState title="Заявка не найдена" actionText="К очереди" actionHref="/admin/moderation" />
    }

    const fields = Object.entries(item.fields || {})

    return (
        <div className="flex flex-col gap-6">
            <Card
                title={item.title}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={item.status} />
                        <Button size="sm" onClick={() => setApproveOpen(true)}>
                            Опубликовать
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => setRejectOpen(true)}>
                            Отклонить
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-wrap items-start gap-5">
                    <Avatar src={item.author?.avatar} name={item.author?.name} size="lg" />
                    <div>
                        <p className="text-base text-black">{item.author?.name}</p>
                        <p className="text-sm text-grey">Поступило {formatDate(item.createdAt)}</p>
                    </div>
                </div>

                {fields.length > 0 && (
                    <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                        {fields.map(([key, value]) => (
                            <div key={key} className="flex justify-between gap-4">
                                <dt className="text-sm text-grey">{key}</dt>
                                <dd className="text-right text-base text-black">{String(value)}</dd>
                            </div>
                        ))}
                    </dl>
                )}
            </Card>

            {item.photos?.length > 0 && (
                <Card title="Фотографии">
                    <Gallery photos={item.photos} />
                </Card>
            )}

            <ConfirmModal
                open={approveOpen}
                onClose={() => setApproveOpen(false)}
                onConfirm={() => act('approve')}
                title="Опубликовать?"
                description="Объект появится в каталоге."
                confirmText="Опубликовать"
            />

            <Modal
                open={rejectOpen}
                onClose={() => setRejectOpen(false)}
                title="Отклонить"
                description="Причина будет видна автору в кабинете."
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
