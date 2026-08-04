'use client'

import React from 'react'
import SettingsNav from '@/components/cabinet/settings-nav'
import ClientPhoneForm from '@/components/client/settings/phone/phone-form'

export default function ClientPhoneView() {
    return (
        <>
            <SettingsNav rolePrefix="client" />
            <ClientPhoneForm />
        </>
    )
}
