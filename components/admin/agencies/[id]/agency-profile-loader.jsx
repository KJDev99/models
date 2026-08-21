'use client'

import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AdminAgencyProfile from '@/components/admin/agencies/agency-profile'
import { blockPayload } from '@/components/admin/ui/admin-modals'
import { useApi, useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'
import * as site from '@/lib/api/site'
import { adminAgencyProfile } from '@/lib/adapters'

// Adminkadagi agentlik profili — GET /admin/agencies/{id} (backend/admin.md).
// «Исполнители» bo'limidagi «⋮» amallari ijrochining o'z endpointlariga ketadi.
export default function AdminAgencyProfileLoader({ id }) {
    const router = useRouter()

    const fetcher = useCallback(() => adminApi.agency(id), [id])
    const { data, loading, error, reload } = useApi(fetcher, { enabled: Boolean(id) })

    const profile = useMemo(() => adminAgencyProfile(data), [data])

    const update = useAction(adminApi.updateAgency)
    const upload = useAction(site.upload)
    const blockAgency = useAction(adminApi.blockAgency)
    const unblockAgency = useAction(adminApi.unblockAgency)
    const removeAgency = useAction(adminApi.deleteAgency)
    const blockPerformer = useAction(adminApi.blockPerformer)
    const unblockPerformer = useAction(adminApi.unblockPerformer)
    const removePerformer = useAction(adminApi.deletePerformer)

    async function finish(res, message) {
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success(message)
        reload()
    }

    if (loading || error || !profile) {
        return loading ? (
            <div className="h-[600px] animate-pulse rounded-[6px] bg-black/5" />
        ) : (
            <p className="rounded-[6px] bg-white p-[40px] text-center text-[14px] text-grey lg:text-[16px]">
                {error?.message || 'Агентство не найдено'}
            </p>
        )
    }

    // Bir xil oynalar ham agentlikka, ham uning ijrochisiga ishlatiladi:
    // qaysi qator ekanini `row.id` ajratadi.
    const isAgency = (row) => !row || row.id === profile.id

    return (
        <AdminAgencyProfile
            profile={profile}
            onSave={async (form) => {
                const res = await update.run(id, {
                    agency_name: form.name || undefined,
                    representative_name: form.manager || null,
                    sphere_of_activity: form.field || null,
                    city: form.city || null,
                    about: form.about || null,
                    phone: form.phone || null,
                    email: form.email || undefined,
                })
                await finish(res, 'Профиль сохранён')
            }}
            onPickPhoto={async (file) => {
                // AgencyWriteRequest → `logo_url`.
                const up = await upload.run(file)
                if (!up.success) {
                    toast.error(up.error.message)
                    return
                }
                await finish(await update.run(id, { logo_url: up.data?.url }), 'Логотип обновлён')
            }}
            onBlock={async (row, form) => {
                const payload = blockPayload(form)
                const res = isAgency(row)
                    ? await blockAgency.run(id, payload)
                    : await blockPerformer.run(row.id, payload)
                await finish(res, 'Заблокирован')
            }}
            onUnblock={async (row) => {
                const res = isAgency(row)
                    ? await unblockAgency.run(id)
                    : await unblockPerformer.run(row.id)
                await finish(res, 'Разблокирован')
            }}
            onDelete={async (row) => {
                if (!isAgency(row)) {
                    await finish(await removePerformer.run(row.id), 'Исполнитель удалён')
                    return
                }
                const res = await removeAgency.run(id)
                if (!res.success) toast.error(res.error.message)
                else {
                    toast.success('Агентство удалено')
                    router.push('/admin/agencies')
                }
            }}
        />
    )
}
