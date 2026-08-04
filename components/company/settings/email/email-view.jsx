'use client'

import React from 'react'
import SettingsNav from '@/components/cabinet/settings-nav'
import CompanyEmailForm from '@/components/company/settings/email/email-form'

export default function CompanyEmailView() {
    return (
        <>
            <SettingsNav rolePrefix="company" />
            <CompanyEmailForm />
        </>
    )
}
