'use client'

import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AdminClientProfile from '@/components/admin/clients/client-profile'
import { blockPayload } from '@/components/admin/ui/admin-modals'
import { useApi, useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'
import { adminCustomerProfile } from '@/lib/adapters'

// Adminkadagi zakazchik profili — GET /admin/customers/{id} (backend/admin.md).
export default function AdminClientProfileLoader({ id }) {
    const router = useRouter()

    const fetcher = useCallback(() => adminApi.customer(id), [id])
    const { data, loading, error, reload } = useApi(fetcher, { enabled: Boolean(id) })

    const profile = useMemo(() => adminCustomerProfile(data), [data])

    const update = useAction(adminApi.updateCustomer)
    const block = useAction(adminApi.blockCustomer)
    const unblock = useAction(adminApi.unblockCustomer)
    const remove = useAction(adminApi.deleteCustomer)
    const updateProject = useAction(adminApi.updateProject)
    const deleteProject = useAction(adminApi.deleteProject)
    const updateVenue = useAction(adminApi.updateVenue)
    const deleteVenue = useAction(adminApi.deleteVenue)

    async function finish(res, message) {
        if (!res.success) {
            toast.error(res.error.message)
            return false
        }
        toast.success(message)
        reload()
        return true
    }

    if (loading || error || !profile) {
        return loading ? (
            <div className="h-[600px] animate-pulse rounded-[6px] bg-black/5" />
        ) : (
            <p className="rounded-[6px] bg-white p-[40px] text-center text-[14px] text-grey lg:text-[16px]">
                {error?.message || 'Заказчик не найден'}
            </p>
        )
    }

    return (
        <AdminClientProfile
            profile={profile}
            onSave={async (form) => {
                const isCompany = form.type === 'company'
                const [first, ...rest] = (form.name || '').split(' ')
                const res = await update.run(id, {
                    customer_type: isCompany ? 'company' : 'individual',
                    company_name: isCompany ? form.name : null,
                    first_name: isCompany ? undefined : first || undefined,
                    last_name: isCompany ? undefined : rest.join(' ') || undefined,
                    // «Сфера деятельности» — CustomerWriteRequest'da bunday
                    // maydon yo'q, backendga so'rov yuborildi (hisobot 15-band).
                    city: form.city || null,
                    about: form.about || null,
                    phone: form.phone || null,
                    email: form.email || undefined,
                    website: form.site || null,
                })
                await finish(res, 'Профиль сохранён')
            }}
            onBlock={async (_row, form) => {
                await finish(await block.run(id, blockPayload(form)), 'Заказчик заблокирован')
            }}
            onUnblock={async () => {
                await finish(await unblock.run(id), 'Заказчик разблокирован')
            }}
            onDelete={async () => {
                const res = await remove.run(id)
                if (!res.success) toast.error(res.error.message)
                else {
                    toast.success('Заказчик удалён')
                    router.push('/admin/clients')
                }
            }}
            // «Публикации» kartochkasidagi «⋮» amallari.
            onPublicationAction={async (kind, item) => {
                const isProject = item.kind === 'projects'
                if (kind === 'delete') {
                    const res = isProject
                        ? await deleteProject.run(item.id)
                        : await deleteVenue.run(item.id)
                    await finish(res, 'Публикация удалена')
                    return
                }
                const status = kind === 'resume' ? 'active' : 'paused'
                const res = isProject
                    ? await updateProject.run(item.id, { status })
                    : await updateVenue.run(item.id, { status })
                await finish(res, status === 'active' ? 'Опубликовано' : 'Снято с публикации')
            }}
        />
    )
}
