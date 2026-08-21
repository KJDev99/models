'use client'

import React, { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { AdminListCard, AdminPagination, AdminSearch, AdminSelect } from '@/components/admin/ui/admin-ui'
import Button from '@/components/ui/button'
import AdminVenueRow from '@/components/admin/venues/venue-row-card'
import { publicationMenu } from '@/components/admin/ui/admin-menu-items'
import { DeleteModal } from '@/components/admin/ui/admin-modals'
import { VENUES_PAGE_SIZE, VENUE_STATUS_FILTER } from '@/components/admin/venues/venues-data'
import { useApi, useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'
import { adminVenueRow } from '@/lib/adapters'

// Figma: Площадки (342:10467 / 456:21759)
export default function AdminVenues() {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(1)
    const [removing, setRemoving] = useState(null)

    // Qidiruv, filtr va sahifalash — server tomonida (backend/admin.md).
    const fetcher = useCallback(
        () =>
            adminApi.venues({
                q: query || undefined,
                status: status || undefined,
                page,
                page_size: VENUES_PAGE_SIZE,
            }),
        [query, status, page],
    )
    const { data, loading, error, reload } = useApi(fetcher)

    const rows = useMemo(() => (data?.items || []).map(adminVenueRow), [data])
    const pages = data?.meta?.pages || 1
    const current = data?.meta?.page || page

    const update = useAction(adminApi.updateVenue)
    const remove = useAction(adminApi.deleteVenue)

    async function run(promise, message) {
        const res = await promise
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success(message)
        reload()
    }

    // Menyudagi «Поставить на паузу / Возобновить / Завершить» — holatni
    // yangilaydi (PUT /admin/{resource}/{id}).
    function setStatusOf(item, next, message) {
        return run(update.run(item.id, { status: next }), message)
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
                                    onPause: () =>
                                        setStatusOf(item, 'paused', 'Публикация на паузе'),
                                    onResume: () =>
                                        setStatusOf(item, 'active', 'Публикация возобновлена'),
                                    onFinish: () =>
                                        setStatusOf(item, 'archived', 'Публикация завершена'),
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
                onConfirm={() => run(remove.run(removing.id), 'Публикация удалена')}
            />
        </>
    )
}
