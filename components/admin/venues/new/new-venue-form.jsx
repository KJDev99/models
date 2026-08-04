'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import FormCard from '@/components/cabinet/form-card'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { useApiStore } from '@/store/useApiStore'

export default function AdminNewVenue() {
    const router = useRouter()
    const getDataToken = useApiStore((s) => s.getDataToken)
    const postDataToken = useApiStore((s) => s.postDataToken)
    const loading = useApiStore((s) => s.loading)

    const [form, setForm] = useState({ name: '', city: '', address: '', area: '', pricePerHour: '', description: '' })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    async function submit() {
        const res = await postDataToken('/admin/venues/', form)
        if (res.success) {
            toast.success('Сохранено')
            router.push('/admin/venues')
        } else {
            toast.error('Не удалось сохранить')
        }
    }

    return (
        <FormCard
            title="Добавить площадку"
            description="Ручное добавление площадки администратором."
            onSubmit={submit}
            submitText="Создать"
            submitVariant="gold"
            loading={loading}
        >
                <Input label="Название" value={form.name} onChange={set('name')} required />
                <Input label="Город" value={form.city} onChange={set('city')} />
                <Input label="Адрес" value={form.address} onChange={set('address')} />
                <Input label="Площадь, м²" type="number" value={form.area} onChange={set('area')} />
                <Input label="Цена за час, ₽" type="number" value={form.pricePerHour} onChange={set('pricePerHour')} />
                <Textarea label="Описание" value={form.description} maxLength={2000} onChange={set('description')} />
        </FormCard>
    )
}
