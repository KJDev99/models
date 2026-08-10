'use client'

import React from 'react'
import AuthRedirect from '@/components/auth/auth-redirect'

// Kirish alohida sahifa emas — modal (Figma 75:171).
export default function LoginPage() {
    return <AuthRedirect step="role" />
}
