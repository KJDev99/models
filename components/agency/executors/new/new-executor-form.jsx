'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import FormCard from '@/components/cabinet/form-card'
import Stepper from '@/components/ui/stepper'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import Textarea from '@/components/ui/textarea'
import FileUpload from '@/components/ui/file-upload'
import Button from '@/components/ui/button'
import { EXECUTOR_TYPES, EXECUTOR_TYPE_META } from '@/lib/roles'
import { useApiStore } from '@/store/useApiStore'

// Figma: "Добавить исполнителя" (270:21262).
const STEPS = [{ label: 'Основная информация' }, { label: 'Портфолио' }, { label: 'Модерация' }]

const TYPE_OPTIONS = Object.entries(EXECUTOR_TYPE_META).map(([value, meta]) => ({
    value,
    label: meta.label,
}))

const GENDER_OPTIONS = [
    { value: 'female', label: 'Женский' },
    { value: 'male', label: 'Мужской' },
]

export default function AgencyNewExecutor() {
    const router = useRouter()
    const postDataToken = useApiStore((s) => s.postDataToken)
    const postFormDataToken = useApiStore((s) => s.postFormDataToken)
    const loading = useApiStore((s) => s.loading)

    const [step, setStep] = useState(0)
    const [executorId, setExecutorId] = useState(null)
    const [photos, setPhotos] = useState([])
    const [form, setForm] = useState({
        type: EXECUTOR_TYPES.MODEL,
        name: '',
        gender: 'female',
        birthDate: '',
        city: '',
        height: '',
        measurements: '',
        price: '',
        about: '',
    })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    function setValue(key) {
        return (value) => setForm((f) => ({ ...f, [key]: value }))
    }

    async function submitInfo() {
        if (!form.name) {
            toast.error('Укажите имя исполнителя')
            return
        }
        const res = await postDataToken('/agencies/mine/executors/', form)
        if (res.success) {
            setExecutorId(res.data?.id)
            setStep(1)
        } else {
            toast.error('Не удалось создать анкету')
        }
    }

    async function addPhotos(fileList) {
        const files = Array.from(fileList || [])
        setPhotos((p) => [
            ...p,
            ...files.map((f) => ({ id: `${f.name}-${f.size}`, url: URL.createObjectURL(f) })),
        ])
        if (!executorId) return
        const fd = new FormData()
        files.forEach((f) => fd.append('photos', f))
        await postFormDataToken(`/executors/${executorId}/photos/`, fd)
    }

    async function submitForModeration() {
        if (photos.length < 3) {
            toast.error('Загрузите минимум 3 фотографии')
            return
        }
        const res = await postDataToken(`/executors/${executorId}/submit/`, {})
        if (res.success) setStep(2)
        else toast.error('Не удалось отправить на модерацию')
    }

    return (
        <>
            <Stepper steps={STEPS} current={step} />

            {step === 0 && (
                <FormCard
                    title="Основная информация"
                    description="Анкета будет опубликована под брендом вашего агентства."
                    onSubmit={submitInfo}
                    submitText="Далее"
                    loading={loading}
                >
                    <Select
                        label="Тип исполнителя"
                        value={form.type}
                        options={TYPE_OPTIONS}
                        onChange={setValue('type')}
                    />
                    <Input label="Имя и фамилия" value={form.name} onChange={set('name')} required />
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Select
                            label="Пол"
                            value={form.gender}
                            options={GENDER_OPTIONS}
                            onChange={setValue('gender')}
                        />
                        <Input
                            label="Дата рождения"
                            type="date"
                            value={form.birthDate}
                            onChange={set('birthDate')}
                        />
                        <Input label="Город" value={form.city} onChange={set('city')} />
                        <Input label="Рост, см" type="number" value={form.height} onChange={set('height')} />
                        <Input
                            label="Параметры (ОГ-ОТ-ОБ)"
                            value={form.measurements}
                            onChange={set('measurements')}
                        />
                        <Input
                            label="Стоимость смены, ₽"
                            type="number"
                            value={form.price}
                            onChange={set('price')}
                        />
                    </div>
                    <Textarea label="О исполнителе" value={form.about} maxLength={1500} onChange={set('about')} />
                </FormCard>
            )}

            {step === 1 && (
                <FormCard
                    title="Портфолио"
                    description="Минимум 3 фотографии. Первая станет обложкой анкеты."
                    onSubmit={submitForModeration}
                    submitText="Отправить на модерацию"
                    loading={loading}
                    secondary={
                        <Button variant="ghost" onClick={() => setStep(0)}>
                            Назад
                        </Button>
                    }
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
                    title="Анкета отправлена на модерацию"
                    description="Проверка занимает до 24 часов. Решение придёт в уведомления."
                    onSubmit={() => router.push('/agency/executors')}
                    submitText="К списку исполнителей"
                />
            )}
        </>
    )
}
