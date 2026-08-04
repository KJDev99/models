'use client'

import React from 'react'
import AuthGuard from '@/components/guards/auth-guard'
import AgencyForm from '@/components/auth/register/agency/agency-form'

export default function RegisterAgencyPage() {
    return (
        <AuthGuard>
            <AgencyForm />
        </AuthGuard>
    )
}
