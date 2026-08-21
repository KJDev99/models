'use client'

import React, { useCallback } from 'react'
import Container from '@/components/ui/container'
import ClientNewVenueForm from '@/components/client/venues/new/new-venue-form'
import { useApi } from '@/lib/use-api'
import * as customerApi from '@/lib/api/customer'

// ─────────────────────────────────────────────────────────────────────────────
// «Редактировать площадку» — «Новая площадка» ustasi to'ldirilgan holda
// (Figma 227:6084). Ma'lumot GET /customer/venues/{id} dan, saqlash
// PUT /customer/venues/{id} orqali (backend/customer.md).
// ─────────────────────────────────────────────────────────────────────────────
export default function ClientEditVenue({ id }) {
    const fetcher = useCallback(() => customerApi.venue(id), [id])
    const { data, loading, error } = useApi(fetcher, { enabled: Boolean(id) })

    if (loading || error || !data) {
        return (
            <Container>
                <div className="py-[16px] lg:py-[24px]">
                    {loading ? (
                        <div className="h-[600px] animate-pulse rounded-[6px] bg-black/5" />
                    ) : (
                        <p className="rounded-[6px] bg-white p-[40px] text-center text-[14px] text-grey lg:text-[16px]">
                            {error?.message || 'Площадка не найдена'}
                        </p>
                    )}
                </div>
            </Container>
        )
    }

    return <ClientNewVenueForm mode="edit" venueId={id} initialValues={toFormValues(data)} />
}

// «Да» / «Нет» tanlovlari mantiqiy maydonlardan yasaladi.
const yn = (v) => (v === true ? 'yes' : v === false ? 'no' : '')

function toFormValues(v) {
    // Albomlar bo'yicha guruhlangan media.
    const byAlbum = new Map()
    for (const m of v.media || []) {
        const name = m.album || ''
        if (!byAlbum.has(name)) byAlbum.set(name, [])
        byAlbum.get(name).push({ url: m.url, id: m.id })
    }
    const albums = [...byAlbum.entries()].map(([name, photos]) => ({ name, photos }))

    return {
        form: {
            title: v.name || '',
            category: v.category || '',
            type: v.venue_type || '',
            description: v.description || '',
            city: v.city || '',
            address: v.address || '',
            suits: v.suitable_for || [],
            area: v.area_m2 ?? '',
            height: v.ceiling_height_m ?? '',
            capacity: v.capacity ?? '',
            halls: v.halls_count ?? '',
            minRent: v.min_rental_label || '',
            floor: v.floor ?? '',
            daylight: yn(v.natural_light),
            lift: yn(v.elevator),
            parking: yn(v.parking),
            cargo: yn(v.freight_entrance),
            equipment: v.equipment_description || '',
        },
        prices: (v.prices || []).length
            ? v.prices.map((p) => ({ kind: p.rental_type || '', value: p.price_label || '' }))
            : [{ kind: '', value: '' }],
        albums: albums.length ? albums : [{ name: '', photos: [] }],
    }
}
