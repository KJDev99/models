'use client'

import React from 'react'
import SettingsNav from '@/components/cabinet/settings-nav'
import ClientDeleteForm from '@/components/client/settings/delete/delete-form'

export default function ClientDeleteView() {
    return (
        <>
            <SettingsNav rolePrefix="client" />
            <ClientDeleteForm />
        </>
    )
}
