'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import Rating from '@/components/ui/rating'
import Textarea from '@/components/ui/textarea'
import { useApiStore } from '@/store/useApiStore'

// Figma: "Оставить отзыв" (320:11329).
export default function ReviewModal({ open, onClose, target, onSuccess }) {
    const postDataToken = useApiStore((s) => s.postDataToken)
    const [rating, setRating] = useState(5)
    const [text, setText] = useState('')
    const [sending, setSending] = useState(false)

    async function submit() {
        if (!text.trim()) {
            toast.error('Напишите пару слов об опыте работы')
            return
        }
        setSending(true)
        const res = await postDataToken('/reviews/', {
            targetType: target?.type,
            targetId: target?.id,
            rating,
            text,
        })
        setSending(false)
        if (res.success) {
            toast.success('Отзыв отправлен на модерацию')
            onSuccess?.(res.data)
            onClose?.()
        } else {
            toast.error('Не удалось отправить отзыв')
        }
    }

    return (
        <Modal open={open} onClose={onClose} title="Оставить отзыв" description={target?.name}>
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <span className="text-sm text-grey">Оценка</span>
                    <Rating value={rating} editable size={28} onChange={setRating} />
                </div>
                <Textarea
                    label="Отзыв"
                    value={text}
                    maxLength={1000}
                    placeholder="Как прошла работа? Что понравилось, что можно улучшить?"
                    onChange={(e) => setText(e.target.value)}
                />
                <Button onClick={submit} loading={sending} full>
                    Отправить отзыв
                </Button>
            </div>
        </Modal>
    )
}
