'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { CheckCircle, Eye, MinusCircle } from 'lucide-react'
import { AdminCard, AdminGoldLink, AdminStats, AdminStatus, AdminTitle } from '@/components/admin/ui/admin-ui'
import AdminTable from '@/components/admin/ui/admin-table'
import { ModerationDecisionModals } from '@/components/admin/moderation/moderation-modals'
import { useApi, useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'
import { adminDashboard } from '@/lib/adapters'
import toast from 'react-hot-toast'

// Figma: Дашборд (321:12629 / 438:18788)
export default function AdminDashboard() {
    const [decision, setDecision] = useState(null)

    // GET /admin/dashboard — statistika, moderatsiya navbati va yangi
    // foydalanuvchilar bitta so'rovda (backend/admin.md).
    const fetcher = useCallback(() => adminApi.dashboard(), [])
    const { data, loading, reload } = useApi(fetcher)

    const dashboard = useMemo(() => adminDashboard(data), [data])

    const approve = useAction(adminApi.approve)
    const reject = useAction(adminApi.reject)

    // Qaror qabul qilingach ro'yxat serverdan qayta o'qiladi.
    async function resolve(row, comment) {
        const action = comment === undefined ? approve : reject
        const res = comment === undefined
            ? await action.run(row.source, row.id)
            : await action.run(row.source, row.id, comment)
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success(comment === undefined ? 'Одобрено' : 'Отклонено')
        reload()
    }

    if (loading || !dashboard) {
        return (
            <>
                <AdminTitle>Дашборд</AdminTitle>
                <div className="h-[600px] animate-pulse rounded-[6px] bg-black/5" />
            </>
        )
    }

    const requests = dashboard.moderation

    return (
        <>
            <AdminTitle>Дашборд</AdminTitle>

            <AdminStats items={dashboard.stats} />

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
                    empty="Новых заявок нет"
                />
            </AdminCard>

            <AdminCard title="Последние зарегистрированные пользователи">
                <AdminTable
                    rows={dashboard.users}
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
                onApprove={(row) => resolve(row)}
                onReject={(row, comment) => resolve(row, comment || '')}
            />
        </>
    )
}
