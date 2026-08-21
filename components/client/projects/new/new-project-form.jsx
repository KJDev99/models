'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Camera, MapPin, Minus, Plus, Upload, User, Video } from 'lucide-react'
import Container from '@/components/ui/container'
import { ClientBreadcrumb, ClientResult } from '@/components/client/ui/client-ui'
import {
    AdminField,
    AdminFieldGroup,
    AdminFieldRow,
    AdminFormHeader,
    AdminFormLayout,
    AdminFormSection,
    AdminFormSelect,
    AdminFormSteps,
    AdminInput,
    AdminTagInput,
    AdminTextarea,
} from '@/components/admin/ui/admin-form'
import { useAction } from '@/lib/use-api'
import * as customerApi from '@/lib/api/customer'
import * as site from '@/lib/api/site'
import PhotoThumb, { PhotoThumbs } from '@/components/admin/ui/photo-thumb'

// ─────────────────────────────────────────────────────────────────────────────
// «Новый проект» — Figma 208:8790 (Основная информация) · 212:3733 (Подробнее
// о проекте) · 216:4356 (На модерации). Mobil: 400:23150 · 400:24084 · 413:14964.
//
// Chapda to'rt raqamli bo'lim, o'ngda 412px ustun: uch qadam, «Далее» va
// «В черновик». Uchinchi qadamda forma o'rniga natija kartochkasi chiqadi.
// ─────────────────────────────────────────────────────────────────────────────

const EXECUTOR_KINDS = [
    { value: 'model', label: 'Модель', icon: User },
    { value: 'photographer', label: 'Фотограф', icon: Camera },
    { value: 'videographer', label: 'Видеограф', icon: Video },
]

const CATEGORIES = [
    { value: '', label: 'Выберите категорию' },
    { value: 'ads', label: 'Реклама' },
    { value: 'catalog', label: 'Каталог' },
    { value: 'lookbook', label: 'Лукбук' },
    { value: 'clip', label: 'Клип' },
    { value: 'show', label: 'Показ' },
]

const TYPES = [
    { value: '', label: 'Выберите тип проекта' },
    { value: 'commercial', label: 'Коммерческий' },
    { value: 'tfp', label: 'TFP' },
    { value: 'creative', label: 'Творческий' },
]

const DURATIONS = [
    { value: '', label: 'Выберите продолжительность времени' },
    { value: '2', label: '2 часа' },
    { value: '4', label: '4 часа' },
    { value: '6', label: '6 часов' },
    { value: '8', label: '8 часов' },
]

const STEPS = ['Основная информация', 'Подробнее о проекте', 'На модерации']

