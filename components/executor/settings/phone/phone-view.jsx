'use client'

import React from 'react'
import SettingsNav from '@/components/cabinet/settings-nav'
import ExecutorPhoneForm from '@/components/executor/settings/phone/phone-form'

export default function ExecutorPhoneView() {
    return (
        <>
            <SettingsNav rolePrefix="executor" />
            <ExecutorPhoneForm />
        </>
    )
}
