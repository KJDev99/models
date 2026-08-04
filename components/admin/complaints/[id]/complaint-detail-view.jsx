'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
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
import { formatDateTime } from '@/lib/format'
import { useApiStore } from '@/store/useApiStore'

// Figma: Жалоба (344:16561 / 345:17457) + "Отклонить жалобу?" (345:17769)
// + "Переписка участников" (344:17016).
export default function AdminComplaintDetail({ id }) {
    const router = useRouter()
    const getDataToken = useApiStore((s) => s.getDataToken)
    const postDataToken = useApiStore((s) => s.postDataToken)

    const [complaint, setComplaint] = useState(null)
    const [loading, setLoading] = useState(true)
    const [acceptOpen, setAcceptOpen] = useState(false)
    const [declineOpen, setDeclineOpen] = useState(false)
    const [comment, setComment] = useState('')

    // setState `.then()` ichida chaqiriladi — effekt tanasida sinxron
    // holat o'zgartirish React Compiler qoidalarini buzadi.
    const load = useCallback(() => {
        getDataToken(`/admin/complaints/${id}/`).then((res) => {
            setComplaint(res.success ? res.data : null)
            setLoading(false)
        })
    }, [id, getDataToken])

    useEffect(() => {
        if (id) load()
    }, [id, load])

    async function act(action, body) {
        const res = await postDataToken(`/admin/complaints/${id}/${action}/`, body || {})
        if (res.success) {
            toast.success('Готово')
            router.push('/admin/complaints')
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

    if (!complaint) {
        return <EmptyState title="Жалоба не найдена" actionText="К списку" actionHref="/admin/complaints" />
    }

    return (
        <div className="flex flex-col gap-6">
            <Card
                title={complaint.reason}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={complaint.status} />
                        <Button variant="danger" size="sm" onClick={() => setAcceptOpen(true)}>
                            Принять и заблокировать
                        </Button>
                        <Button variant="whiteStroke" size="sm" onClick={() => setDeclineOpen(true)}>
                            Отклонить жалобу
                        </Button>
                    </div>
                }
            >
                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <p className="mb-2 text-sm text-grey">От кого</p>
                        <div className="flex items-center gap-3">
                            <Avatar src={complaint.author?.avatar} name={complaint.author?.name} />
                            <span className="text-base text-black">{complaint.author?.name}</span>
                        </div>
                    </div>
                    <div>
                        <p className="mb-2 text-sm text-grey">На кого</p>
                        <div className="flex items-center gap-3">
                            <Avatar src={complaint.target?.avatar} name={complaint.target?.name} />
                            <span className="text-base text-black">{complaint.target?.name}</span>
                        </div>
                    </div>
                </div>

                {complaint.comment && (
                    <p className="mt-6 whitespace-pre-line text-base text-black">{complaint.comment}</p>
                )}

                <p className="mt-4 text-sm text-grey">
                    Поступила {formatDateTime(complaint.createdAt)}
                </p>

                {complaint.chatId && (
                    <Link
                        href={`/admin/chats/${complaint.chatId}`}
                        className="mt-4 inline-block text-base text-gold hover:opacity-80"
                    >
                        Открыть переписку участников →
                    </Link>
                )}
            </Card>

            <ConfirmModal
                open={acceptOpen}
                onClose={() => setAcceptOpen(false)}
                onConfirm={() => act('accept', { comment })}
                title="Принять жалобу?"
                description="Нарушитель будет заблокирован, автор жалобы получит уведомление."
                confirmText="Принять"
                danger
            />

            <Modal
                open={declineOpen}
                onClose={() => setDeclineOpen(false)}
                title="Отклонить жалобу?"
                description="Комментарий увидит автор жалобы."
                footer={
                    <>
                        <Button onClick={() => act('decline', { comment })}>Отклонить</Button>
                        <Button variant="whiteStroke" onClick={() => setDeclineOpen(false)}>
                            Отмена
                        </Button>
                    </>
                }
            >
                <Textarea
                    label="Комментарий"
                    value={comment}
                    maxLength={500}
                    onChange={(e) => setComment(e.target.value)}
                />
            </Modal>
        </div>
    )
}