export default function ClientNewProjectForm({
    mode = 'create',
    projectId = null,
    initialValues = null,
}) {
    const editing = mode === 'edit'
    const router = useRouter()

    const [step, setStep] = useState(0)
    // Yaratilgan loyihaning `id` si — keyingi qadamlar (muqova, submit) uchun.
    const [createdId, setCreatedId] = useState(projectId)
    const [coverFile, setCoverFile] = useState(null)
    // Tanlangan fayl darhol ko'rinishi uchun blob manzili.
    const [coverPreview, setCoverPreview] = useState('')
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState(() => ({
        title: '',
        category: '',
        type: '',
        description: '',
        kind: 'model',
        requirements: [],
        count: 1,
        city: '',
        address: '',
        date: '',
        from: '',
        to: '',
        duration: '',
        rate: '',
        cover: '',
        details: '',
        ...(initialValues || {}),
    }))

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    const sent = step === 2

    const create = useAction(customerApi.createProject)
    const update = useAction(customerApi.updateProject)
    const setCover = useAction(customerApi.setProjectCover)
    const submitProject = useAction(customerApi.submitProject)
    const draftProject = useAction(customerApi.draftProject)
    const upload = useAction(site.upload)

    // Forma qiymatlarini backend maydonlariga o'giradi
    // (Swagger «Customer: Проекты»).
    function body() {
        return {
            title: form.title,
            category: form.category || undefined,
            project_type: form.type || undefined,
            description: form.description || undefined,
            details: form.details || undefined,
            performer_specialty: form.kind,
            model_count: Number(form.count) || 1,
            requirement_tags: form.requirements?.length ? form.requirements : undefined,
            city: form.city || undefined,
            address: form.address || undefined,
            shoot_date: form.date || undefined,
            time_from: form.from || undefined,
            time_to: form.to || undefined,
            duration_label: form.duration || undefined,
            hourly_rate_label: form.rate || undefined,
        }
    }

    // Loyihani saqlaydi (birinchi marta yaratadi, keyin yangilaydi) va
    // muqova tanlangan bo'lsa uni yuklaydi.
    async function persist() {
        let id = createdId
        if (id) {
            const res = await update.run(id, body())
            if (!res.success) throw res.error
        } else {
            const res = await create.run(body())
            if (!res.success) throw res.error
            id = res.data?.id
            setCreatedId(id)
        }

        if (coverFile && id) {
            const uploaded = await upload.run(coverFile)
            if (uploaded.success) await setCover.run(id, uploaded.data.url)
        }
        return id
    }

    async function next() {
        if (sent) {
            router.push('/client/dashboard')
            return
        }

        setSaving(true)
        try {
            const id = await persist()
            if (step === 1) {
                // Ikkinchi qadamdan keyin moderatsiyaga yuboriladi.
                const res = await submitProject.run(id)
                if (!res.success) throw res.error
            }
            setStep((v) => Math.min(2, v + 1))
        } catch (err) {
            toast.error(err?.message || 'Не удалось сохранить проект')
        } finally {
            setSaving(false)
        }
    }

    async function saveDraft() {
        setSaving(true)
        try {
            const id = await persist()
            await draftProject.run(id)
            toast.success('Сохранено в черновик')
            router.push('/client/dashboard')
        } catch (err) {
            toast.error(err?.message || 'Не удалось сохранить черновик')
        } finally {
            setSaving(false)
        }
    }

    return (
        <Container>
            <div className="flex flex-col gap-[16px] py-[16px] lg:gap-[24px] lg:py-[24px]">
                <ClientBreadcrumb
                    items={[
                        { label: 'Главная', href: '/' },
                        { label: 'Личный кабинет', href: '/client/dashboard' },
                        { label: editing ? 'Редактировать проект' : 'Новый проект' },
                    ]}
                />

                <AdminFormLayout
                    aside={
                        <AdminFormSteps
                            title="Создание профиля"
                            steps={STEPS}
                            current={step}
                            onSubmit={next}
                            submitLabel={
                                saving ? 'Сохраняем…' : sent ? 'Мои публикации' : 'Далее'
                            }
                            secondary={
                                sent
                                    ? {
                                          label: 'Создать новый проект',
                                          onClick: () => {
                                              setCreatedId(null)
                                              setStep(0)
                                          },
                                      }
                                    : { label: 'В черновик', onClick: saveDraft }
                            }
                        />
                    }
                >
                    {sent ? (
                        <ClientResult
                            title="Проект успешно отправлен на модерацию"
                            text={
                                'Спасибо! Мы проверим информацию о проекте перед публикацией.\n' +
                                'Обычно модерация занимает до 24 часов.'
                            }
                        />
                    ) : (
                        <AdminFormHeader
                            title={editing ? 'Редактировать проект' : 'Новый проект'}
                            description="Заполните основную информацию о проекте. После отправки проект пройдёт в модерацию и станет доступен исполнителям"
                        />
                    )}

                    {step === 0 && (
                        <>
                            <AdminFormSection step={1} title="Основная информация">
                                <AdminFieldGroup>
                                    <AdminField label="Название проекта">
                                        <AdminInput
                                            value={form.title}
                                            onChange={(e) => set('title', e.target.value)}
                                            placeholder="Например: «Съёмка новой коллекции одежды»"
                                        />
                                    </AdminField>
                                    <AdminFieldRow>
                                        <AdminField label="Категория">
                                            <AdminFormSelect
                                                value={form.category}
                                                onChange={(e) => set('category', e.target.value)}
                                                options={CATEGORIES}
                                            />
                                        </AdminField>
                                        <AdminField label="Тип проекта">
                                            <AdminFormSelect
                                                value={form.type}
                                                onChange={(e) => set('type', e.target.value)}
                                                options={TYPES}
                                            />
                                        </AdminField>
                                    </AdminFieldRow>
                                    <AdminField label="Описание проекта">
                                        <AdminTextarea
                                            value={form.description}
                                            onChange={(e) => set('description', e.target.value)}
                                            placeholder="Что за съёмка, для чего нужны материалы и как будет проходить работа."
                                        />
                                    </AdminField>
                                </AdminFieldGroup>
                            </AdminFormSection>

                            <AdminFormSection step={2} title="Кого ищем?">
                                <AdminFieldGroup>
                                    <AdminField label="Исполнитель">
                                        <div className="flex flex-wrap gap-[12px] lg:gap-[16px]">
                                            {EXECUTOR_KINDS.map((item) => {
                                                const Icon = item.icon
                                                const on = item.value === form.kind
                                                return (
                                                    <button
                                                        key={item.value}
                                                        type="button"
                                                        onClick={() => set('kind', item.value)}
                                                        className={`flex cursor-pointer items-center gap-[8px] rounded-[6px] px-[16px] py-[12px] text-[14px] font-medium transition-colors lg:gap-[12px] lg:text-[16px] ${
                                                            on
                                                                ? 'bg-gold text-white'
                                                                : 'border border-gold text-gold hover:bg-gold hover:text-white'
                                                        }`}
                                                    >
                                                        <Icon size={20} strokeWidth={2} />
                                                        {item.label}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </AdminField>

                                    <AdminField
                                        label="Кого ищем?"
                                        hint="Добавьте до 5 требований к исполнителю"
                                    >
                                        <AdminTagInput
                                            tags={form.requirements}
                                            onChange={(tags) => set('requirements', tags)}
                                            placeholder="Введите требование и нажмите Enter"
                                        />
                                    </AdminField>

                                    <AdminField label="Количество моделей">
                                        <Counter
                                            value={form.count}
                                            onChange={(value) => set('count', value)}
                                        />
                                    </AdminField>
                                </AdminFieldGroup>
                            </AdminFormSection>

                            <AdminFormSection step={3} title="Условия съёмки">
                                <AdminFieldGroup>
                                    <AdminFieldRow>
                                        <AdminField label="Город">
                                            <AdminInput
                                                value={form.city}
                                                onChange={(e) => set('city', e.target.value)}
                                                placeholder="Введите  город"
                                            />
                                        </AdminField>
                                        <AdminField label="Адрес съёмки">
                                            <div className="relative">
                                                <AdminInput
                                                    value={form.address}
                                                    onChange={(e) => set('address', e.target.value)}
                                                    placeholder="Введите  адрес"
                                                    className="pr-[44px]"
                                                />
                                                <MapPin
                                                    size={20}
                                                    strokeWidth={2}
                                                    aria-hidden
                                                    className="pointer-events-none absolute top-1/2 right-[12px] -translate-y-1/2 text-black lg:right-[16px]"
                                                />
                                            </div>
                                        </AdminField>
                                    </AdminFieldRow>

                                    <AdminFieldRow>
                                        <AdminField label="Дата съёмки">
                                            <AdminInput
                                                type="date"
                                                value={form.date}
                                                onChange={(e) => set('date', e.target.value)}
                                            />
                                        </AdminField>
                                        <AdminField label="Время съёмки">
                                            <div className="flex gap-[16px]">
                                                <AdminInput
                                                    type="time"
                                                    value={form.from}
                                                    onChange={(e) => set('from', e.target.value)}
                                                    placeholder="С"
                                                />
                                                <AdminInput
                                                    type="time"
                                                    value={form.to}
                                                    onChange={(e) => set('to', e.target.value)}
                                                    placeholder="До"
                                                />
                                            </div>
                                        </AdminField>
                                    </AdminFieldRow>

                                    <AdminFieldRow>
                                        <AdminField label="Продолжительность">
                                            <AdminFormSelect
                                                value={form.duration}
                                                onChange={(e) => set('duration', e.target.value)}
                                                options={DURATIONS}
                                            />
                                        </AdminField>
                                        <AdminField label="Часовая ставка">
                                            <AdminInput
                                                value={form.rate}
                                                onChange={(e) => set('rate', e.target.value)}
                                                placeholder="от 2 500 ₽/час"
                                            />
                                        </AdminField>
                                    </AdminFieldRow>
                                </AdminFieldGroup>
                            </AdminFormSection>

                            <AdminFormSection step={4} title="Обложка">
                                <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                                    <label className="flex cursor-pointer items-center gap-[12px] self-start rounded-[6px] bg-light-white px-[16px] py-[12px] text-[14px] font-medium text-grey transition-colors hover:text-black lg:px-[24px] lg:py-[16px] lg:text-[16px]">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                e.target.value = ''
                                                if (!file) return
                                                setCoverFile(file)
                                                setCoverPreview(URL.createObjectURL(file))
                                                set('cover', file.name)
                                            }}
                                        />
                                        <Upload size={24} strokeWidth={2} className="shrink-0" />
                                        {coverPreview || form.cover
                                            ? 'Заменить обложку'
                                            : 'Нажмите для загрузки или перетащите файл сюда'}
                                    </label>

                                    <PhotoThumb
                                        src={coverPreview || form.cover}
                                        onRemove={() => {
                                            setCoverFile(null)
                                            setCoverPreview('')
                                            set('cover', '')
                                        }}
                                    />
                                </div>
                            </AdminFormSection>
                        </>
                    )}

                    {step === 1 && (
                        <AdminFormSection
                            step={1}
                            title="Подробнее о проекте"
                            description="Опишите, что предстоит делать, требования к исполнителю и условия съёмки. Этот текст появится на странице проекта."
                        >
                            <AdminTextarea
                                value={form.details}
                                onChange={(e) => set('details', e.target.value)}
                                max={4000}
                                rows={10}
                                placeholder="Что предстоит делать, требования, условия…"
                            />
                        </AdminFormSection>
                    )}
                </AdminFormLayout>
            </div>
        </Container>
    )
}

// «Количество моделей» — Figma 208:9046.
function Counter({ value, onChange }) {
    return (
        <div className="flex items-center gap-[8px]">
            <button
                type="button"
                onClick={() => onChange(value + 1)}
                aria-label="Больше"
                className="ui-icon-btn flex size-[32px] cursor-pointer items-center justify-center rounded-[6px]"
            >
                <Plus size={20} strokeWidth={2} />
            </button>
            <span className="flex size-[32px] items-center justify-center rounded-[6px] bg-light-white text-[14px] font-medium text-black lg:text-[16px]">
                {value}
            </span>
            <button
                type="button"
                onClick={() => onChange(Math.max(1, value - 1))}
                aria-label="Меньше"
                className="ui-icon-btn flex size-[32px] cursor-pointer items-center justify-center rounded-[6px]"
            >
                <Minus size={20} strokeWidth={2} />
            </button>
        </div>
    )
}
