'use client'

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye } from 'lucide-react'
import {
    AdminListCard,
    AdminPagination,
    AdminRowMenu,
    AdminSearch,
    AdminSelect,
    AdminStatus,
} from '@/components/admin/ui/admin-ui'
import Button from '@/components/ui/button'
import AdminTable from '@/components/admin/ui/admin-table'
import { rowMenu } from '@/components/admin/ui/admin-menu-items'
import { RowActionModals } from '@/components/admin/ui/admin-modals'
import { USER_STATUS } from '@/components/admin/ui/admin-statuses'
import {
    AGENCIES,
    AGENCIES_PAGE_SIZE,
    AGENCY_STATUS_FILTER,
} from '@/components/admin/agencies/agencies-data'

// Figma: Агентства (338:17586 / 452:15650)
export default function AdminAgencies() {
    const router = useRouter()
    const [list, setList] = useState(AGENCIES)
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(1)
    const [action, setAction] = useState(null)

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return list.filter((row) => {
            if (status && row.status !== status) return false
            if (!q) return true
            return `${row.name} ${row.manager} ${row.email}`.toLowerCase().includes(q)
        })
    }, [list, query, status])

    const pages = Math.max(1, Math.ceil(filtered.length / AGENCIES_PAGE_SIZE))
    const current = Math.min(page, pages)
    const rows = filtered.slice((current - 1) * AGENCIES_PAGE_SIZE, current * AGENCIES_PAGE_SIZE)

    function patch(row, changes) {
        setList((all) => all.map((item) => (item.id === row.id ? { ...item, ...changes } : item)))
    }

    return (
        <>
            <AdminListCard
                title="Агентства"
                action={
                    <Button
                        href="/admin/agencies/new"
                        variant="gold"
                        size="md"
                        className="lg:text-[16px]"
                    >
                        Создать агентство
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
                            placeholder="Поиск по названию агентства, имени представителя или электронной почте"
                        />
                        <AdminSelect
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value)
                                setPage(1)
                            }}
                            options={AGENCY_STATUS_FILTER}
                            className="lg:w-[227px] lg:shrink-0"
                        />
                    </>
                }
            >
                <AdminTable
                    rows={rows}
                    actionsWidth="lg:w-[64px]"
                    columns={[
                        { key: 'name', label: 'Агентства' },
                        { key: 'manager', label: 'Представитель' },
                        { key: 'email', label: 'Email' },
                        { key: 'date', label: 'Дата' },
                        {
                            key: 'status',
                            label: 'Статус',
                            width: 'lg:w-[133px]',
                            render: (row) => (
                                <AdminStatus tone={USER_STATUS[row.status].tone}>
                                    {USER_STATUS[row.status].label}
                                </AdminStatus>
                            ),
                        },
                    ]}
                    actions={(row) => [
                        {
                            key: 'view',
                            icon: Eye,
                            label: 'Открыть',
                            href: `/admin/agencies/${row.id}`,
                        },
                        {
                            key: 'menu',
                            render: (
                                <AdminRowMenu
                                    items={rowMenu({
                                        status: row.status,
                                        onEdit: () => router.push(`/admin/agencies/${row.id}`),
                                        onToggle: () =>
                                            patch(row, {
                                                status: row.status === 'paused' ? 'active' : 'paused',
                                            }),
                                        onBlock: () => setAction({ type: 'block', row }),
                                        onUnblock: () => setAction({ type: 'unblock', row }),
                                        onDelete: () => setAction({ type: 'delete', row }),
                                    })}
                                />
                            ),
                        },
                    ]}
                />

                <AdminPagination page={current} pages={pages} onChange={setPage} />
            </AdminListCard>

            <RowActionModals
                action={action}
                onClose={() => setAction(null)}
                onBlock={(row) => patch(row, { status: 'blocked' })}
                onUnblock={(row) => patch(row, { status: 'active' })}
                onDelete={(row) => setList((all) => all.filter((item) => item.id !== row.id))}
            />
        </>
    )
}
