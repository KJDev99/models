'use client'

import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AdminExecutorProfile from '@/components/admin/executors/executor-profile'
import { blockPayload } from '@/components/admin/ui/admin-modals'
import { useApi, useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'
import { adminExecutorProfile } from '@/lib/adapters'

// Adminkadagi ijrochi anketasi — GET /admin/performers/{id} (backend/admin.md).
export default function AdminExecutorProfileLoader({ id }) {
    const router = useRouter()

    const fetcher = useCallback(() => adminApi.performer(id), [id])
    const { data, loading, error, reload } = useApi(fetcher, { enabled: Boolean(id) })

    const profile = useMemo(() => adminExecutorProfile(data), [data])

    const block = useAction(adminApi.blockPerformer)
    const unblock = useAction(adminApi.unblockPerformer)
    const remove = useAction(adminApi.deletePerformer)

    if (loading || error || !profile) {
        return loading ? (
            <div className="h-[600px] animate-pulse rounded-[6px] bg-black/5" />
        ) : (
            <p className="rounded-[6px] bg-white p-[40px] text-center text-[14px] text-grey lg:text-[16px]">
                {error?.message || 'Анкета не найдена'}
            </p>
        )
    }

    return (
        <AdminExecutorProfile
            profile={profile}
            editHref={`/admin/executors/${id}/edit`}
            onBlock={async (_row, form) => {
                const res = await block.run(id, blockPayload(form))
                if (!res.success) toast.error(res.error.message)
                else {
                    toast.success('Исполнитель заблокирован')
                    reload()
                }
            }}
            onUnblock={async () => {
                const res = await unblock.run(id)
                if (!res.success) toast.error(res.error.message)
                else {
                    toast.success('Исполнитель разблокирован')
                    reload()
                }
            }}
            onDelete={async () => {
                const res = await remove.run(id)
                if (!res.success) toast.error(res.error.message)
                else {
                    toast.success('Исполнитель удалён')
                    router.push('/admin/executors')
                }
            }}
        />
    )
}
