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
import Gallery from '@/components/shared/gallery'
import { formatDate, formatPrice } from '@/lib/format'
import { useApiStore } from '@/store/useApiStore'

// Figma: Studio Loft 21 admin ko'rinishida (343:12110).
export default function AdminVenueDetail({ id }) {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const postDataToken = useApiStore((s) => s.postDataToken)

    const [venue, setVenue] = useState(null)
    const [loading, setLoading] = useState(true)
    const [approveOpen, setApproveOpen] = useState(false)
    const [rejectOpen, setRejectOpen] = useState(false)
    const [reason, setReason] = useState('')

    // setState `.then()` ichida chaqiriladi — effekt tanasida sinxron
    // holat o'zgartirish React Compiler qoidalarini buzadi.
    const load = useCallback(() => {
        getDataToken(`/admin/venues/${id}/`).then((res) => {
            setVenue(res.success ? res.data : null)
            setLoading(false)
        })
    }, [id, getDataToken])

    useEffect(() => {
        if (id) load()
    }, [id, load])

    async function act(action, body) {
        const res = await postDataToken(`/admin/venues/${id}/${action}/`, body || {})
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

    if (!venue) {
        return <EmptyState title="Площадка не найдена" actionText="К списку" actionHref="/admin/venues" />
    }

    const rows = [
        { label: 'Владелец', value: venue.owner?.name },
        { label: 'Город', value: venue.city },
        { label: 'Адрес', value: venue.address },
        { label: 'Площадь', value: venue.area ? `${venue.area} м²` : null },
        { label: 'Цена за час', value: venue.pricePerHour != null ? formatPrice(venue.pricePerHour) : null },
        { label: 'Добавлена', value: formatDate(venue.createdAt) },
    ].filter((r) => r.value)

    return (
        <div className="flex flex-col gap-6">
            <Card
                title={venue.name}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={venue.status} />
                        <Button size="sm" onClick={() => setApproveOpen(true)}>
                            Опубликовать
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => setRejectOpen(true)}>
                            Отклонить
                        </Button>
                    </div>
                }
            >
                <dl className="grid gap-3 sm:grid-cols-2">
                    {rows.map((r) => (
                        <div key={r.label} className="flex justify-between gap-4">
                            <dt className="text-sm text-grey">{r.label}</dt>
                            <dd className="text-base text-black">{r.value}</dd>
                        </div>
                    ))}
                </dl>

                {venue.description && (
                    <p className="mt-6 whitespace-pre-line text-base text-black">{venue.description}</p>
                )}
            </Card>

            <Card title="Фотографии">
                <Gallery photos={venue.photos || []} />
            </Card>

            <ConfirmModal
                open={approveOpen}
                onClose={() => setApproveOpen(false)}
                onConfirm={() => act('approve')}
                title="Опубликовать площадку?"
                description="Площадка появится в каталоге и станет доступна для бронирования."
                confirmText="Опубликовать"
            />

            <Modal
                open={rejectOpen}
                onClose={() => setRejectOpen(false)}
                title="Отклонить площадку"
                description="Причина будет видна владельцу в кабинете."
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
