'use client'

import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import SettingsNav from '@/components/cabinet/settings-nav'
import FormCard from '@/components/cabinet/form-card'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import Spinner from '@/components/ui/spinner'
import { useApi, useAction } from '@/lib/use-api'
import * as performerApi from '@/lib/api/performer'

// ─────────────────────────────────────────────────────────────────────────────
// «Настройка профиля» — Figma 265:14993.
//
// Ma'lumot: GET /performer/cabinet.
// Saqlash: PUT /performer/profile — backend anketaning majburiy maydonlarini
// (`performer_specialty`, `first_name`, `city`) har safar talab qiladi,
// shuning uchun ular kabinet javobidan olinib, forma bilan birga yuboriladi.
// ─────────────────────────────────────────────────────────────────────────────
export default function ExecutorSettings() {
    const fetcher = useCallback(() => performerApi.cabinet(), [])
    const { data, loading, error, reload } = useApi(fetcher)

    return (
        <>
            <SettingsNav rolePrefix="executor" />
            {loading || !data ? (
                <div className="flex min-h-[240px] items-center justify-center rounded-[12px] bg-white">
                    {loading ? <Spinner size={32} /> : <p className="text-base text-grey">{error?.message}</p>}
                </div>
            ) : (
                <ExecutorSettingsForm data={data} onSaved={reload} />
            )}
        </>
    )
}

function ExecutorSettingsForm({ data, onSaved }) {
    const save = useAction(performerApi.saveProfile)

    const [form, setForm] = useState(() => {
        const u = data.user || {}
        return {
            firstName: u.first_name || '',
            lastName: u.last_name || '',
            city: u.city || '',
            phone: u.phone || '',
            email: u.email || '',
            about: data.about || '',
        }
    })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    async function submit() {
        const u = data.user || {}
        const res = await save.run({
            performer_specialty: u.performer_specialty,
            first_name: form.firstName,
            last_name: form.lastName || undefined,
            gender: u.gender || 'not_specified',
            city: form.city,
            phone: form.phone || undefined,
            about: form.about || undefined,
        })
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success('Профиль обновлён')
        onSaved?.()
    }

    return (
        <FormCard
            title="Настройка профиля"
            description="Контакты видны только тем заказчикам, с которыми у вас есть переписка."
            onSubmit={submit}
            loading={save.loading}
        >
            <Input label="Имя" value={form.firstName} onChange={set('firstName')} required />
            <Input label="Фамилия" value={form.lastName} onChange={set('lastName')} />
            <Input label="Город" value={form.city} onChange={set('city')} />
            <Input label="Телефон" type="tel" value={form.phone} onChange={set('phone')} />
            {/* Pochta «Изменить почту» ekranida tasdiqlash bilan o'zgaradi. */}
            <Input label="Почта" type="email" value={form.email} disabled readOnly />
            <Textarea label="О себе" value={form.about} maxLength={1500} onChange={set('about')} />
        </FormCard>
    )
}
