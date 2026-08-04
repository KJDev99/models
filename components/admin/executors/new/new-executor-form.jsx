'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import FormCard from '@/components/cabinet/form-card'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { useApiStore } from '@/store/useApiStore'

export default function AdminNewExecutor() {
    const router = useRouter()
    const getDataToken = useApiStore((s) => s.getDataToken)
    const postDataToken = useApiStore((s) => s.postDataToken)
    const loading = useApiStore((s) => s.loading)

    const [form, setForm] = useState({ name: '', type: '', phone: '', email: '', city: '', height: '', price: '', about: '' })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    async function submit() {
        const res = await postDataToken('/admin/executors/', form)
        if (res.success) {
            toast.success('Сохранено')
            router.push('/admin/executors')
        } else {
            toast.error('Не удалось сохранить')
        }
    }

    return (
        <FormCard
            title="Создать исполнителя"
            description="Анкета создаётся вручную — например, при переносе из старой базы."
            onSubmit={submit}
            submitText="Создать"
            submitVariant="gold"
            loading={loading}
        >
                <Input label="Имя и фамилия" value={form.name} onChange={set('name')} required />
                <Input label="Тип (model / photographer / videographer)" value={form.type} onChange={set('type')} />
                <Input label="Телефон" type="tel" value={form.phone} onChange={set('phone')} />
                <Input label="Почта" type="email" value={form.email} onChange={set('email')} />
                <Input label="Город" value={form.city} onChange={set('city')} />
                <Input label="Рост, см" type="number" value={form.height} onChange={set('height')} />
                <Input label="Стоимость смены, ₽" type="number" value={form.price} onChange={set('price')} />
                <Textarea label="О исполнителе" value={form.about} maxLength={2000} onChange={set('about')} />
        </FormCard>
    )
}
