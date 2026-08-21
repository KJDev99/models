'use client'

import React, { useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import AdminVenueDetail from '@/components/admin/venues/venue-detail'
import { useApi, useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'
import { portfolioFromMedia, venueDetail } from '@/lib/adapters'

// Adminkadagi maydon kartochkasi — GET /admin/venues/{id} (backend/admin.md).
export default function AdminVenueDetailLoader({ id }) {
    const fetcher = useCallback(() => adminApi.venue(id), [id])
    const { data, loading, error, reload } = useApi(fetcher, { enabled: Boolean(id) })

    const venue = useMemo(() => venueDetail(data), [data])
    const photos = useMemo(() => portfolioFromMedia(data?.media), [data])

    const update = useAction(adminApi.updateVenue)
    const remove = useAction(adminApi.deleteVenue)

    async function setStatus(next, message) {
        const res = await update.run(id, { status: next })
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success(message)
        reload()
    }

    if (loading || error || !venue) {
        return loading ? (
            <div className="h-[600px] animate-pulse rounded-[6px] bg-black/5" />
        ) : (
            <p className="rounded-[6px] bg-white p-[40px] text-center text-[14px] text-grey lg:text-[16px]">
                {error?.message || 'Площадка не найдена'}
            </p>
        )
    }

    return (
        <AdminVenueDetail
            venue={venue}
            photoTabs={photos.tabs}
            photoItems={photos.items}
            editHref={`/admin/venues/${id}/edit`}
            onPause={() => setStatus('paused', 'Площадка снята с публикации')}
            onResume={() => setStatus('active', 'Площадка опубликована')}
            onFinish={() => setStatus('archived', 'Площадка в архиве')}
            onDelete={async () => {
                const res = await remove.run(id)
                if (!res.success) toast.error(res.error.message)
                else toast.success('Площадка удалена')
            }}
        />
    )
}
