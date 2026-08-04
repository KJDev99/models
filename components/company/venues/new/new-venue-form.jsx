'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import FormCard from '@/components/cabinet/form-card'
import Stepper from '@/components/ui/stepper'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import FileUpload from '@/components/ui/file-upload'
import { useApiStore } from '@/store/useApiStore'

// Figma: "Новая площадка - Основная информация" (227:5938) → "Фотографии"
// (229:6503) → "На модерации" (230:6837).
const STEPS = [{ label: 'Основная информация' }, { label: 'Фотографии' }, { label: 'Модерация' }]

export default function CompanyNewVenue() {
    const router = useRouter()
    const postDataToken = useApiStore((s) => s.postDataToken)
    const postFormDataToken = useApiStore((s) => s.postFormDataToken)
    const loading = useApiStore((s) => s.loading)

    const [step, setStep] = useState(0)
    const [venueId, setVenueId] = useState(null)
    const [photos, setPhotos] = useState([])
    const [form, setForm] = useState({
        name: '',
        city: '',
        address: '',
        area: '',
        ceilingHeight: '',
        pricePerHour: '',
        minHours: '',
        description: '',
        equipment: '',
    })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    async function submitInfo() {
        if (!form.name) {
            toast.error('Укажите название площадки')
            return
        }
        const res = await postDataToken('/venues/', form)
        if (res.success) {
            setVenueId(res.data?.id)
            setStep(1)
        } else {
            toast.error('Не удалось сохранить площадку')
        }
    }

    async function addPhotos(fileList) {
        const files = Array.from(fileList || [])
        // Ko'rinishni darhol yangilaymiz, keyin serverga yuboramiz.
        setPhotos((p) => [
            ...p,
            ...files.map((f) => ({ id: `${f.name}-${f.size}`, url: URL.createObjectURL(f) })),
        ])
        if (!venueId) return
        const fd = new FormData()
        files.forEach((f) => fd.append('photos', f))
        await postFormDataToken(`/venues/${venueId}/photos/`, fd)
    }

    async function submitPhotos() {
        if (photos.length < 3) {
            toast.error('Загрузите минимум 3 фотографии')
            return
        }
        const res = await postDataToken(`/venues/${venueId}/submit/`, {})
        if (res.success) setStep(2)
        else toast.error('Не удалось отправить на модерацию')
    }

    return (
        <>
            <Stepper steps={STEPS} current={step} />

            {step === 0 && (
                <FormCard
                    title="Основная информация"
                    description="Данные площадки, которые увидят заказчики."
                    onSubmit={submitInfo}
                    submitText="Далее"
                    loading={loading}
                >
                    <Input label="Название" value={form.name} onChange={set('name')} required />
                    <Input label="Город" value={form.city} onChange={set('city')} />
                    <Input label="Адрес" value={form.address} onChange={set('address')} />
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Input label="Площадь, м²" type="number" value={form.area} onChange={set('area')} />
                        <Input
                            label="Высота потолков, м"
                            type="number"
                            value={form.ceilingHeight}
                            onChange={set('ceilingHeight')}
                        />
                        <Input
                            label="Цена за час, ₽"
                            type="number"
                            value={form.pricePerHour}
                            onChange={set('pricePerHour')}
                        />
                        <Input
                            label="Минимальная аренда, ч"
                            type="number"
                            value={form.minHours}
                            onChange={set('minHours')}
                        />
                    </div>
                    <Textarea
                        label="Описание"
                        value={form.description}
                        maxLength={2000}
                        onChange={set('description')}
                    />
                    <Textarea
                        label="Оборудование (через запятую)"
                        value={form.equipment}
                        maxLength={1000}
                        onChange={set('equipment')}
                    />
                </FormCard>
            )}

            {step === 1 && (
                <FormCard
                    title="Фотографии"
                    description="Покажите залы, свет и оборудование — так бронируют охотнее."
                    onSubmit={submitPhotos}
                    submitText="Отправить на модерацию"
                    loading={loading}
                >
                    <FileUpload
                        files={photos}
                        onAdd={addPhotos}
                        onRemove={(id) => setPhotos((p) => p.filter((f) => f.id !== id))}
                    />
                </FormCard>
            )}

            {step === 2 && (
                <FormCard
                    title="Площадка на модерации"
                    description="Проверка занимает до 24 часов. Мы пришлём уведомление о решении."
                    onSubmit={() => router.push('/company/venues')}
                    submitText="К списку площадок"
                />
            )}
        </>
    )
}
