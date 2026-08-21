'use client'

import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AdminProjectDetail from '@/components/admin/projects/project-detail'
import { useApi, useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'
import { adminProjectDetail } from '@/lib/adapters'

// Adminkadagi loyiha kartochkasi — GET /admin/projects/{id} (backend/admin.md).
export default function AdminProjectDetailLoader({ id }) {
    const router = useRouter()

    const fetcher = useCallback(() => adminApi.project(id), [id])
    const { data, loading, error, reload } = useApi(fetcher, { enabled: Boolean(id) })

    const project = useMemo(() => adminProjectDetail(data), [data])

    const update = useAction(adminApi.updateProject)
    const remove = useAction(adminApi.deleteProject)

    async function setStatus(next, message) {
        const res = await update.run(id, { status: next })
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success(message)
        reload()
    }

    if (loading || error || !project) {
        return loading ? (
            <div className="h-[600px] animate-pulse rounded-[6px] bg-black/5" />
        ) : (
            <p className="rounded-[6px] bg-white p-[40px] text-center text-[14px] text-grey lg:text-[16px]">
                {error?.message || 'Проект не найден'}
            </p>
        )
    }

    return (
        <AdminProjectDetail
            project={project}
            editHref={`/admin/projects/${id}/edit`}
            onPause={() => setStatus('paused', 'Проект снят с публикации')}
            onResume={() => setStatus('active', 'Проект опубликован')}
            onFinish={() => setStatus('completed', 'Проект завершён')}
            onDelete={async () => {
                const res = await remove.run(id)
                if (!res.success) toast.error(res.error.message)
                else {
                    toast.success('Проект удалён')
                    router.push('/admin/projects')
                }
            }}
        />
    )
}
