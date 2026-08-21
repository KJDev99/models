'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import Radio from '@/components/ui/radio'
import Textarea from '@/components/ui/textarea'
import { useChatStore } from '@/store/useChatStore'

// Figma: "Пожаловаться" (345:20060) → "ЖАЛОБА ОТПРАВЛЕНА" (345:20241).
const REASONS = [
    { value: 'spam', label: 'Спам или реклама' },
    { value: 'fake', label: 'Фейковая анкета' },
    { value: 'abuse', label: 'Оскорбления или угрозы' },
    { value: 'fraud', label: 'Мошенничество' },
    { value: 'other', label: 'Другое' },
]

export default function ComplaintModal({ open, onClose, target }) {
    const report = useChatStore((s) => s.report)
    const [reason, setReason] = useState('spam')
    const [comment, setComment] = useState('')
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)

    // POST /site/complaints — shikoyat chatdan yuboriladi, shuning uchun
    // ayblanuvchi va suhbat identifikatorlari kerak (backend/site.md).
    async function submit() {
        setSending(true)
        const res = await report({
            accusedId: target?.accusedId,
            conversationId: target?.conversationId || target?.id,
            reason,
            body: comment,
        })
        setSending(false)
        if (res.success) setSent(true)
        else toast.error(res.error?.message || 'Не удалось отправить жалобу')
    }

    if (sent) {
        return (
            <Modal open={open} onClose={onClose} title="Жалоба отправлена" width="max-w-[480px]">
                <p className="text-base text-grey">
                    Модератор рассмотрит обращение и примет решение. Ответ придёт в уведомления.
                </p>
                <Button onClick={onClose} className="mt-6" full>
                    Понятно
                </Button>
            </Modal>
        )
    }

    return (
        <Modal open={open} onClose={onClose} title="Пожаловаться" description={target?.name}>
            <div className="flex flex-col gap-4">
                {REASONS.map((r) => (
                    <Radio
                        key={r.value}
                        name="complaint-reason"
                        label={r.label}
                        checked={reason === r.value}
                        onChange={() => setReason(r.value)}
                    />
                ))}

                <Textarea
                    label="Комментарий"
                    value={comment}
                    maxLength={1000}
                    placeholder="Опишите ситуацию — это поможет модератору"
                    onChange={(e) => setComment(e.target.value)}
                />

                <Button variant="danger" onClick={submit} loading={sending} full>
                    Отправить жалобу
                </Button>
            </div>
        </Modal>
    )
}
