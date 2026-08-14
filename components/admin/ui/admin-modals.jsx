'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AdminModal, {
    AdminModalButton,
    AdminModalText,
    AdminModalTextarea,
} from '@/components/admin/ui/admin-modal'
import { AdminSelect } from '@/components/admin/ui/admin-ui'

// ─────────────────────────────────────────────────────────────────────────────
// Adminkaning umumiy oynalari: bloklash, blokdan chiqarish, o'chirish va
// «Успешно создано». Har bir bo'limda bir xil ishlatiladi.
// Figma: Заблокировать 345:18087 · Разблокировать 345:18890 ·
// Успешно создано 456:23593.
// ─────────────────────────────────────────────────────────────────────────────

// Bloklash muddati va sabablari (Figma 345:18094 / 345:18099).
export const BLOCK_MEASURES = [
    { value: '1d', label: 'Заблокировать на 1 день' },
    { value: '7d', label: 'Заблокировать на 7 дней' },
    { value: '30d', label: 'Заблокировать на 30 дней' },
    { value: 'forever', label: 'Заблокировать навсегда' },
]

export const BLOCK_REASONS = [
    { value: '', label: 'Выберите причину' },
    { value: 'rules', label: 'Нарушение правил платформы' },
    { value: 'spam', label: 'Спам и навязчивые рассылки' },
    { value: 'abuse', label: 'Оскорбительное поведение в переписке' },
    { value: 'fake', label: 'Недостоверные данные в профиле' },
    { value: 'fraud', label: 'Мошеннические действия' },
]

// Modal ichidagi maydon sarlavhasi (Figma 345:18093).
function Field({ label, children }) {
    return (
        <div className="flex flex-col gap-[12px] lg:gap-[16px]">
            <span className="text-[14px] text-grey lg:text-[16px]">{label}</span>
            {children}
        </div>
    )
}

export function BlockModal({ open, onClose, name, onConfirm }) {
    const [measure, setMeasure] = useState(BLOCK_MEASURES[0].value)
    const [reason, setReason] = useState('')
    const [comment, setComment] = useState('')

    function submit() {
        if (!reason) {
            toast.error('Выберите причину блокировки')
            return
        }
        onConfirm?.({ measure, reason, comment })
        onClose()
        toast.success(name ? `«${name}» заблокирован` : 'Пользователь заблокирован')
    }

    return (
        <AdminModal open={open} onClose={onClose} title="Заблокировать">
            <AdminModalText>
                После блокировки пользователь не сможет войти в аккаунт, отправлять сообщения и
                пользоваться платформой до окончания срока блокировки.
            </AdminModalText>

            <Field label="Мера">
                <AdminSelect
                    value={measure}
                    onChange={(e) => setMeasure(e.target.value)}
                    options={BLOCK_MEASURES}
                />
            </Field>

            <Field label="Причина">
                <AdminSelect
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    options={BLOCK_REASONS}
                />
            </Field>

            <Field label="Комментарий пользователю (необязательно)">
                <AdminModalTextarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Укажите причину предупреждения или блокировки..."
                />
            </Field>

            <div className="flex gap-[16px]">
                <AdminModalButton onClick={submit}>Заблокировать</AdminModalButton>
                <AdminModalButton variant="secondary" onClick={onClose}>
                    Отменить
                </AdminModalButton>
            </div>
        </AdminModal>
    )
}

export function UnblockModal({ open, onClose, name, onConfirm }) {
    return (
        <AdminModal open={open} onClose={onClose} title="Разблокировать">
            <AdminModalText>
                После разблокировки пользователь снова сможет войти в аккаунт, отправлять сообщения,
                размещать проекты и пользоваться всеми возможностями платформы.
            </AdminModalText>

            <div className="flex gap-[16px]">
                <AdminModalButton
                    onClick={() => {
                        onConfirm?.()
                        onClose()
                        toast.success(name ? `«${name}» разблокирован` : 'Пользователь разблокирован')
                    }}
                >
                    Разблокировать
                </AdminModalButton>
                <AdminModalButton variant="secondary" onClick={onClose}>
                    Отменить
                </AdminModalButton>
            </div>
        </AdminModal>
    )
}

// «Удалить» Figma'da alohida chizilmagan — Разблокировать qolipida, ogohlantirish
// matni bilan.
export function DeleteModal({ open, onClose, name, onConfirm }) {
    return (
        <AdminModal open={open} onClose={onClose} title="Удалить">
            <AdminModalText>
                Запись будет удалена без возможности восстановления. Все связанные с ней данные
                перестанут отображаться на платформе.
            </AdminModalText>

            <div className="flex gap-[16px]">
                <AdminModalButton
                    onClick={() => {
                        onConfirm?.()
                        onClose()
                        toast.success(name ? `«${name}» удалён` : 'Запись удалена')
                    }}
                >
                    Удалить
                </AdminModalButton>
                <AdminModalButton variant="secondary" onClick={onClose}>
                    Отменить
                </AdminModalButton>
            </div>
        </AdminModal>
    )
}

// Yaratish formasidan keyin (Figma 456:23593).
export function CreatedModal({ open, onClose, viewHref, listHref }) {
    const router = useRouter()

    return (
        <AdminModal open={open} onClose={onClose} title="Успешно создано">
            <AdminModalText>Новая запись успешно создана и опубликована.</AdminModalText>

            <div className="flex gap-[16px]">
                <AdminModalButton onClick={() => router.push(viewHref)}>Посмотреть</AdminModalButton>
                <AdminModalButton variant="secondary" onClick={() => router.push(listHref)}>
                    Вернуться к списку
                </AdminModalButton>
            </div>
        </AdminModal>
    )
}

// Ro'yxat sahifalarida uchala oynani bitta joydan boshqarish.
// `action` — { type: 'block' | 'unblock' | 'delete', row } yoki null.
export function RowActionModals({ action, onClose, onBlock, onUnblock, onDelete }) {
    const name = action?.row?.name

    return (
        <>
            <BlockModal
                open={action?.type === 'block'}
                onClose={onClose}
                name={name}
                onConfirm={(data) => onBlock?.(action.row, data)}
            />
            <UnblockModal
                open={action?.type === 'unblock'}
                onClose={onClose}
                name={name}
                onConfirm={() => onUnblock?.(action.row)}
            />
            <DeleteModal
                open={action?.type === 'delete'}
                onClose={onClose}
                name={name}
                onConfirm={() => onDelete?.(action.row)}
            />
        </>
    )
}
