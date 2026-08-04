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
    { label: 'Заблокированные', value: 'blocked' },
]

const COLUMNS = [
    {
        key: 'name',
        title: 'Агентство',
        render: (row) => (
            <span className="flex items-center gap-3">
                <Avatar src={row.logo} name={row.name} size="sm" />
                {row.name}
            </span>
        ),
    },
    { key: 'city', title: 'Город' },
    { key: 'executorsCount', title: 'Исполнителей' },
    { key: 'status', title: 'Статус', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'createdAt', title: 'Регистрация', render: (row) => formatDate(row.createdAt) },
]

export default function AdminAgencies() {
    const router = useRouter()

    return (
        <Card title="Агентства" padded={false} className="border-0 bg-transparent">
            <ResourceList
                endpoint="/admin/agencies/"
                tabs={TABS}
                limit={20}
                createText="Создать агентство"
                createHref="/admin/agencies/new"
                emptyTitle="Ничего не найдено"
                emptyDescription="Попробуйте другой фильтр."
                renderTable={(rows) => (
                    <DataTable
                        columns={COLUMNS}
                        rows={rows}
                        onRowClick={(row) => router.push(`/admin/agencies/${row.id}`)}
                    />
                )}
            />
        </Card>
    )
}
