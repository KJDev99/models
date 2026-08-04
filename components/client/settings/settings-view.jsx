'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import SettingsNav from '@/components/cabinet/settings-nav'
import FormCard from '@/components/cabinet/form-card'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { useApiStore } from '@/store/useApiStore'

// Figma: "Редактировать профиль" (260:6973).
export default function ClientSettings() {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const patchDataToken = useApiStore((s) => s.patchDataToken)
    const loading = useApiStore((s) => s.loading)

    const [form, setForm] = useState({ name: '', city: '', phone: '', email: '', about: '' })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    useEffect(() => {
        let alive = true
        getDataToken('/profile/').then((res) => {
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
        const res = await patchDataToken('/profile/', form)
        if (res.success) toast.success('Профиль обновлён')
        else toast.error('Не удалось сохранить')
    }

    return (
        <>
            <SettingsNav rolePrefix="client" />
            <FormCard
                title="Редактировать профиль"
                description="Эти данные видят исполнители, которых вы приглашаете."
                onSubmit={submit}
                loading={loading}
            >
                <Input label="Имя" value={form.name} onChange={set('name')} required />
                <Input label="Город" value={form.city} onChange={set('city')} />
                <Input label="Телефон" type="tel" value={form.phone} onChange={set('phone')} />
                <Input label="Почта" type="email" value={form.email} onChange={set('email')} />
                <Textarea label="О себе" value={form.about} maxLength={1000} onChange={set('about')} />
            </FormCard>
        </>
    )
}
