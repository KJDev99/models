'use client'

import React, { useState } from 'react'
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

export default function ClientNewProjectForm({ mode = 'create' }) {
    const editing = mode === 'edit'
    const [step, setStep] = useState(0)
    const [form, setForm] = useState({
        title: '',
        category: '',
        type: '',
        description: '',
        kind: 'model',
        requirements: ['Опыт коммерческих съёмок', 'Уверенная работа перед камерой'],
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
    })

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    const sent = step === 2

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
                            onSubmit={() => setStep((s) => Math.min(2, s + 1))}
                            submitLabel={sent ? 'Мои публикации' : 'Далее'}
                            secondary={
                                sent
                                    ? {
                                          label: 'Создать новый проект',
                                          onClick: () => setStep(0),
                                      }
                                    : { label: 'В черновик', onClick: () => setStep(0) }
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
                                <label className="flex cursor-pointer items-center gap-[12px] self-start rounded-[6px] bg-light-white px-[16px] py-[12px] text-[14px] font-medium text-grey transition-colors hover:text-black lg:px-[24px] lg:py-[16px] lg:text-[16px]">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            set('cover', e.target.files?.[0]?.name || '')
                                        }
                                    />
                                    <Upload size={24} strokeWidth={2} className="shrink-0" />
                                    {form.cover || 'Нажмите для загрузки или перетащите файл сюда'}
                                </label>
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
