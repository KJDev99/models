'use client'

import React, { useCallback } from 'react'
import AdminVenueForm from '@/components/admin/venues/venue-form'
import { useApi } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'

// «Редактировать площадку» — GET /admin/venues/{id} bilan to'ldirilgan forma.
export default function AdminVenueFormLoader({ id }) {
    const fetcher = useCallback(() => adminApi.venue(id), [id])
    const { data, loading, error } = useApi(fetcher, { enabled: Boolean(id) })

    if (loading || error || !data) {
        return loading ? (
            <div className="h-[600px] animate-pulse rounded-[6px] bg-black/5" />
        ) : (
            <p className="rounded-[6px] bg-white p-[40px] text-center text-[14px] text-grey lg:text-[16px]">
                {error?.message || 'Площадка не найдена'}
            </p>
        )
    }

    return <AdminVenueForm mode="edit" initialValues={toFormValues(data)} />
}

// Narxlar backendda `[{ rental_type, price_label }]` — nomi bo'yicha ajratamiz.
function priceOf(list, name) {
    return (list || []).find((p) => p.rental_type === name)?.price_label || ''
}

function toFormValues(v) {
    return {
        owner: v.owner_id || v.owner?.id || '',
        name: v.name || '',
        type: v.category || '',
        about: v.description || '',
        suitable: v.suitable_for || [],
        area: v.area_m2 ?? '',
        height: v.ceiling_height_m ?? '',
        capacity: v.capacity ?? '',
        halls: v.halls_count ?? '',
        light: v.natural_light ? 'yes' : 'no',
        parking: v.parking ? 'yes' : 'no',
        city: v.city || '',
        address: v.address || '',
        weekday: priceOf(v.prices, 'Будни'),
        weekend: priceOf(v.prices, 'Выходные'),
        day: priceOf(v.prices, 'Съёмочный день'),
        extra: priceOf(v.prices, 'Дополнительный час'),
        equipment: v.equipment_description || '',
        // Eskizlar uchun manzillar ro'yxati.
        photoUrls: (v.media || []).map((m) => m.url).filter(Boolean),
    }
}
