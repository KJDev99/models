'use client'

import React from 'react'
import SettingsNav from '@/components/cabinet/settings-nav'
import CompanyPhoneForm from '@/components/company/settings/phone/phone-form'

export default function CompanyPhoneView() {
    return (
        <>
            <SettingsNav rolePrefix="company" />
            <CompanyPhoneForm />
        </>
    )
}
