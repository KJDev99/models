'use client'

import React from 'react'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'

// Figma: "Удалить аккаунт?" (270:24791), "Отклонить жалобу?" (345:17769),
// "Опубликовать профиль?" (344:15883) — bir xil tasdiqlash oynasi.
export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Подтвердить',
    cancelText = 'Отмена',
    danger = false,
    loading = false,
}) {
    return (
        <Modal open={open} onClose={onClose} title={title} description={description} width="max-w-[480px]">
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                    variant={danger ? 'danger' : 'gold'}
                    onClick={onConfirm}
                    loading={loading}
                    full
                >
                    {confirmText}
                </Button>
                <Button variant="whiteStroke" onClick={onClose} full>
                    {cancelText}
                </Button>
            </div>
        </Modal>
    )
}
