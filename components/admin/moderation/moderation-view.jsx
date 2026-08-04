'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/card'
import DataTable from '@/components/ui/data-table'
import StatusBadge from '@/components/ui/status-badge'
import ResourceList from '@/components/cabinet/resource-list'
import { formatDate } from '@/lib/format'

// Figma: Модерация (343:14293) — barcha turdagi obyektlar bitta navbatda.
const TABS = [
    { label: 'Все', value: '' },
    { label: 'Анкеты', value: 'executor' },
    { label: 'Проекты', value: 'project' },
    { label: 'Площадки', value: 'venue' },
    { label: 'Агентства', value: 'agency' },
]

const TYPE_LABEL = {
    executor: 'Анкета',
    project: 'Проект',
    venue: 'Площадка',
    agency: 'Агентство',
}

const COLUMNS = [
    { key: 'type', title: 'Тип', render: (row) => TYPE_LABEL[row.type] || row.type },
    { key: 'title', title: 'Объект' },
    { key: 'author', title: 'Автор', render: (row) => row.author?.name || '—' },
    { key: 'status', title: 'Статус', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'createdAt', title: 'Поступил', render: (row) => formatDate(row.createdAt) },
]

export default function AdminModeration() {
    const router = useRouter()

    return (
        <Card title="Модерация" padded={false} className="border-0 bg-transparent">
            <ResourceList
                endpoint="/admin/moderation/"
                tabs={TABS}
                limit={20}
                emptyTitle="Очередь пуста"
                emptyDescription="Новые объекты на проверку появятся здесь."
                renderTable={(rows) => (
                    <DataTable
                        columns={COLUMNS}
                        rows={rows}
                        onRowClick={(row) => router.push(`/admin/moderation/${row.id}`)}
                    />
                )}
            />
        </Card>
    )
}
