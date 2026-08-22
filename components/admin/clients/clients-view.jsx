'use client'

import React, { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
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
import { RowActionModals, blockPayload } from '@/components/admin/ui/admin-modals'
import { userStatus } from '@/components/admin/ui/admin-statuses'
import { CLIENTS_PAGE_SIZE, CLIENT_STATUS_FILTER } from '@/components/admin/clients/clients-data'
import { useApi, useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'
import { adminUserRow } from '@/lib/adapters'

// Figma: Заказчики (336:15164 / 446:16179)
export default function AdminClients() {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(1)
    const [action, setAction] = useState(null)

    // Qidiruv, filtr va sahifalash — server tomonida (backend/admin.md).
    const fetcher = useCallback(
        () =>
            adminApi.customers({
                q: query || undefined,
                status: status || undefined,
                page,
                page_size: CLIENTS_PAGE_SIZE,
            }),
        [query, status, page],
    )
    const { data, loading, error, reload } = useApi(fetcher)

    const rows = useMemo(() => (data?.items || []).map(adminUserRow), [data])
    const pages = data?.meta?.pages || 1
    const current = data?.meta?.page || page

    const block = useAction(adminApi.blockCustomer)
    const unblock = useAction(adminApi.unblockCustomer)
    const remove = useAction(adminApi.deleteCustomer)

    // Har bir amaldan keyin ro'yxat serverdan qayta o'qiladi.
    async function run(promise, message) {
        const res = await promise
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success(message)
        reload()
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
                    rows={loading ? [] : rows}
                    empty={loading ? 'Загружаем…' : error ? error.message : 'Заказчики не найдены'}
                    actionsWidth="lg:w-[64px]"
                    columns={[
                        { key: 'name', label: 'Пользователь' },
                        { key: 'type', label: 'Тип', width: 'lg:w-[130px]' },
                        { key: 'email', label: 'Email' },
                        { key: 'date', label: 'Дата', width: 'lg:w-[145px]' },
                        {
                            key: 'status',
                            label: 'Статус',
                            width: 'lg:w-[133px]',
                            render: (row) => (
                                <AdminStatus tone={userStatus(row.status).tone}>
                                    {userStatus(row.status).label}
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
                onBlock={(row, form) =>
                    run(
                        block.run(row.id, blockPayload(form)),
                        'Пользователь заблокирован',
                    )
                }
                onUnblock={(row) => run(unblock.run(row.id), 'Пользователь разблокирован')}
                onDelete={(row) => run(remove.run(row.id), 'Пользователь удалён')}
            />
        </>
    )
}
