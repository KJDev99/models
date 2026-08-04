'use client'

import React from 'react'
import SettingsNav from '@/components/cabinet/settings-nav'
import AgencyPhoneForm from '@/components/agency/settings/phone/phone-form'

export default function AgencyPhoneView() {
    return (
        <>
            <SettingsNav rolePrefix="agency" />
            <AgencyPhoneForm />
        </>
    )
}
