'use client'

import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import SettingsNav from '@/components/cabinet/settings-nav'
import FormCard from '@/components/cabinet/form-card'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import Spinner from '@/components/ui/spinner'
import { useApi, useAction } from '@/lib/use-api'
import * as customerApi from '@/lib/api/customer'
import { customerProfile } from '@/lib/adapters'

// ─────────────────────────────────────────────────────────────────────────────
// «Редактировать профиль» — Figma 260:6973.
//
// Ma'lumot: GET /customer/cabinet.
// Saqlash: PATCH /customer/profile/info  +  PATCH /customer/profile/contacts —
// backend ma'lumot va kontaktlarni alohida qabul qiladi (backend/customer.md).
//
// Forma javob kelgandan keyin mount bo'ladi, shuning uchun boshlang'ich
// qiymatlar `useState` initsializatorida oʻqiladi (effektda `setState` emas).
// ─────────────────────────────────────────────────────────────────────────────
export default function ClientSettings() {
    const fetcher = useCallback(() => customerApi.cabinet(), [])
    const { data, loading, error, reload } = useApi(fetcher)

    return (
        <>
            <SettingsNav rolePrefix="client" />
            {loading || !data ? (
                <div className="flex min-h-[240px] items-center justify-center rounded-[12px] bg-white">
                    {loading ? <Spinner size={32} /> : <p className="text-base text-grey">{error?.message}</p>}
                </div>
            ) : (
                <ClientSettingsForm data={data} onSaved={reload} />
            )}
        </>
    )
}

function ClientSettingsForm({ data, onSaved }) {
    const saveInfo = useAction(customerApi.updateInfo)
    const saveContacts = useAction(customerApi.updateContacts)

    const isCompany = data?.user?.customer_type === 'company'

    const [form, setForm] = useState(() => {
        const p = customerProfile(data)
        return {
            name: isCompany ? p.companyName : `${p.firstName} ${p.lastName}`.trim(),
            city: p.city || '',
            phone: p.phone || '',
            email: p.email || '',
            field: p.field || '',
            about: p.about === 'Информация о компании пока не заполнена' ? '' : p.about || '',
        }
    })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    async function submit() {
        const [first, ...rest] = form.name.trim().split(' ')
        const info = await saveInfo.run({
            customer_type: isCompany ? 'company' : 'individual',
            company_name: isCompany ? form.name : undefined,
            first_name: isCompany ? undefined : first || undefined,
            last_name: isCompany ? undefined : rest.join(' ') || undefined,
            sphere_of_activity: isCompany ? form.field || undefined : undefined,
            city: form.city,
            about: form.about || undefined,
        })
        if (!info.success) {
            toast.error(info.error.message)
            return
        }

        // Pochta «Изменить почту» ekranida tasdiqlash bilan o'zgaradi.
        const contacts = await saveContacts.run({
            phone: form.phone || undefined,
            contact_phone: form.phone || undefined,
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
            title="Редактировать профиль"
            description="Эти данные видят исполнители, которых вы приглашаете."
            onSubmit={submit}
            loading={saveInfo.loading || saveContacts.loading}
        >
            <Input
                label={isCompany ? 'Название компании' : 'Имя'}
                value={form.name}
                onChange={set('name')}
                required
            />
            {isCompany && (
                <Input
                    label="Сфера деятельности"
                    value={form.field}
                    onChange={set('field')}
                    placeholder="Например, российский бренд одежды"
                />
            )}
            <Input label="Город" value={form.city} onChange={set('city')} />
            <Input label="Телефон" type="tel" value={form.phone} onChange={set('phone')} />
            <Input label="Почта" type="email" value={form.email} disabled readOnly />
            <Textarea
                label={isCompany ? 'О компании' : 'О себе'}
                value={form.about}
                maxLength={1000}
                onChange={set('about')}
            />
        </FormCard>
    )
}
