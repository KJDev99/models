'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import FormCard from '@/components/cabinet/form-card'
import Spinner from '@/components/ui/spinner'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { useApiStore } from '@/store/useApiStore'

// Figma: анкета исполнителя агентства (345:19306).
export default function AgencyEditExecutor({ id }) {
    const router = useRouter()
    const getDataToken = useApiStore((s) => s.getDataToken)
    const patchDataToken = useApiStore((s) => s.patchDataToken)
    const saving = useApiStore((s) => s.loading)

    const [ready, setReady] = useState(false)
    const [form, setForm] = useState({ name: '', city: '', birthDate: '', height: '', measurements: '', price: '', about: '' })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    useEffect(() => {
        if (!id) return
        let alive = true
        getDataToken(`/agencies/mine/executors/${id}/`).then((res) => {
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
        const res = await patchDataToken(`/agencies/mine/executors/${id}/`, form)
        if (res.success) {
            toast.success('Изменения сохранены')
            router.push(`/agency/executors/${id}`)
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
            title="Редактировать анкету"
            description="После изменений анкета снова уйдёт на модерацию."
            onSubmit={submit}
            submitText="Сохранить изменения"
            loading={saving}
        >
            <Input label="Имя и фамилия" value={form.name} onChange={set('name')} required />
            <Input label="Город" value={form.city} onChange={set('city')} />
            <Input label="Дата рождения" type="date" value={form.birthDate} onChange={set('birthDate')} />
            <Input label="Рост, см" type="number" value={form.height} onChange={set('height')} />
            <Input label="Параметры (ОГ-ОТ-ОБ)" value={form.measurements} onChange={set('measurements')} />
            <Input label="Стоимость смены, ₽" type="number" value={form.price} onChange={set('price')} />
            <Textarea label="О исполнителе" value={form.about} maxLength={2000} onChange={set('about')} />
        </FormCard>
    )
}
