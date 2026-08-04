'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import Textarea from '@/components/ui/textarea'
import { useApiStore } from '@/store/useApiStore'

// Figma: "Откликнуться" (164:17733) → "Отклик отправлен" (164:18476).
export default function ApplyModal({ open, onClose, project }) {
    const postDataToken = useApiStore((s) => s.postDataToken)
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)

    async function submit() {
        setSending(true)
        const res = await postDataToken('/responses/', { projectId: project?.id, message })
        setSending(false)
        if (res.success) setSent(true)
        else toast.error('Не удалось отправить отклик')
    }

    if (sent) {
        return (
            <Modal open={open} onClose={onClose} title="Отклик отправлен" width="max-w-[480px]">
                <p className="text-base text-grey">
                    Заказчик увидит вашу анкету. Ответ придёт в уведомления и сообщения.
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
            title="Откликнуться на проект"
            description={project?.title}
        >
            <div className="flex flex-col gap-5">
                <Textarea
                    label="Сопроводительное сообщение"
                    value={message}
                    maxLength={1000}
                    placeholder="Почему вы подходите: опыт, свободные даты, ссылки на работы"
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Button onClick={submit} loading={sending} full>
                    Отправить отклик
                </Button>
            </div>
        </Modal>
    )
}
