'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Stepper from '@/components/ui/stepper'
import FormCard from '@/components/cabinet/form-card'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import Textarea from '@/components/ui/textarea'
import FileUpload from '@/components/ui/file-upload'
import Button from '@/components/ui/button'
import { EXECUTOR_TYPES, EXECUTOR_TYPE_META } from '@/lib/roles'
import { useApiStore } from '@/store/useApiStore'

// Figma: Основная информация (260:12972) → Опыт участия в проектах (264:13381)
// → Портфолио (265:13865) → Анкета отправлена на модерацию (265:14317).
const STEPS = [
    { label: 'Основная информация' },
    { label: 'Опыт' },
    { label: 'Портфолио' },
    { label: 'Модерация' },
]

const TYPE_OPTIONS = Object.entries(EXECUTOR_TYPE_META).map(([value, meta]) => ({
    value,
    label: meta.label,
}))

const GENDER_OPTIONS = [
    { value: 'female', label: 'Женский' },
    { value: 'male', label: 'Мужской' },
]

export default function ExecutorQuestionnaire() {
    const router = useRouter()
    const getDataToken = useApiStore((s) => s.getDataToken)
    const patchDataToken = useApiStore((s) => s.patchDataToken)
    const postDataToken = useApiStore((s) => s.postDataToken)
    const postFormDataToken = useApiStore((s) => s.postFormDataToken)
    const loading = useApiStore((s) => s.loading)

    const [step, setStep] = useState(0)
    const [photos, setPhotos] = useState([])
    const [form, setForm] = useState({
        type: EXECUTOR_TYPES.MODEL,
        name: '',
        gender: 'female',
        birthDate: '',
        city: '',
        height: '',
        measurements: '',
        clothingSize: '',
        shoeSize: '',
        hairColor: '',
        eyeColor: '',
        price: '',
        about: '',
        experience: '',
        education: '',
        languages: '',
    })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    function setValue(key) {
        return (value) => setForm((f) => ({ ...f, [key]: value }))
    }

    // Mavjud anketa bo'lsa — maydonlarni to'ldiramiz.
    useEffect(() => {
        let alive = true
        getDataToken('/executors/mine/').then((res) => {
            if (!alive || !res.success || !res.data) return
            setForm((f) => {
                const next = { ...f }
                Object.keys(f).forEach((k) => {
                    if (res.data[k] != null) next[k] = res.data[k]
                })
                return next
            })
            setPhotos(res.data.photos || [])
        })
        return () => {
            alive = false
        }
    }, [getDataToken])

    async function saveStep(nextStep) {
        const res = await patchDataToken('/executors/mine/', form)
        if (res.success) setStep(nextStep)
        else toast.error('Не удалось сохранить')
    }

    async function addPhotos(fileList) {
        const files = Array.from(fileList || [])
        setPhotos((p) => [
            ...p,
            ...files.map((f) => ({ id: `${f.name}-${f.size}`, url: URL.createObjectURL(f) })),
        ])
        const fd = new FormData()
        files.forEach((f) => fd.append('photos', f))
        await postFormDataToken('/executors/mine/photos/', fd)
    }

    async function submitForModeration() {
        if (photos.length < 3) {
            toast.error('Загрузите минимум 3 фотографии')
            return
        }
        const res = await postDataToken('/executors/mine/submit/', {})
        if (res.success) setStep(3)
        else toast.error('Не удалось отправить анкету')
    }

    return (
        <>
            <Stepper steps={STEPS} current={step} />

            {step === 0 && (
                <FormCard
                    title="Основная информация"
                    description="Эти данные видят заказчики в каталоге."
                    onSubmit={() => saveStep(1)}
                    submitText="Далее"
                    loading={loading}
                >
                    <Select
                        label="Кто вы"
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
                            label="Размер одежды"
                            value={form.clothingSize}
                            onChange={set('clothingSize')}
                        />
                        <Input label="Размер обуви" value={form.shoeSize} onChange={set('shoeSize')} />
                        <Input label="Цвет волос" value={form.hairColor} onChange={set('hairColor')} />
                        <Input label="Цвет глаз" value={form.eyeColor} onChange={set('eyeColor')} />
                        <Input
                            label="Стоимость смены, ₽"
                            type="number"
                            value={form.price}
                            onChange={set('price')}
                        />
                    </div>
                    <Textarea label="О себе" value={form.about} maxLength={1500} onChange={set('about')} />
                </FormCard>
            )}

            {step === 1 && (
                <FormCard
                    title="Опыт участия в проектах"
                    description="Расскажите о съёмках, показах и брендах, с которыми работали."
                    onSubmit={() => saveStep(2)}
                    submitText="Далее"
                    loading={loading}
                    secondary={
                        <Button variant="ghost" onClick={() => setStep(0)}>
                            Назад
                        </Button>
                    }
                >
                    <Textarea
                        label="Опыт"
                        value={form.experience}
                        maxLength={2000}
                        placeholder="2024 — рекламная съёмка для бренда..."
                        onChange={set('experience')}
                    />
                    <Input label="Образование / курсы" value={form.education} onChange={set('education')} />
                    <Input
                        label="Языки"
                        placeholder="Русский, английский"
                        value={form.languages}
                        onChange={set('languages')}
                    />
                </FormCard>
            )}

            {step === 2 && (
                <FormCard
                    title="Портфолио"
                    description="Минимум 3 фотографии. Первая станет обложкой анкеты."
                    onSubmit={submitForModeration}
                    submitText="Отправить на модерацию"
                    loading={loading}
                    secondary={
                        <Button variant="ghost" onClick={() => setStep(1)}>
                            Назад
                        </Button>
                    }
                >
                    <FileUpload
                        files={photos}
                        onAdd={addPhotos}
                        onRemove={(id) => setPhotos((p) => p.filter((f) => (f.id || f.url) !== id))}
                    />
                </FormCard>
            )}

            {step === 3 && (
                <FormCard
                    title="Анкета отправлена на модерацию"
                    description="Проверка занимает до 24 часов. Мы пришлём уведомление о решении."
                    onSubmit={() => router.push('/executor/dashboard')}
                    submitText="В личный кабинет"
                />
            )}
        </>
    )
}
