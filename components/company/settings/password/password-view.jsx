'use client'

import React from 'react'
import SettingsNav from '@/components/cabinet/settings-nav'
import CompanyPasswordForm from '@/components/company/settings/password/password-form'

export default function CompanyPasswordView() {
    return (
        <>
            <SettingsNav rolePrefix="company" />
            <CompanyPasswordForm />
        </>
    )
}
