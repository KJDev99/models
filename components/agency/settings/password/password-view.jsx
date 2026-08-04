'use client'

import React from 'react'
import SettingsNav from '@/components/cabinet/settings-nav'
import AgencyPasswordForm from '@/components/agency/settings/password/password-form'

export default function AgencyPasswordView() {
    return (
        <>
            <SettingsNav rolePrefix="agency" />
            <AgencyPasswordForm />
        </>
    )
}
