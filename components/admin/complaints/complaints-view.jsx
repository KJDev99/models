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
    { label: 'Новые', value: 'new' },
    { label: 'На рассмотрении', value: 'in_review' },
    { label: 'Принятые', value: 'accepted' },
    { label: 'Отклонённые', value: 'declined' },
]

const COLUMNS = [
    { key: 'reason', title: 'Причина' },
    { key: 'target', title: 'На кого', render: (row) => row.target?.name || '—' },
    { key: 'author', title: 'От кого', render: (row) => row.author?.name || '—' },
    { key: 'status', title: 'Статус', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'createdAt', title: 'Поступила', render: (row) => formatDate(row.createdAt) },
]

export default function AdminComplaints() {
    const router = useRouter()

    return (
        <Card title="Жалобы" padded={false} className="border-0 bg-transparent">
            <ResourceList
                endpoint="/admin/complaints/"
                tabs={TABS}
                limit={20}
                emptyTitle="Жалоб нет"
                emptyDescription="Новые обращения появятся здесь."
                renderTable={(rows) => (
                    <DataTable
                        columns={COLUMNS}
                        rows={rows}
                        onRowClick={(row) => router.push(`/admin/complaints/${row.id}`)}
                    />
                )}
            />
        </Card>
    )
}
