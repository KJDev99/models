'use client'

import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import SettingsNav from '@/components/cabinet/settings-nav'
import FormCard from '@/components/cabinet/form-card'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import Spinner from '@/components/ui/spinner'
import { useApi, useAction } from '@/lib/use-api'
import * as agencyApi from '@/lib/api/agency'

// ─────────────────────────────────────────────────────────────────────────────
// «Редактировать профиль» агентства — Figma 270:21182.
//
// Ma'lumot: GET /agency/cabinet.
// Saqlash: PATCH /agency/profile/info  +  PATCH /agency/profile/contacts.
// ─────────────────────────────────────────────────────────────────────────────
export default function AgencySettings() {
    const fetcher = useCallback(() => agencyApi.cabinet(), [])
    const { data, loading, error, reload } = useApi(fetcher)

    return (
        <>
            <SettingsNav rolePrefix="agency" />
            {loading || !data ? (
                <div className="flex min-h-[240px] items-center justify-center rounded-[12px] bg-white">
                    {loading ? <Spinner size={32} /> : <p className="text-base text-grey">{error?.message}</p>}
                </div>
            ) : (
                <AgencySettingsForm data={data} onSaved={reload} />
            )}
        </>
    )
}

function AgencySettingsForm({ data, onSaved }) {
    const saveInfo = useAction(agencyApi.updateInfo)
    const saveContacts = useAction(agencyApi.updateContacts)

    const [form, setForm] = useState(() => {
        const u = data.user || {}
        return {
            name: u.agency_name || '',
            representative: u.representative_name || '',
            sphere: data.sphere_of_activity || u.sphere_of_activity || '',
            city: u.city || '',
            phone: data.contact_phone || data.phone || u.phone || '',
            email: u.email || '',
            site: data.website || '',
            about: data.about || '',
        }
    })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    async function submit() {
        const info = await saveInfo.run({
            agency_name: form.name,
            representative_name: form.representative || undefined,
            sphere_of_activity: form.sphere || undefined,
            city: form.city,
            about: form.about || undefined,
        })
        if (!info.success) {
            toast.error(info.error.message)
            return
        }

        const contacts = await saveContacts.run({
            phone: form.phone || undefined,
            contact_phone: form.phone || undefined,
            website: form.site || undefined,
        })
        if (!contacts.success) {
            toast.error(contacts.error.message)
            return
        }

        toast.success('Профиль обновлён')
        onSaved?.()
    }

    return (
        <FormCard
            title="Профиль агентства"
            description="Эти данные видят заказчики на странице агентства."
            onSubmit={submit}
            loading={saveInfo.loading || saveContacts.loading}
        >
            <Input label="Название агентства" value={form.name} onChange={set('name')} required />
            <Input
                label="Имя представителя"
                value={form.representative}
                onChange={set('representative')}
            />
            <Input
                label="Сфера деятельности"
                value={form.sphere}
                onChange={set('sphere')}
                placeholder="Например, модельное агентство"
            />
            <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Город" value={form.city} onChange={set('city')} />
                <Input label="Телефон" type="tel" value={form.phone} onChange={set('phone')} />
            </div>
            {/* Pochta «Изменить почту» ekranida tasdiqlash bilan o'zgaradi. */}
            <Input label="Почта" type="email" value={form.email} disabled readOnly />
            <Input label="Сайт" placeholder="https://" value={form.site} onChange={set('site')} />
            <Textarea
                label="Об агентстве"
                value={form.about}
                maxLength={2000}
                onChange={set('about')}
            />
        </FormCard>
    )
}
