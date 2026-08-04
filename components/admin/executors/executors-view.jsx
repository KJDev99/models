'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/card'
import DataTable from '@/components/ui/data-table'
import StatusBadge from '@/components/ui/status-badge'
import Avatar from '@/components/ui/avatar'
import ResourceList from '@/components/cabinet/resource-list'
import { formatDate, formatPrice } from '@/lib/format'

const TABS = [
    { label: 'Все', value: '' },
    { label: 'На модерации', value: 'moderation' },
    { label: 'Активные', value: 'active' },
    { label: 'Отклонённые', value: 'rejected' },
    { label: 'Заблокированные', value: 'blocked' },
]

const COLUMNS = [
    {
        key: 'name',
        title: 'Исполнитель',
        render: (row) => (
            <span className="flex items-center gap-3">
                <Avatar src={row.avatar} name={row.name} size="sm" />
                {row.name}
            </span>
        ),
    },
    { key: 'type', title: 'Тип' },
    { key: 'city', title: 'Город' },
    { key: 'agency', title: 'Агентство', render: (row) => row.agency?.name || '—' },
    { key: 'status', title: 'Статус', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'createdAt', title: 'Создан', render: (row) => formatDate(row.createdAt) },
]

export default function AdminExecutors() {
    const router = useRouter()

    return (
        <Card title="Исполнители" padded={false} className="border-0 bg-transparent">
            <ResourceList
                endpoint="/admin/executors/"
                tabs={TABS}
                limit={20}
                createText="Создать исполнителя"
                createHref="/admin/executors/new"
                emptyTitle="Ничего не найдено"
                emptyDescription="Попробуйте другой фильтр."
                renderTable={(rows) => (
                    <DataTable
                        columns={COLUMNS}
                        rows={rows}
                        onRowClick={(row) => router.push(`/admin/executors/${row.id}`)}
                    />
                )}
            />
        </Card>
    )
}
