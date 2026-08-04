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
]

const COLUMNS = [
    { key: 'name', title: 'Площадка' },
    { key: 'owner', title: 'Владелец', render: (row) => row.owner?.name || '—' },
    { key: 'city', title: 'Город' },
    { key: 'pricePerHour', title: 'Цена/час', render: (row) => formatPrice(row.pricePerHour) },
    { key: 'status', title: 'Статус', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'createdAt', title: 'Добавлена', render: (row) => formatDate(row.createdAt) },
]

export default function AdminVenues() {
    const router = useRouter()

    return (
        <Card title="Площадки" padded={false} className="border-0 bg-transparent">
            <ResourceList
                endpoint="/admin/venues/"
                tabs={TABS}
                limit={20}
                createText="Добавить площадку"
                createHref="/admin/venues/new"
                emptyTitle="Ничего не найдено"
                emptyDescription="Попробуйте другой фильтр."
                renderTable={(rows) => (
                    <DataTable
                        columns={COLUMNS}
                        rows={rows}
                        onRowClick={(row) => router.push(`/admin/venues/${row.id}`)}
                    />
                )}
            />
        </Card>
    )
}
