'use client'

import React from 'react'
import AuthRedirect from '@/components/auth/auth-redirect'

// Ro'yxatdan o'tish alohida sahifa emas — modal (Figma 85:3512).
export default function RegisterPage() {
    return <AuthRedirect step="register" />
}
