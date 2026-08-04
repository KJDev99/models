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
    { label: 'Завершённые', value: 'completed' },
]

const COLUMNS = [
    { key: 'title', title: 'Проект' },
    { key: 'company', title: 'Заказчик', render: (row) => row.company?.name || row.owner?.name || '—' },
    { key: 'city', title: 'Город' },
    { key: 'fee', title: 'Гонорар', render: (row) => formatPrice(row.fee) },
    { key: 'responsesCount', title: 'Откликов' },
    { key: 'status', title: 'Статус', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'startDate', title: 'Дата съёмки', render: (row) => formatDate(row.startDate) },
]

export default function AdminProjects() {
    const router = useRouter()

    return (
        <Card title="Проекты" padded={false} className="border-0 bg-transparent">
            <ResourceList
                endpoint="/admin/projects/"
                tabs={TABS}
                limit={20}
                createText="Создать проект"
                createHref="/admin/projects/new"
                emptyTitle="Ничего не найдено"
                emptyDescription="Попробуйте другой фильтр."
                renderTable={(rows) => (
                    <DataTable
                        columns={COLUMNS}
                        rows={rows}
                        onRowClick={(row) => router.push(`/admin/projects/${row.id}`)}
                    />
                )}
            />
        </Card>
    )
}
