'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import FormCard from '@/components/cabinet/form-card'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { useApiStore } from '@/store/useApiStore'

export default function CompanyNewProject() {
    const router = useRouter()
    const getDataToken = useApiStore((s) => s.getDataToken)
    const postDataToken = useApiStore((s) => s.postDataToken)
    const loading = useApiStore((s) => s.loading)

    const [form, setForm] = useState({ title: '', description: '', category: '', city: '', startDate: '', deadline: '', fee: '', requirements: '' })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    async function submit() {
        const res = await postDataToken('/projects/', form)
        if (res.success) {
            toast.success('Сохранено')
            router.push('/company/projects')
        } else {
            toast.error('Не удалось сохранить')
        }
    }

    return (
        <FormCard
            title="Новый проект"
            description="Основная информация о съёмке"
            onSubmit={submit}
            submitText="Отправить на модерацию"
            submitVariant="gold"
            loading={loading}
        >
                <Input label="Название проекта" value={form.title} onChange={set('title')} required />
                <Textarea label="Описание" value={form.description} maxLength={2000} onChange={set('description')} />
                <Input label="Категория" value={form.category} onChange={set('category')} />
                <Input label="Город" value={form.city} onChange={set('city')} />
                <Input label="Дата съёмки" type="date" value={form.startDate} onChange={set('startDate')} />
                <Input label="Приём заявок до" type="date" value={form.deadline} onChange={set('deadline')} />
                <Input label="Гонорар, ₽" type="number" value={form.fee} onChange={set('fee')} />
                <Textarea label="Требования к исполнителям" value={form.requirements} maxLength={2000} onChange={set('requirements')} />
        </FormCard>
    )
}
