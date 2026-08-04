'use client'

import React from 'react'
import AuthGuard from '@/components/guards/auth-guard'
import RoleSelect from '@/components/auth/register/role/role-select'

export default function RegisterRolePage() {
    return (
        <AuthGuard>
            <RoleSelect />
        </AuthGuard>
    )
}
