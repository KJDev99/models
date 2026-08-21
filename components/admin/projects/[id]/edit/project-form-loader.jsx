'use client'

import React, { useCallback } from 'react'
import AdminProjectForm from '@/components/admin/projects/project-form'
import { useApi } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'

// «Редактировать проект» — GET /admin/projects/{id} bilan to'ldirilgan forma.
export default function AdminProjectFormLoader({ id }) {
    const fetcher = useCallback(() => adminApi.project(id), [id])
    const { data, loading, error } = useApi(fetcher, { enabled: Boolean(id) })

    if (loading || error || !data) {
        return loading ? (
            <div className="h-[600px] animate-pulse rounded-[6px] bg-black/5" />
        ) : (
            <p className="rounded-[6px] bg-white p-[40px] text-center text-[14px] text-grey lg:text-[16px]">
                {error?.message || 'Проект не найден'}
            </p>
        )
    }

    return <AdminProjectForm mode="edit" initialValues={toFormValues(data)} />
}

// Backend maydonlarini forma kalitlariga o'giradi.
function toFormValues(p) {
    return {
        client: p.owner_id || p.owner?.id || '',
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
        duration: '',
        rate: p.hourly_rate_label || '',
        cover: p.cover_url || '',
        details: p.details || '',
    }
}
