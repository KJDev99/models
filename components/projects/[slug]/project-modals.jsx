'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Modal, { ModalButton } from '@/components/ui/modal'
import toast from 'react-hot-toast'
import { useAction } from '@/lib/use-api'
import * as site from '@/lib/api/site'

// ─────────────────────────────────────────────────────────────────────────────
// Проекты sahifasidagi ikkita modal:
//   1. Подать заявку      — 164:17733 / 374:19330
//   2. Заявка отправлена  — 164:18476 / 374:19549
//
// Qolip barcha modallar bilan bir xil (`components/ui/modal.jsx`): markazda
// 550px oq oyna, uppercase sarlavha, pastda gold va gold-15% tugmalar.
// «Требуется вход» (164:18768) oynasi umumiy `detail-modals.jsx` dan olinadi.
// ─────────────────────────────────────────────────────────────────────────────

// 1. Подать заявку — bitta ixtiyoriy izoh maydoni (Figma 164:17739)
export function ApplyModal({ open, onClose, onSent, projectId }) {
    const [message, setMessage] = useState('')
    const apply = useAction(site.applyToProject)

    // POST /site/projects/{id}/apply — javobda `conversation_id` keladi,
    // «Перейти в чат» tugmasi shu suhbatga olib boradi (backend/site.md).
    async function submit() {
        const res = await apply.run(projectId, message)
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        setMessage('')
        onSent(res.data)
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Подать заявку"
            footer={
                <>
                    <ModalButton onClick={submit} disabled={apply.loading}>
                        Отправить отклик
                    </ModalButton>
                    <ModalButton variant="secondary" onClick={onClose}>
                        Отменить
                    </ModalButton>
                </>
            }
        >
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Сообщение (необязательно)"
                className="custom-scrollbar min-h-[100px] w-full resize-none rounded-[6px] bg-light-white p-[12px] text-[14px] text-black outline-none placeholder:text-[#aaa] lg:min-h-[110px] lg:p-[16px] lg:text-[16px]"
            />
        </Modal>
    )
}

// 2. Заявка отправлена (Figma 164:18476)
export function ApplySentModal({ open, onClose }) {
    const router = useRouter()

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Заявка отправлена"
            description="Ваша заявка успешно отправлена заказчику."
            footer={<ModalButton onClick={() => router.push('/chat')}>Перейти в чат</ModalButton>}
        />
    )
}
