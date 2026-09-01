'use client'

import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AdminClientProfile from '@/components/admin/clients/client-profile'
import { blockPayload } from '@/components/admin/ui/admin-modals'
import { useApi, useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'
import * as site from '@/lib/api/site'
import { adminCustomerProfile } from '@/lib/adapters'

// Adminkadagi zakazchik profili — GET /admin/customers/{id} (backend/admin.md).
export default function AdminClientProfileLoader({ id }) {
    const router = useRouter()

    const fetcher = useCallback(() => adminApi.customer(id), [id])
    const { data, loading, error, reload } = useApi(fetcher, { enabled: Boolean(id) })

    const profile = useMemo(() => adminCustomerProfile(data), [data])

    const update = useAction(adminApi.updateCustomer)
    const upload = useAction(site.upload)
    const block = useAction(adminApi.blockCustomer)
    const unblock = useAction(adminApi.unblockCustomer)
    const remove = useAction(adminApi.deleteCustomer)
    const updateProject = useAction(adminApi.updateProject)
    const deleteProject = useAction(adminApi.deleteProject)
    const updateVenue = useAction(adminApi.updateVenue)
    const deleteVenue = useAction(adminApi.deleteVenue)

    // `PUT /admin/customers/{id}` — to'liq almashtirish: `customer_type` va
    // `city` har safar kerak. Fotoni alohida `{ logo_url }` bilan yuborish
    // 422 berardi va rasm saqlanmasdi (mijoz izohi 31.08).
    function writeBody(extra = {}) {
        const user = data?.user || {}
        return {
            customer_type: user.customer_type || 'individual',
            company_name: user.company_name ?? null,
            first_name: user.first_name || undefined,
            last_name: user.last_name || undefined,
            sphere_of_activity: user.sphere_of_activity ?? null,
            city: user.city ?? null,
            about: data?.about ?? null,
            phone: data?.contact_phone ?? user.phone ?? null,
            email: user.email || undefined,
            website: data?.website ?? null,
            ...extra,
        }
    }

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
                const res = await update.run(
                    id,
                    writeBody({
                        customer_type: isCompany ? 'company' : 'individual',
                        company_name: isCompany ? form.name : null,
                        first_name: isCompany ? undefined : first || undefined,
                        last_name: isCompany ? undefined : rest.join(' ') || undefined,
                        sphere_of_activity: form.field || null,
                        city: form.city || null,
                        about: form.about || null,
                        phone: form.phone || null,
                        email: form.email || undefined,
                        website: form.site || null,
                    }),
                )
                await finish(res, 'Профиль сохранён')
            }}
            onPickPhoto={async (file) => {
                // Avval fayl yuklanadi, so'ng profilga bog'lanadi
                // (CustomerWriteRequest → `logo_url`).
                const up = await upload.run(file)
                if (!up.success) {
                    toast.error(up.error.message)
                    return
                }
                await finish(
                    await update.run(id, writeBody({ logo_url: up.data?.url })),
                    'Фото обновлено',
                )
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
