'use client'

import React from 'react'
import SettingsNav from '@/components/cabinet/settings-nav'
import AgencyEmailForm from '@/components/agency/settings/email/email-form'

export default function AgencyEmailView() {
    return (
        <>
            <SettingsNav rolePrefix="agency" />
            <AgencyEmailForm />
        </>
    )
}
