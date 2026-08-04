'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import { setReturnUrl } from '@/lib/auth'

// Figma: "Требуется вход" (164:14791, 164:18768).
// Mehmon himoyalangan amalni bosganda chiqadi.
export default function AuthRequiredModal({ open, onClose, action = 'продолжить' }) {
    const router = useRouter()
    const pathname = usePathname()

    function go(href) {
        setReturnUrl(pathname)
        router.push(href)
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Требуется вход"
            description={`Чтобы ${action}, войдите в аккаунт или зарегистрируйтесь — это займёт минуту.`}
            width="max-w-[480px]"
        >
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => go('/auth/login')} full>
                    Войти
                </Button>
                <Button variant="whiteStroke" onClick={() => go('/auth/register')} full>
                    Регистрация
                </Button>
            </div>
        </Modal>
    )
}
