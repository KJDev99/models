'use client'

import React, { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { CheckCircle, Eye, MinusCircle } from 'lucide-react'
import {
    AdminListCard,
    AdminPagination,
    AdminSearch,
    AdminSelect,
    AdminStatus,
} from '@/components/admin/ui/admin-ui'
import AdminTable from '@/components/admin/ui/admin-table'
import { ModerationDecisionModals } from '@/components/admin/moderation/moderation-modals'
import { useApi, useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'
import { adminModerationRow } from '@/lib/adapters'

// Figma: Модерация (343:14293 / 458:25261)
// Backend navbatni manba bo'yicha filtrlaydi: user | project | venue.
const TYPES = [
    { value: '', label: 'Все типы' },
    { value: 'user', label: 'Исполнители' },
    { value: 'project', label: 'Проекты' },
    { value: 'venue', label: 'Площадки' },
]

const PAGE_SIZE = 9

export default function AdminModeration() {
    const [query, setQuery] = useState('')
    const [type, setType] = useState('')
    const [page, setPage] = useState(1)
    const [decision, setDecision] = useState(null)

    // GET /admin/moderation — navbat serverdan keladi (backend/admin.md).
    const fetcher = useCallback(
        () =>
            adminApi.moderation({
                q: query || undefined,
                source: type || undefined,
                page,
                page_size: PAGE_SIZE,
            }),
        [query, type, page],
    )
    const { data, loading, error, reload } = useApi(fetcher)

    const rows = useMemo(() => (data?.items || []).map(adminModerationRow), [data])
    const pages = data?.meta?.pages || 1
    const current = data?.meta?.page || page

    const approve = useAction(adminApi.approve)
    const reject = useAction(adminApi.reject)

    // «Одобрить» — comment berilmaydi, «Отклонить» — sabab bilan.
    async function resolve(row, comment) {
        const res =
            comment === undefined
                ? await approve.run(row.source, row.id)
                : await reject.run(row.source, row.id, comment)
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success(comment === undefined ? 'Одобрено' : 'Отклонено')
        reload()
    }

    return (
        <>
            <AdminListCard
                title="Модерация"
                toolbar={
                    <>
                        <AdminSearch
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                                setPage(1)
                            }}
                            placeholder="Поиск по имени исполнителя, названию проекта или площадки..."
                        />
                        <AdminSelect
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value)
                                setPage(1)
                            }}
                            options={TYPES}
                            className="lg:w-[227px] lg:shrink-0"
                        />
                    </>
                }
            >
                <AdminTable
                    rows={loading ? [] : rows}
                    columns={[
                        { key: 'name', label: 'Пользователь' },
                        { key: 'type', label: 'Тип', width: 'lg:w-[130px]' },
                        { key: 'email', label: 'Email' },
                        { key: 'date', label: 'Дата создания', width: 'lg:w-[150px]' },
                        {
                            key: 'status',
                            label: 'Статус',
                            width: 'lg:w-[133px]',
                            render: () => <AdminStatus tone="pending">На модерации</AdminStatus>,
                        },
                    ]}
                    actions={(row) => [
                        {
                            key: 'view',
                            icon: Eye,
                            label: 'Открыть',
                            href: `/admin/moderation/${row.id}?source=${row.source}`,
                        },
                        {
                            key: 'approve',
                            icon: CheckCircle,
                            label: 'Одобрить',
                            tone: 'success',
                            onClick: () => setDecision({ type: 'approve', row }),
                        },
                        {
                            key: 'reject',
                            icon: MinusCircle,
                            label: 'Отклонить',
                            tone: 'danger',
                            onClick: () => setDecision({ type: 'reject', row }),
                        },
                    ]}
                    empty={
                        loading
                            ? 'Загружаем…'
                            : error
                              ? error.message
                              : 'Заявок на модерацию нет'
                    }
                />

                <AdminPagination page={current} pages={pages} onChange={setPage} />
            </AdminListCard>

            <ModerationDecisionModals
                decision={decision}
                onClose={() => setDecision(null)}
                onApprove={(row) => resolve(row)}
                onReject={(row, comment) => resolve(row, comment || '')}
            />
        </>
    )
}
