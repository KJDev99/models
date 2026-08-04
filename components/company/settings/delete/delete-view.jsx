'use client'

import React from 'react'
import SettingsNav from '@/components/cabinet/settings-nav'
import CompanyDeleteForm from '@/components/company/settings/delete/delete-form'

export default function CompanyDeleteView() {
    return (
        <>
            <SettingsNav rolePrefix="company" />
            <CompanyDeleteForm />
        </>
    )
}
