'use client'

import React from 'react'
import SettingsNav from '@/components/cabinet/settings-nav'
import ClientEmailForm from '@/components/client/settings/email/email-form'

export default function ClientEmailView() {
    return (
        <>
            <SettingsNav rolePrefix="client" />
            <ClientEmailForm />
        </>
    )
}
