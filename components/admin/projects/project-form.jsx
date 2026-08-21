'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Camera, MapPin, Minus, Plus, Upload, User, Video } from 'lucide-react'
import {
    AdminBreadcrumb,
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
import { CreatedModal } from '@/components/admin/ui/admin-modals'
import PhotoThumb, { PhotoThumbs } from '@/components/admin/ui/photo-thumb'
import { useApi, useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'
import * as site from '@/lib/api/site'

// ─────────────────────────────────────────────────────────────────────────────
// «Создать проект» — Figma 338:20138 / mobil 455:21332.
// To'rt bo'lim: asosiy ma'lumot, kimni izlayapmiz, suratga olish shartlari,
// muqova. O'ngda ikki qadamli ro'yxat.
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

export default function AdminProjectForm({ mode = 'create', initialValues = null }) {
    const editing = mode === 'edit'
    const router = useRouter()
    const { id } = useParams()

    const [step, setStep] = useState(0)
    const [done, setDone] = useState(false)
    const [savedId, setSavedId] = useState(editing ? id : null)
    const [form, setForm] = useState(() => ({
        client: '',
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

    // «Заказчик» — ro'yxat GET /admin/customers dan (backend/admin.md).
    const customersFetcher = useCallback(() => adminApi.customers({ page_size: 100 }), [])
    const { data: customers } = useApi(customersFetcher)
    const clientOptions = useMemo(
        () => [
            { value: '', label: 'Выберите заказчика' },
            ...((customers?.items || []).map((c) => ({
                value: c.id,
                label:
                    c.company_name ||
                    [c.first_name, c.last_name].filter(Boolean).join(' ') ||
                    c.email,
            }))),
        ],
        [customers],
    )

    const create = useAction(adminApi.createProject)
    const update = useAction(adminApi.updateProject)
    const upload = useAction(site.upload)

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    // Formani `POST/PUT /admin/projects` tanasiga o'giradi.
    function body() {
        return {
            owner_id: form.client || undefined,
            title: form.title,
            category: form.category || undefined,
            project_type: form.type || undefined,
            description: form.description || undefined,
            details: form.details || undefined,
            performer_specialty: form.kind,
            model_count: form.count,
            requirement_tags: form.requirements,
            city: form.city || undefined,
            address: form.address || undefined,
            shoot_date: form.date || undefined,
            time_from: form.from || undefined,
            time_to: form.to || undefined,
            duration_label: DURATIONS.find((d) => d.value === form.duration)?.label || undefined,
            hourly_rate_label: form.rate || undefined,
        }
    }

    async function persist() {
        const res = savedId ? await update.run(savedId, body()) : await create.run(body())
        if (!res.success) {
            toast.error(res.error.message)
            return null
        }
        const nextId = res.data?.id || savedId
        if (nextId && nextId !== savedId) setSavedId(nextId)
        return nextId
    }

    async function next() {
        const projectId = await persist()
        if (!projectId) return
        if (step === 0) {
            toast.success('Сохранено')
            setStep(1)
            return
        }
        setDone(true)
    }

    // Muqova: avval fayl yuklanadi, so'ng loyihaga bog'lanadi.
    async function pickCover(file) {
        if (!file) return
        const res = await upload.run(file)
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        const url = res.data?.url
        set('cover', url)
        const projectId = savedId || (await persist())
        if (projectId) await update.run(projectId, { cover_url: url })
    }

    return (
        <>
            <AdminBreadcrumb
                items={[
                    { label: 'Административная панель', href: '/admin/dashboard' },
                    { label: 'Проекты', href: '/admin/projects' },
                    { label: editing ? 'Редактировать проект' : 'Создать проект' },
                ]}
            />

            <AdminFormLayout
                aside={
                    <AdminFormSteps
                        title="Создание проекта"
                        steps={['Основная информация', 'Подробнее о проекте']}
                        current={step}
                        onSubmit={next}
                        submitLabel={
                            create.loading || update.loading
                                ? 'Сохраняем…'
                                : step === 0
                                  ? 'Далее'
                                  : 'Сохранить'
                        }
                    />
                }
            >
                <AdminFormHeader
                    title={editing ? 'Редактировать проект' : 'Создать проект'}
                    description="Заполните основную информацию о проекте. После сохранения проект будет опубликован и станет доступен исполнителям."
                />

                {step === 0 ? (
                    <>
                        <AdminFormSection step={1} title="Основная информация">
                            <AdminFieldGroup>
                                <AdminField label="Заказчик">
                                    <AdminFormSelect
                                        value={form.client}
                                        onChange={(e) => set('client', e.target.value)}
                                        options={clientOptions}
                                    />
                                </AdminField>
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
                                                            : 'border border-gold text-gold hover:bg-gold/10'
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
                            <label className="flex cursor-pointer items-center gap-[12px] self-start rounded-[6px] bg-light-white px-[16px] py-[12px] text-[14px] font-medium text-grey transition-colors hover:text-black lg:px-[24px] lg:py-[16px] lg:text-[16px]">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        e.target.value = ''
                                        pickCover(file)
                                    }}
                                />
                                <Upload size={24} strokeWidth={2} className="shrink-0" />
                                {upload.loading
                                    ? 'Загружаем…'
                                    : form.cover
                                      ? 'Заменить обложку'
                                      : 'Нажмите для загрузки или перетащите файл сюда'}
                            </label>

                            <PhotoThumb src={form.cover} onRemove={() => set('cover', '')} />
                        </AdminFormSection>
                    </>
                ) : (
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

            <CreatedModal
                open={done}
                onClose={() => {
                    setDone(false)
                    router.push('/admin/projects')
                }}
                viewHref={savedId ? `/admin/projects/${savedId}` : '/admin/projects'}
                listHref="/admin/projects"
            />
        </>
    )
}

// «Количество моделей» — Figma 338:20334.
function Counter({ value, onChange }) {
    return (
        <div className="flex items-center gap-[8px]">
            <button
                type="button"
                onClick={() => onChange(value + 1)}
                aria-label="Больше"
                className="flex size-[32px] cursor-pointer items-center justify-center rounded-[6px] ui-icon-btn"
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
                className="flex size-[32px] cursor-pointer items-center justify-center rounded-[6px] ui-icon-btn"
            >
                <Minus size={20} strokeWidth={2} />
            </button>
        </div>
    )
}
