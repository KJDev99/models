'use client'

import React from 'react'
import AuthCard from '@/components/auth/auth-card'
import Button from '@/components/ui/button'

// Figma: "Аккаунт заблокирован" (345:18476).
export default function BlockedView() {
    return (
        <AuthCard
            title="Аккаунт заблокирован"
            description="Доступ ограничен модератором. Если это ошибка — напишите в поддержку, мы разберёмся."
        >
            <div className="flex flex-col gap-3">
                <Button href="/contacts" full>
                    Написать в поддержку
                </Button>
                <Button href="/" variant="whiteStroke" full>
                    На главную
                </Button>
            </div>
        </AuthCard>
    )
}
