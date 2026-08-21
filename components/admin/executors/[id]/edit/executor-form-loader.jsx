'use client'

import React, { useCallback } from 'react'
import AdminExecutorForm from '@/components/admin/executors/executor-form'
import { toFormValues } from '@/components/admin/executors/executor-form-api'
import { useApi } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'

// «Редактировать исполнителя» — GET /admin/performers/{id} bilan to'ldirilgan
// «Создать исполнителя» ustasi (backend/admin.md).
export default function AdminExecutorFormLoader({ id }) {
    const fetcher = useCallback(() => adminApi.performer(id), [id])
    const { data, loading, error } = useApi(fetcher, { enabled: Boolean(id) })

    if (loading || error || !data) {
        return loading ? (
            <div className="h-[600px] animate-pulse rounded-[6px] bg-black/5" />
        ) : (
            <p className="rounded-[6px] bg-white p-[40px] text-center text-[14px] text-grey lg:text-[16px]">
                {error?.message || 'Анкета не найдена'}
            </p>
        )
    }

    return <AdminExecutorForm mode="edit" initial={toFormValues(data)} />
}
