'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import FormCard from '@/components/cabinet/form-card'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { useApiStore } from '@/store/useApiStore'

export default function AdminNewProject() {
    const router = useRouter()
    const getDataToken = useApiStore((s) => s.getDataToken)
    const postDataToken = useApiStore((s) => s.postDataToken)
    const loading = useApiStore((s) => s.loading)

    const [form, setForm] = useState({ title: '', description: '', city: '', startDate: '', fee: '', requirements: '' })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    async function submit() {
        const res = await postDataToken('/admin/projects/', form)
        if (res.success) {
            toast.success('Сохранено')
            router.push('/admin/projects')
        } else {
            toast.error('Не удалось сохранить')
        }
    }

    return (
        <FormCard
            title="Создать проект"
            description="Ручное создание проекта администратором."
            onSubmit={submit}
            submitText="Создать"
            submitVariant="gold"
            loading={loading}
        >
                <Input label="Название" value={form.title} onChange={set('title')} required />
                <Textarea label="Описание" value={form.description} maxLength={2000} onChange={set('description')} />
                <Input label="Город" value={form.city} onChange={set('city')} />
                <Input label="Дата съёмки" type="date" value={form.startDate} onChange={set('startDate')} />
                <Input label="Гонорар, ₽" type="number" value={form.fee} onChange={set('fee')} />
                <Textarea label="Требования" value={form.requirements} maxLength={2000} onChange={set('requirements')} />
        </FormCard>
    )
}
