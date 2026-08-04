'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { useApiStore } from '@/store/useApiStore'

// Figma: "Забронировать" (164:17004) → "Заявка отправлена" (164:18096).
export default function BookingModal({ open, onClose, venue }) {
    const postDataToken = useApiStore((s) => s.postDataToken)
    const [form, setForm] = useState({ date: '', timeFrom: '', timeTo: '', comment: '' })
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    async function submit() {
        if (!form.date) {
            toast.error('Укажите дату съёмки')
            return
        }
        setSending(true)
        const res = await postDataToken('/bookings/', { venueId: venue?.id, ...form })
        setSending(false)
        if (res.success) setSent(true)
        else toast.error('Не удалось отправить заявку')
    }

    if (sent) {
        return (
            <Modal open={open} onClose={onClose} title="Заявка отправлена" width="max-w-[480px]">
                <p className="text-base text-grey">
                    Владелец площадки свяжется с вами в сообщениях и подтвердит бронь.
                </p>
                <Button onClick={onClose} className="mt-6" full>
                    Понятно
                </Button>
            </Modal>
        )
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Забронировать площадку"
            description={venue?.name}
        >
            <div className="flex flex-col gap-5">
                <Input label="Дата съёмки" type="date" value={form.date} onChange={set('date')} required />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Начало" type="time" value={form.timeFrom} onChange={set('timeFrom')} />
                    <Input label="Окончание" type="time" value={form.timeTo} onChange={set('timeTo')} />
                </div>
                <Textarea
                    label="Комментарий"
                    value={form.comment}
                    maxLength={500}
                    placeholder="Количество людей, оборудование, особые пожелания"
                    onChange={set('comment')}
                />
                <Button onClick={submit} loading={sending} full>
                    Отправить заявку
                </Button>
            </div>
        </Modal>
    )
}
