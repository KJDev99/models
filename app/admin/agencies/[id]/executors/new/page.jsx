'use client'

import React from 'react'
import AdminExecutorForm from '@/components/admin/executors/executor-form'

// Figma: Добавить исполнителя (342:10168) — agentlik ichida ijrochi yaratish.
export default function AdminAgencyNewExecutorPage() {
    return <AdminExecutorForm mode="create" scope="agency" />
}
