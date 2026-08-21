'use client'

import React, { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { AdminListCard, AdminPagination, AdminSearch, AdminSelect } from '@/components/admin/ui/admin-ui'
import Button from '@/components/ui/button'
import AdminProjectRow from '@/components/admin/projects/project-row-card'
import { publicationMenu } from '@/components/admin/ui/admin-menu-items'
import { DeleteModal } from '@/components/admin/ui/admin-modals'
import { PROJECTS_PAGE_SIZE, PROJECT_STATUS_FILTER } from '@/components/admin/projects/projects-data'
import { useApi, useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'
import { adminProjectRow } from '@/lib/adapters'

// Figma: Проекты (338:19284 / 454:18416)
export default function AdminProjects() {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(1)
    const [removing, setRemoving] = useState(null)

    // Qidiruv, filtr va sahifalash — server tomonida (backend/admin.md).
    const fetcher = useCallback(
        () =>
            adminApi.projects({
                q: query || undefined,
                status: status || undefined,
                page,
                page_size: PROJECTS_PAGE_SIZE,
            }),
        [query, status, page],
    )
    const { data, loading, error, reload } = useApi(fetcher)

    const rows = useMemo(() => (data?.items || []).map(adminProjectRow), [data])
    const pages = data?.meta?.pages || 1
    const current = data?.meta?.page || page

    const update = useAction(adminApi.updateProject)
    const remove = useAction(adminApi.deleteProject)

    async function run(promise, message) {
        const res = await promise
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success(message)
        reload()
    }

    // Menyudagi «Поставить на паузу / Возобновить / Завершить» — holatni
    // yangilaydi (PUT /admin/{resource}/{id}).
    function setStatusOf(item, next, message) {
        return run(update.run(item.id, { status: next }), message)
    }

    return (
        <>
            <AdminListCard
                title="Проекты"
                action={
                    <Button
                        href="/admin/projects/new"
                        variant="gold"
                        size="md"
                        className="lg:text-[16px]"
                    >
                        Создать проект
                    </Button>
                }
                toolbar={
                    <>
                        <AdminSearch
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                                setPage(1)
                            }}
                            placeholder="Поиск по названию проекта..."
                        />
                        <AdminSelect
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value)
                                setPage(1)
                            }}
                            options={PROJECT_STATUS_FILTER}
                            className="lg:w-[227px] lg:shrink-0"
                        />
                    </>
                }
            >
                <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                    {rows.map((project) => (
                        <AdminProjectRow
                            key={project.id}
                            project={project}
                            menuItems={(item) =>
                                publicationMenu({
                                    status: item.status,
                                    onEdit: () => router.push(`/admin/projects/${item.id}/edit`),
                                    onPause: () =>
                                        setStatusOf(item, 'paused', 'Публикация на паузе'),
                                    onResume: () =>
                                        setStatusOf(item, 'active', 'Публикация возобновлена'),
                                    onFinish: () =>
                                        setStatusOf(item, 'completed', 'Публикация завершена'),
                                    onDelete: () => setRemoving(item),
                                })
                            }
                        />
                    ))}
                </div>

                <AdminPagination page={current} pages={pages} onChange={setPage} />
            </AdminListCard>

            <DeleteModal
                open={Boolean(removing)}
                onClose={() => setRemoving(null)}
                name={removing?.title}
                onConfirm={() => run(remove.run(removing.id), 'Публикация удалена')}
            />
        </>
    )
}
