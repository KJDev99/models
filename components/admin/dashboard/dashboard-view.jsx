'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/card'
import StatTile from '@/components/ui/stat-tile'
import Spinner from '@/components/ui/spinner'
import { formatDateTime } from '@/lib/format'
import { useApiStore } from '@/store/useApiStore'

// Figma: Дашборд (321:12629).
const TILES = [
    { key: 'executors', label: 'Исполнителей', href: '/admin/executors' },
    { key: 'clients', label: 'Заказчиков', href: '/admin/clients' },
    { key: 'agencies', label: 'Агентств', href: '/admin/agencies' },
    { key: 'projects', label: 'Проектов', href: '/admin/projects' },
    { key: 'venues', label: 'Площадок', href: '/admin/venues' },
    { key: 'moderation', label: 'На модерации', href: '/admin/moderation' },
    { key: 'complaints', label: 'Жалоб', href: '/admin/complaints' },
    { key: 'reviews', label: 'Отзывов', href: '/admin/reviews' },
]

export default function AdminDashboard() {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const [stats, setStats] = useState(null)
    const [activity, setActivity] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let alive = true
        Promise.all([
            getDataToken('/admin/stats/'),
            getDataToken('/admin/activity/', { limit: 10 }),
        ]).then(([s, a]) => {
            if (!alive) return
            setStats(s.success ? s.data : {})
            const raw = a.data
            setActivity(raw?.results || raw?.data || raw || [])
            setLoading(false)
        })
        return () => {
            alive = false
        }
    }, [getDataToken])

    if (loading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Spinner size={32} />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {TILES.map((t) => (
                    <Link key={t.key} href={t.href}>
                        <StatTile
                            label={t.label}
                            value={stats?.[t.key] ?? 0}
                            hint={stats?.[`${t.key}New`] ? `+${stats[`${t.key}New`]} за неделю` : undefined}
                        />
                    </Link>
                ))}
            </div>

            <Card title="Последние действия">
                {activity.length === 0 ? (
                    <p className="text-base text-grey">Активности пока нет.</p>
                ) : (
                    <ul className="flex flex-col gap-4">
                        {activity.map((a) => (
                            <li
                                key={a.id}
                                className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 pb-4 last:border-0 last:pb-0"
                            >
                                <div>
                                    <p className="text-base text-black">{a.title}</p>
                                    {a.text && <p className="text-sm text-grey">{a.text}</p>}
                                </div>
                                <span className="text-sm text-grey">{formatDateTime(a.createdAt)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    )
}
