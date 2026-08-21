'use client'

import React, { useCallback } from 'react'
import Container from '@/components/ui/container'
import ClientNewProjectForm from '@/components/client/projects/new/new-project-form'
import { useApi } from '@/lib/use-api'
import * as customerApi from '@/lib/api/customer'

// ─────────────────────────────────────────────────────────────────────────────
// «Редактировать проект» — Figma'da alohida ekran yo'q: bu «Новый проект»
// ustasi to'ldirilgan holda ochilgani (208:8790).
//
// Ma'lumot GET /customer/projects/{id} dan olinadi, saqlash esa
// PUT /customer/projects/{id} orqali ketadi (backend/customer.md).
// ─────────────────────────────────────────────────────────────────────────────
export default function ClientEditProject({ id }) {
    const fetcher = useCallback(() => customerApi.project(id), [id])
    const { data, loading, error } = useApi(fetcher, { enabled: Boolean(id) })

    if (loading || error || !data) {
        return (
            <Container>
                <div className="py-[16px] lg:py-[24px]">
                    {loading ? (
                        <div className="h-[600px] animate-pulse rounded-[6px] bg-black/5" />
                    ) : (
                        <p className="rounded-[6px] bg-white p-[40px] text-center text-[14px] text-grey lg:text-[16px]">
                            {error?.message || 'Проект не найден'}
                        </p>
                    )}
                </div>
            </Container>
        )
    }

    return (
        <ClientNewProjectForm
            mode="edit"
            projectId={id}
            initialValues={toFormValues(data)}
        />
    )
}

// Backend maydonlarini forma kalitlariga o'giradi.
function toFormValues(p) {
    return {
        title: p.title || '',
        category: p.category || '',
        type: p.project_type || '',
        description: p.description || '',
        kind: p.performer_specialty || 'model',
        requirements: p.requirement_tags || [],
        count: p.model_count ?? 1,
        city: p.city || '',
        address: p.address || '',
        date: (p.shoot_date || '').slice(0, 10),
        from: p.time_from || '',
        to: p.time_to || '',
        duration: p.duration_label || '',
        rate: p.hourly_rate_label || '',
        cover: '',
        details: p.details || '',
    }
}
