'use client'

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminListCard, AdminPagination, AdminSearch, AdminSelect } from '@/components/admin/ui/admin-ui'
import Button from '@/components/ui/button'
import AdminVenueRow from '@/components/admin/venues/venue-row-card'
import { publicationMenu } from '@/components/admin/ui/admin-menu-items'
import { DeleteModal } from '@/components/admin/ui/admin-modals'
import {
    ADMIN_VENUES,
    VENUES_PAGE_SIZE,
    VENUE_STATUS_FILTER,
} from '@/components/admin/venues/venues-data'

// Figma: Площадки (342:10467 / 456:21759)
export default function AdminVenues() {
    const router = useRouter()
    const [list, setList] = useState(ADMIN_VENUES)
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(1)
    const [removing, setRemoving] = useState(null)

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return list.filter((row) => {
            if (status && row.status !== status) return false
            if (!q) return true
            return `${row.name} ${row.city}`.toLowerCase().includes(q)
        })
    }, [list, query, status])

    const pages = Math.max(1, Math.ceil(filtered.length / VENUES_PAGE_SIZE))
    const current = Math.min(page, pages)
    const rows = filtered.slice((current - 1) * VENUES_PAGE_SIZE, current * VENUES_PAGE_SIZE)

    function patch(row, changes) {
        setList((all) => all.map((item) => (item.id === row.id ? { ...item, ...changes } : item)))
    }

    return (
        <>
            <AdminListCard
                title="Площадки"
                action={
                    <Button
                        href="/admin/venues/new"
                        variant="gold"
                        size="md"
                        className="lg:text-[16px]"
                    >
                        Создать площадку
                    </Button>
                }
                toolbar={
                    <>
                        <AdminSearch
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                                setPage(1)
                            }}
                            placeholder="Поиск по названию площадки..."
                        />
                        <AdminSelect
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value)
                                setPage(1)
                            }}
                            options={VENUE_STATUS_FILTER}
                            className="lg:w-[227px] lg:shrink-0"
                        />
                    </>
                }
            >
                <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                    {rows.map((venue) => (
                        <AdminVenueRow
                            key={venue.id}
                            venue={venue}
                            menuItems={(item) =>
                                publicationMenu({
                                    status: item.status,
                                    onEdit: () => router.push(`/admin/venues/${item.id}/edit`),
                                    onPause: () => patch(item, { status: 'paused' }),
                                    onResume: () => patch(item, { status: 'active' }),
                                    onFinish: () => patch(item, { status: 'archive' }),
                                    onDelete: () => setRemoving(item),
                                })
                            }
                        />
                    ))}
                </div>

                <AdminPagination page={current} pages={pages} onChange={setPage} />
            </AdminListCard>

            <DeleteModal
                open={Boolean(removing)}
                onClose={() => setRemoving(null)}
                name={removing?.name}
                onConfirm={() => setList((all) => all.filter((item) => item.id !== removing.id))}
            />
        </>
    )
}
