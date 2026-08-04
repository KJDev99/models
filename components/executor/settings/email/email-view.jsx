'use client'

import React from 'react'
import SettingsNav from '@/components/cabinet/settings-nav'
import ExecutorEmailForm from '@/components/executor/settings/email/email-form'

export default function ExecutorEmailView() {
    return (
        <>
            <SettingsNav rolePrefix="executor" />
            <ExecutorEmailForm />
        </>
    )
}
