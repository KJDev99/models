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
    { label: 'Частные лица', value: 'person' },
    { label: 'Компании', value: 'company' },
    { label: 'Заблокированные', value: 'blocked' },
]

const COLUMNS = [
    {
        key: 'name',
        title: 'Заказчик',
        render: (row) => (
            <span className="flex items-center gap-3">
                <Avatar src={row.avatar || row.logo} name={row.name} size="sm" />
                {row.name}
            </span>
        ),
    },
    { key: 'kind', title: 'Тип', render: (row) => (row.isCompany ? 'Компания' : 'Частное лицо') },
    { key: 'city', title: 'Город' },
    { key: 'projectsCount', title: 'Проектов' },
    { key: 'status', title: 'Статус', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'createdAt', title: 'Регистрация', render: (row) => formatDate(row.createdAt) },
]

export default function AdminClients() {
    const router = useRouter()

    return (
        <Card title="Заказчики" padded={false} className="border-0 bg-transparent">
            <ResourceList
                endpoint="/admin/clients/"
                tabs={TABS}
                limit={20}
                emptyTitle="Ничего не найдено"
                emptyDescription="Попробуйте другой фильтр."
                renderTable={(rows) => (
                    <DataTable
                        columns={COLUMNS}
                        rows={rows}
                        onRowClick={(row) => router.push(`/admin/clients/${row.id}`)}
                    />
                )}
            />
        </Card>
    )
}
