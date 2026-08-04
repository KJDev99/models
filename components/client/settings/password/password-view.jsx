'use client'

import React from 'react'
import SettingsNav from '@/components/cabinet/settings-nav'
import ClientPasswordForm from '@/components/client/settings/password/password-form'

export default function ClientPasswordView() {
    return (
        <>
            <SettingsNav rolePrefix="client" />
            <ClientPasswordForm />
        </>
    )
}
