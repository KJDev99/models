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
import { EXECUTORS_PAGE_SIZE, STATUS_FILTER } from '@/components/admin/executors/executors-data'
import { useApi, useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'
import { adminUserRow } from '@/lib/adapters'

// Figma: Исполнители (321:13149 / 440:19416)
export default function AdminExecutors() {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(1)
    const [action, setAction] = useState(null)

    // Qidiruv, filtr va sahifalash — server tomonida (backend/admin.md).
    const fetcher = useCallback(
        () =>
            adminApi.performers({
                q: query || undefined,
                status: status || undefined,
                page,
                page_size: EXECUTORS_PAGE_SIZE,
            }),
        [query, status, page],
    )
    const { data, loading, error, reload } = useApi(fetcher)

    const rows = useMemo(() => (data?.items || []).map(adminUserRow), [data])
    const pages = data?.meta?.pages || 1
    const current = data?.meta?.page || page

    const block = useAction(adminApi.blockPerformer)
    const unblock = useAction(adminApi.unblockPerformer)
    const remove = useAction(adminApi.deletePerformer)
    const hide = useAction(adminApi.hidePerformer)

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
                title="Исполнители"
                action={
                    <Button
                        href="/admin/executors/new"
                        variant="gold"
                        size="md"
                        className="lg:text-[16px]"
                    >
                        Создать исполнителя
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
                            options={STATUS_FILTER}
                            className="lg:w-[227px] lg:shrink-0"
                        />
                    </>
                }
            >
                <AdminTable
                    rows={loading ? [] : rows}
                    empty={
                        loading
                            ? 'Загружаем…'
                            : error
                              ? error.message
                              : 'Исполнители не найдены'
                    }
                    actionsWidth="lg:w-[64px]"
                    columns={[
                        { key: 'name', label: 'Пользователь' },
                        { key: 'type', label: 'Тип', width: 'lg:w-[150px]' },
                        { key: 'email', label: 'Email' },
                        { key: 'date', label: 'Дата регистрации' },
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
                            href: `/admin/executors/${row.id}`,
                        },
                        {
                            key: 'menu',
                            render: (
                                <AdminRowMenu
                                    items={rowMenu({
                                        status: row.status,
                                        onEdit: () => router.push(`/admin/executors/${row.id}/edit`),
                                        // «Скрыть профиль» — POST /admin/performers/{id}/hide
                                        onToggle: () =>
                                            run(
                                                hide.run(row.id, !row.isHidden),
                                                row.isHidden ? 'Профиль показан' : 'Профиль скрыт',
                                            ),
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
