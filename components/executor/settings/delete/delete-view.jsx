'use client'

import React from 'react'
import SettingsNav from '@/components/cabinet/settings-nav'
import ExecutorDeleteForm from '@/components/executor/settings/delete/delete-form'

export default function ExecutorDeleteView() {
    return (
        <>
            <SettingsNav rolePrefix="executor" />
            <ExecutorDeleteForm />
        </>
    )
}
