'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import FormCard from '@/components/cabinet/form-card'
import Spinner from '@/components/ui/spinner'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { useApiStore } from '@/store/useApiStore'

// Figma: проект — редактирование (216:5469).
export default function CompanyEditProject({ id }) {
    const router = useRouter()
    const getDataToken = useApiStore((s) => s.getDataToken)
    const patchDataToken = useApiStore((s) => s.patchDataToken)
    const saving = useApiStore((s) => s.loading)

    const [ready, setReady] = useState(false)
    const [form, setForm] = useState({ title: '', description: '', city: '', startDate: '', deadline: '', fee: '', requirements: '' })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    useEffect(() => {
        if (!id) return
        let alive = true
        getDataToken(`/projects/${id}/`).then((res) => {
            if (!alive) return
            if (res.success && res.data) {
                setForm((f) => {
                    const next = { ...f }
                    Object.keys(f).forEach((k) => {
                        if (res.data[k] != null) next[k] = res.data[k]
                    })
                    return next
                })
            }
            setReady(true)
        })
        return () => {
            alive = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    async function submit() {
        const res = await patchDataToken(`/projects/${id}/`, form)
        if (res.success) {
            toast.success('Изменения сохранены')
            router.push(`/company/projects/${id}`)
        } else {
            toast.error('Не удалось сохранить')
        }
    }

    if (!ready) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Spinner size={32} />
            </div>
        )
    }

    return (
        <FormCard
            title="Редактировать проект"
            description="После изменений проект снова уйдёт на модерацию."
            onSubmit={submit}
            submitText="Сохранить изменения"
            loading={saving}
        >
            <Input label="Название проекта" value={form.title} onChange={set('title')} required />
            <Textarea label="Описание" value={form.description} maxLength={2000} onChange={set('description')} />
            <Input label="Город" value={form.city} onChange={set('city')} />
            <Input label="Дата съёмки" type="date" value={form.startDate} onChange={set('startDate')} />
            <Input label="Приём заявок до" type="date" value={form.deadline} onChange={set('deadline')} />
            <Input label="Гонорар, ₽" type="number" value={form.fee} onChange={set('fee')} />
            <Textarea label="Требования к исполнителям" value={form.requirements} maxLength={2000} onChange={set('requirements')} />
        </FormCard>
    )
}
