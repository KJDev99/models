'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import ConfirmModal from '@/components/ui/confirm-modal'
import { useAuthStore } from '@/store/useAuthStore'

export default function LogoutModal({ open, onClose, redirectTo = '/' }) {
    const logout = useAuthStore((s) => s.logout)
    const router = useRouter()

    function handleConfirm() {
        logout()
        onClose?.()
        router.push(redirectTo)
    }

    return (
        <ConfirmModal
            open={open}
            onClose={onClose}
            onConfirm={handleConfirm}
            title="Выйти из аккаунта?"
            description="Вы вернётесь на главную страницу. Данные профиля сохранятся."
            confirmText="Выйти"
            danger
        />
    )
}
