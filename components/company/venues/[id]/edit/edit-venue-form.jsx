'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import FormCard from '@/components/cabinet/form-card'
import Spinner from '@/components/ui/spinner'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { useApiStore } from '@/store/useApiStore'

// Figma: площадка — редактирование (230:7018).
export default function CompanyEditVenue({ id }) {
    const router = useRouter()
    const getDataToken = useApiStore((s) => s.getDataToken)
    const patchDataToken = useApiStore((s) => s.patchDataToken)
    const saving = useApiStore((s) => s.loading)

    const [ready, setReady] = useState(false)
    const [form, setForm] = useState({ name: '', city: '', address: '', area: '', ceilingHeight: '', pricePerHour: '', minHours: '', description: '', equipment: '' })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    useEffect(() => {
        if (!id) return
        let alive = true
        getDataToken(`/venues/${id}/`).then((res) => {
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
        const res = await patchDataToken(`/venues/${id}/`, form)
        if (res.success) {
            toast.success('Изменения сохранены')
            router.push(`/company/venues/${id}`)
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
            title="Редактировать площадку"
            description="После изменений площадка снова уйдёт на модерацию."
            onSubmit={submit}
            submitText="Сохранить изменения"
            loading={saving}
        >
            <Input label="Название" value={form.name} onChange={set('name')} required />
            <Input label="Город" value={form.city} onChange={set('city')} />
            <Input label="Адрес" value={form.address} onChange={set('address')} />
            <Input label="Площадь, м²" type="number" value={form.area} onChange={set('area')} />
            <Input label="Высота потолков, м" type="number" value={form.ceilingHeight} onChange={set('ceilingHeight')} />
            <Input label="Цена за час, ₽" type="number" value={form.pricePerHour} onChange={set('pricePerHour')} />
            <Input label="Минимальная аренда, ч" type="number" value={form.minHours} onChange={set('minHours')} />
            <Textarea label="Описание" value={form.description} maxLength={2000} onChange={set('description')} />
            <Textarea label="Оборудование (через запятую)" value={form.equipment} maxLength={2000} onChange={set('equipment')} />
        </FormCard>
    )
}
