'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import SettingsNav from '@/components/cabinet/settings-nav'
import FormCard from '@/components/cabinet/form-card'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { useApiStore } from '@/store/useApiStore'

// Figma: "Редактировать профиль" агентства (270:21182).
export default function AgencySettings() {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const patchDataToken = useApiStore((s) => s.patchDataToken)
    const loading = useApiStore((s) => s.loading)

    const [form, setForm] = useState({
        name: '',
        inn: '',
        city: '',
        address: '',
        phone: '',
        email: '',
        site: '',
        about: '',
    })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    useEffect(() => {
        let alive = true
        getDataToken('/agencies/mine/').then((res) => {
            if (!alive || !res.success || !res.data) return
            setForm((f) => {
                const next = { ...f }
                Object.keys(f).forEach((k) => {
                    if (res.data[k] != null) next[k] = res.data[k]
                })
                return next
            })
        })
        return () => {
            alive = false
        }
    }, [getDataToken])

    async function submit() {
        const res = await patchDataToken('/agencies/mine/', form)
        if (res.success) toast.success('Профиль обновлён')
        else toast.error('Не удалось сохранить')
    }

    return (
        <>
            <SettingsNav rolePrefix="agency" />
            <FormCard
                title="Профиль агентства"
                description="Эти данные видят заказчики на странице агентства."
                onSubmit={submit}
                loading={loading}
            >
                <Input label="Название агентства" value={form.name} onChange={set('name')} required />
                <Input label="ИНН" value={form.inn} onChange={set('inn')} />
                <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Город" value={form.city} onChange={set('city')} />
                    <Input label="Адрес" value={form.address} onChange={set('address')} />
                    <Input label="Телефон" type="tel" value={form.phone} onChange={set('phone')} />
                    <Input label="Почта" type="email" value={form.email} onChange={set('email')} />
                </div>
                <Input label="Сайт" placeholder="https://" value={form.site} onChange={set('site')} />
                <Textarea label="Об агентстве" value={form.about} maxLength={2000} onChange={set('about')} />
            </FormCard>
        </>
    )
}
