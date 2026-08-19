'use client'

import React, { useState } from 'react'
import { CheckCircle, Eye, MinusCircle } from 'lucide-react'
import { AdminCard, AdminGoldLink, AdminStats, AdminStatus, AdminTitle } from '@/components/admin/ui/admin-ui'
import AdminTable from '@/components/admin/ui/admin-table'
import { ModerationDecisionModals } from '@/components/admin/moderation/moderation-modals'
import {
    DASHBOARD_STATS,
    LATEST_USERS,
    MODERATION_REQUESTS,
} from '@/components/admin/dashboard/dashboard-data'

// Figma: Дашборд (321:12629 / 438:18788)
export default function AdminDashboard() {
    const [requests, setRequests] = useState(MODERATION_REQUESTS)
    const [decision, setDecision] = useState(null)

    // Qaror qabul qilingan qator ro'yxatdan chiqadi.
    function resolve(row) {
        setRequests((list) => list.filter((item) => item.id !== row.id))
    }

    return (
        <>
            <AdminTitle>Дашборд</AdminTitle>

            <AdminStats items={DASHBOARD_STATS} />

            <AdminCard
                title="Последние заявки на модерацию"
                action={<AdminGoldLink href="/admin/moderation">Посмотреть все</AdminGoldLink>}
            >
                <AdminTable
                    rows={requests}
                    columns={[
                        { key: 'name', label: 'Пользователь' },
                        { key: 'type', label: 'Тип' },
                        { key: 'email', label: 'Email' },
                        { key: 'date', label: 'Дата создания' },
                        {
                            key: 'status',
                            label: 'Статус',
                            width: 'lg:w-[133px]',
                            render: (row) => <AdminStatus tone="pending">{row.status}</AdminStatus>,
                        },
                    ]}
                    actions={(row) => [
                        {
                            key: 'view',
                            icon: Eye,
                            label: 'Открыть',
                            href: `/admin/moderation/${row.id}`,
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
                    empty="Новых заявок нет"
                />
            </AdminCard>

            <AdminCard title="Последние зарегистрированные пользователи">
                <AdminTable
                    rows={LATEST_USERS}
                    actionsWidth="lg:w-[24px]"
                    columns={[
                        { key: 'name', label: 'Пользователь' },
                        { key: 'type', label: 'Тип' },
                        { key: 'email', label: 'Email' },
                        { key: 'date', label: 'Дата регистрации' },
                    ]}
                    actions={(row) => [
                        { key: 'view', icon: Eye, label: 'Открыть', href: row.href },
                    ]}
                />
            </AdminCard>

            <ModerationDecisionModals
                decision={decision}
                onClose={() => setDecision(null)}
                onApprove={resolve}
                onReject={resolve}
            />
        </>
    )
}
