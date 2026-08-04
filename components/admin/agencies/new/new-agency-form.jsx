'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import FormCard from '@/components/cabinet/form-card'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { useApiStore } from '@/store/useApiStore'

export default function AdminNewAgency() {
    const router = useRouter()
    const getDataToken = useApiStore((s) => s.getDataToken)
    const postDataToken = useApiStore((s) => s.postDataToken)
    const loading = useApiStore((s) => s.loading)

    const [form, setForm] = useState({ name: '', inn: '', city: '', phone: '', email: '', site: '', about: '' })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    async function submit() {
        const res = await postDataToken('/admin/agencies/', form)
        if (res.success) {
            toast.success('Сохранено')
            router.push('/admin/agencies')
        } else {
            toast.error('Не удалось сохранить')
        }
    }

    return (
        <FormCard
            title="Создать агентство"
            description="Ручное создание агентства администратором."
            onSubmit={submit}
            submitText="Создать"
            submitVariant="gold"
            loading={loading}
        >
                <Input label="Название" value={form.name} onChange={set('name')} required />
                <Input label="ИНН" value={form.inn} onChange={set('inn')} />
                <Input label="Город" value={form.city} onChange={set('city')} />
                <Input label="Телефон" type="tel" value={form.phone} onChange={set('phone')} />
                <Input label="Почта" type="email" value={form.email} onChange={set('email')} />
                <Input label="Сайт" value={form.site} onChange={set('site')} />
                <Textarea label="Об агентстве" value={form.about} maxLength={2000} onChange={set('about')} />
        </FormCard>
    )
}
