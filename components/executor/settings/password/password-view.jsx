'use client'

import React from 'react'
import SettingsNav from '@/components/cabinet/settings-nav'
import ExecutorPasswordForm from '@/components/executor/settings/password/password-form'

export default function ExecutorPasswordView() {
    return (
        <>
            <SettingsNav rolePrefix="executor" />
            <ExecutorPasswordForm />
        </>
    )
}
