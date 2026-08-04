'use client'

import React from 'react'
import toast from 'react-hot-toast'
import AuthCard from '@/components/auth/auth-card'
import SocialButtons from '@/components/auth/social-buttons'

// Figma: "Выберите сервис для входа" (85:2756).
export default function ServiceSelect() {
    function onSelect(service) {
        // OAuth manzili backend tomonidan beriladi.
        const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/${service}/`
        if (!process.env.NEXT_PUBLIC_API_URL) {
            toast.error('Сервис временно недоступен')
            return
        }
        window.location.href = url
    }

    return (
        <AuthCard
            title="Выберите сервис для входа"
            description="Мы получим только имя и адрес почты — публиковать ничего не будем."
            back="/auth/login"
        >
            <SocialButtons onSelect={onSelect} />
        </AuthCard>
    )
}
