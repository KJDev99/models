'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import AdminModal, {
    AdminModalButton,
    AdminModalText,
    AdminModalTextarea,
} from '@/components/admin/ui/admin-modal'

// ─────────────────────────────────────────────────────────────────────────────
// Moderatsiya qarorlari oynalari. Dashbord, «Модерация» ro'yxati va anketa
// sahifasida bir xil ishlatiladi.
// Figma: «Опубликовать профиль?» 344:16122 · «Отклонить профиль» 344:15552.
// ─────────────────────────────────────────────────────────────────────────────

// Natija haqidagi xabarni chaqiruvchi chiqaradi (so'rov muvaffaqiyatli
// tugagandan keyin), shuning uchun oynaning o'zi `toast` ko'rsatmaydi —
// aks holda xatolikda ham «опубликован» yozuvi chiqib ketardi.
export function ApproveModal({ open, onClose, onConfirm }) {
    return (
        <AdminModal open={open} onClose={onClose} title="Опубликовать профиль?">
            <AdminModalText>
                После публикации профиль станет доступен заказчикам и появится в каталоге
                исполнителей.
            </AdminModalText>

            <div className="flex flex-col gap-[16px]">
                <AdminModalButton
                    onClick={() => {
                        onConfirm?.()
                        onClose()
                    }}
                >
                    Опубликовать
                </AdminModalButton>
                <AdminModalButton variant="secondary" onClick={onClose}>
                    Отменить
                </AdminModalButton>
            </div>
        </AdminModal>
    )
}

export function RejectModal({ open, onClose, onConfirm }) {
    const [reason, setReason] = useState('')

    function submit() {
        if (!reason.trim()) {
            toast.error('Укажите причину отклонения')
            return
        }
        onConfirm?.(reason)
        onClose()
        setReason('')
    }

    return (
        <AdminModal open={open} onClose={onClose} title="Отклонить профиль">
            <AdminModalTextarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Укажите, что необходимо исправить в профиле..."
            />

            <div className="flex flex-col gap-[16px]">
                <AdminModalButton onClick={submit}>Отклонить профиль</AdminModalButton>
                <AdminModalButton variant="secondary" onClick={onClose}>
                    Отменить
                </AdminModalButton>
            </div>
        </AdminModal>
    )
}

// Ikkala oynani bitta joydan boshqarish uchun kichik yordamchi.
// `decision` — { type: 'approve' | 'reject', row } yoki null.
export function ModerationDecisionModals({ decision, onClose, onApprove, onReject }) {
    return (
        <>
            <ApproveModal
                open={decision?.type === 'approve'}
                onClose={onClose}
                onConfirm={() => onApprove?.(decision.row)}
            />
            <RejectModal
                open={decision?.type === 'reject'}
                onClose={onClose}
                onConfirm={(reason) => onReject?.(decision.row, reason)}
            />
        </>
    )
}
