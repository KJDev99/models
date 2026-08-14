'use client'

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminListCard, AdminPagination, AdminSearch, AdminSelect } from '@/components/admin/ui/admin-ui'
import Button from '@/components/ui/button'
import AdminProjectRow from '@/components/admin/projects/project-row-card'
import { publicationMenu } from '@/components/admin/ui/admin-menu-items'
import { DeleteModal } from '@/components/admin/ui/admin-modals'
import {
    ADMIN_PROJECTS,
    PROJECTS_PAGE_SIZE,
    PROJECT_STATUS_FILTER,
} from '@/components/admin/projects/projects-data'

// Figma: Проекты (338:19284 / 454:18416)
export default function AdminProjects() {
    const router = useRouter()
    const [list, setList] = useState(ADMIN_PROJECTS)
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(1)
    const [removing, setRemoving] = useState(null)

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return list.filter((row) => {
            if (status && row.status !== status) return false
            if (!q) return true
            return row.title.toLowerCase().includes(q)
        })
    }, [list, query, status])

    const pages = Math.max(1, Math.ceil(filtered.length / PROJECTS_PAGE_SIZE))
    const current = Math.min(page, pages)
    const rows = filtered.slice((current - 1) * PROJECTS_PAGE_SIZE, current * PROJECTS_PAGE_SIZE)

    function patch(row, changes) {
        setList((all) => all.map((item) => (item.id === row.id ? { ...item, ...changes } : item)))
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
                                    onPause: () => patch(item, { status: 'paused' }),
                                    onResume: () => patch(item, { status: 'active' }),
                                    onFinish: () => patch(item, { status: 'done' }),
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
                onConfirm={() => setList((all) => all.filter((item) => item.id !== removing.id))}
            />
        </>
    )
}
