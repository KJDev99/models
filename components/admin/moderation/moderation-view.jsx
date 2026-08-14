'use client'

import React, { useMemo, useState } from 'react'
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

// Figma: Модерация (343:14293 / 458:25261)
const TYPES = [
    { value: '', label: 'Все типы' },
    { value: 'Модель', label: 'Модель' },
    { value: 'Фотограф', label: 'Фотограф' },
    { value: 'Видеограф', label: 'Видеограф' },
    { value: 'Площадка', label: 'Площадка' },
    { value: 'Проект', label: 'Проект' },
]

const SAMPLE = [
    { name: 'Анна Смирнова', type: 'Модель' },
    { name: 'Studio Loft 21', type: 'Площадка' },
    { name: 'Съёмка для fashion-бренда', type: 'Проект' },
    { name: 'Studio Loft 21', type: 'Площадка' },
]

const PAGE_SIZE = 9

const QUEUE = Array.from({ length: 45 }, (_, i) => ({
    id: `mo-${i + 1}`,
    ...SAMPLE[i % SAMPLE.length],
    email: 'почта@mail.ru',
    date: '17.07.2026, 14:34',
}))

export default function AdminModeration() {
    const [list, setList] = useState(QUEUE)
    const [query, setQuery] = useState('')
    const [type, setType] = useState('')
    const [page, setPage] = useState(1)
    const [decision, setDecision] = useState(null)

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return list.filter((row) => {
            if (type && row.type !== type) return false
            if (!q) return true
            return `${row.name} ${row.email}`.toLowerCase().includes(q)
        })
    }, [list, query, type])

    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const current = Math.min(page, pages)
    const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

    function resolve(row) {
        setList((all) => all.filter((item) => item.id !== row.id))
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
                    rows={rows}
                    columns={[
                        { key: 'name', label: 'Пользователь' },
                        { key: 'type', label: 'Тип' },
                        { key: 'email', label: 'Email' },
                        { key: 'date', label: 'Дата создания' },
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
                    empty="Заявок на модерацию нет"
                />

                <AdminPagination page={current} pages={pages} onChange={setPage} />
            </AdminListCard>

            <ModerationDecisionModals
                decision={decision}
                onClose={() => setDecision(null)}
                onApprove={resolve}
                onReject={resolve}
            />
        </>
    )
}
