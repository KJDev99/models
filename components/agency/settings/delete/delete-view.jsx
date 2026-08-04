'use client'

import React from 'react'
import SettingsNav from '@/components/cabinet/settings-nav'
import AgencyDeleteForm from '@/components/agency/settings/delete/delete-form'

export default function AgencyDeleteView() {
    return (
        <>
            <SettingsNav rolePrefix="agency" />
            <AgencyDeleteForm />
        </>
    )
}
