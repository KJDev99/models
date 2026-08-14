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
    CLIENTS,
    CLIENTS_PAGE_SIZE,
    CLIENT_STATUS_FILTER,
} from '@/components/admin/clients/clients-data'

// Figma: Заказчики (336:15164 / 446:16179)
export default function AdminClients() {
    const router = useRouter()
    const [list, setList] = useState(CLIENTS)
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(1)
    const [action, setAction] = useState(null)

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return list.filter((row) => {
            if (status && row.status !== status) return false
            if (!q) return true
            return `${row.name} ${row.email}`.toLowerCase().includes(q)
        })
    }, [list, query, status])

    const pages = Math.max(1, Math.ceil(filtered.length / CLIENTS_PAGE_SIZE))
    const current = Math.min(page, pages)
    const rows = filtered.slice((current - 1) * CLIENTS_PAGE_SIZE, current * CLIENTS_PAGE_SIZE)

    function patch(row, changes) {
        setList((all) => all.map((item) => (item.id === row.id ? { ...item, ...changes } : item)))
    }

    return (
        <>
            <AdminListCard
                title="Заказчики"
                action={
                    <Button
                        href="/admin/clients/new"
                        variant="gold"
                        size="md"
                        className="lg:text-[16px]"
                    >
                        Создать заказчика
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
                            placeholder="Поиск по имени или электронной почте"
                        />
                        <AdminSelect
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value)
                                setPage(1)
                            }}
                            options={CLIENT_STATUS_FILTER}
                            className="lg:w-[227px] lg:shrink-0"
                        />
                    </>
                }
            >
                <AdminTable
                    rows={rows}
                    actionsWidth="lg:w-[64px]"
                    columns={[
                        { key: 'name', label: 'Пользователь' },
                        { key: 'type', label: 'Тип' },
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
                            href: `/admin/clients/${row.id}`,
                        },
                        {
                            key: 'menu',
                            render: (
                                <AdminRowMenu
                                    items={rowMenu({
                                        status: row.status,
                                        onEdit: () => router.push(`/admin/clients/${row.id}`),
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
