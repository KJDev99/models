'use client'

import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import {
    AdminAddButton,
    AdminBreadcrumb,
    AdminField,
    AdminFieldGroup,
    AdminFieldRow,
    AdminFormHeader,
    AdminFormLayout,
    AdminFormSection,
    AdminFormSelect,
    AdminFormSteps,
    AdminFormTabs,
    AdminInput,
    AdminTagInput,
    AdminTextarea,
} from '@/components/admin/ui/admin-form'
import { CreatedModal } from '@/components/admin/ui/admin-modals'
import {
    EXECUTOR_STEPS,
    EXECUTOR_TYPES,
    EXPERIENCE_FIELDS,
    PARAM_FIELDS,
} from '@/components/admin/executors/executor-form-data'

// ─────────────────────────────────────────────────────────────────────────────
// Figma: Создать исполнителя (335:14800) / Основная информация 326 (446:15438).
//
// Figma'da sehrgarning faqat birinchi qadami chizilgan («Основная информация»).
// Qolgan ikki qadam — «Опыт участия в проектах» va «Портфолио» — shu uslubda,
// anketa sahifasidagi maydonlar asosida qurildi.
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminExecutorForm({ mode = 'create', initial, scope }) {
    const editing = mode === 'edit'
    // Agentlik ichidan ochilganda sarlavha va yo'lakcha o'zgaradi (Figma 342:10168).
    const inAgency = scope === 'agency'

    const [step, setStep] = useState(0)
    const [done, setDone] = useState(false)
    const [form, setForm] = useState(() => ({
        type: 'model',
        firstName: '',
        lastName: '',
        city: '',
        about: '',
        tags: [],
        email: '',
        phone: '',
        password: '',
        years: '',
        shoots: '',
        brands: '',
        projects: '',
        params: {},
        prices: [{ type: '', value: '' }],
        works: [{ year: '', project: '', brand: '', role: '' }],
        photos: [],
        ...initial,
    }))

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    function setParam(key, value) {
        setForm((f) => ({ ...f, params: { ...f.params, [key]: value } }))
    }

    function next() {
        if (step < EXECUTOR_STEPS.length - 1) {
            setStep(step + 1)
            return
        }
        setDone(true)
    }

    return (
        <>
            <AdminBreadcrumb
                items={
                    inAgency
                        ? [
                              { label: 'Административная панель', href: '/admin/dashboard' },
                              { label: 'Агентства', href: '/admin/agencies' },
                              { label: 'Добавить исполнителя' },
                          ]
                        : [
                              { label: 'Административная панель', href: '/admin/dashboard' },
                              { label: 'Исполнители', href: '/admin/executors' },
                              {
                                  label: editing
                                      ? 'Редактировать исполнителя'
                                      : 'Создать исполнителя',
                              },
                          ]
                }
            />

            <AdminFormLayout
                aside={
                    <AdminFormSteps
                        title={editing ? 'Редактирование профиля' : 'Создание профиля'}
                        steps={EXECUTOR_STEPS}
                        current={step}
                        onSubmit={next}
                        submitLabel={step === EXECUTOR_STEPS.length - 1 ? 'Сохранить' : 'Далее'}
                    />
                }
            >
                <AdminFormHeader
                    title={
                        inAgency
                            ? 'Добавить исполнителя'
                            : editing
                              ? 'Редактировать исполнителя'
                              : 'Создать исполнителя'
                    }
                    description={
                        inAgency
                            ? 'Заполните информацию об исполнителе агентства. После сохранения он появится в списке исполнителей агентства.'
                            : 'Заполните основную информацию об исполнителе. После сохранения профиль сразу появится в каталоге исполнителей.'
                    }
                />

                {step === 0 && (
                    <>
                        <AdminFormSection step={1} title="Основная информация">
                            <AdminFormTabs
                                tabs={EXECUTOR_TYPES}
                                value={form.type}
                                onChange={(v) => set('type', v)}
                            />

                            <AdminFieldGroup>
                                <AdminFieldRow>
                                    <AdminField label="Имя">
                                        <AdminInput
                                            value={form.firstName}
                                            onChange={(e) => set('firstName', e.target.value)}
                                            placeholder="Катерина"
                                        />
                                    </AdminField>
                                    <AdminField label="Фамилия">
                                        <AdminInput
                                            value={form.lastName}
                                            onChange={(e) => set('lastName', e.target.value)}
                                            placeholder="Журавлева"
                                        />
                                    </AdminField>
                                </AdminFieldRow>

                                <AdminField label="Город">
                                    <AdminInput
                                        value={form.city}
                                        onChange={(e) => set('city', e.target.value)}
                                        placeholder="Санкт-Петербург"
                                    />
                                </AdminField>

                                <AdminField label="О себе">
                                    <AdminTextarea
                                        value={form.about}
                                        onChange={(e) => set('about', e.target.value)}
                                        placeholder="Расскажите об исполнителе, его опыте работы и направлениях деятельности."
                                    />
                                </AdminField>

                                <AdminField
                                    label="Направления работы"
                                    hint="Добавьте до 5 направлений, в которых вы работаете"
                                >
                                    <AdminTagInput
                                        tags={form.tags}
                                        onChange={(tags) => set('tags', tags)}
                                        placeholder="Введите направление и нажмите Enter"
                                    />
                                </AdminField>
                            </AdminFieldGroup>
                        </AdminFormSection>

                        <AdminFormSection step={2} title="Данные для входа">
                            <AdminFieldGroup>
                                <AdminField label="Электронная почта">
                                    <AdminInput
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => set('email', e.target.value)}
                                        placeholder="Введите почту"
                                    />
                                </AdminField>
                                <AdminField label="Телефон">
                                    <AdminInput
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => set('phone', e.target.value)}
                                        placeholder="Введите номер телефона"
                                    />
                                </AdminField>
                                <AdminField label="Пароль">
                                    <AdminInput
                                        type="password"
                                        value={form.password}
                                        onChange={(e) => set('password', e.target.value)}
                                        placeholder="Введите пароль"
                                    />
                                </AdminField>
                            </AdminFieldGroup>
                        </AdminFormSection>

                        <AdminFormSection step={3} title="Опыт работы">
                            <AdminFieldGroup>
                                {EXPERIENCE_FIELDS.map((field) => (
                                    <AdminField key={field.key} label={field.label}>
                                        <AdminInput
                                            inputMode="numeric"
                                            value={form[field.key]}
                                            onChange={(e) => set(field.key, e.target.value)}
                                            placeholder="Например: 4"
                                        />
                                    </AdminField>
                                ))}
                            </AdminFieldGroup>
                        </AdminFormSection>

                        <AdminFormSection step={4} title="Параметры">
                            <div className="grid gap-[16px] lg:grid-cols-2">
                                {PARAM_FIELDS.map((field) => (
                                    <AdminField
                                        key={field.key}
                                        label={field.label}
                                        className={field.full ? 'lg:col-span-2' : ''}
                                    >
                                        <AdminFormSelect
                                            value={form.params[field.key] || ''}
                                            onChange={(e) => setParam(field.key, e.target.value)}
                                            options={field.options}
                                        />
                                    </AdminField>
                                ))}
                            </div>
                        </AdminFormSection>

                        <AdminFormSection
                            step={5}
                            title="Стоимость"
                            description="Укажите форматы работы и стоимость услуг. Можно добавить несколько вариантов."
                        >
                            <AdminFieldGroup>
                                {form.prices.map((price, i) => (
                                    <AdminFieldRow key={i}>
                                        <AdminField label="Тип услуги">
                                            <AdminInput
                                                value={price.type}
                                                onChange={(e) =>
                                                    set(
                                                        'prices',
                                                        form.prices.map((p, k) =>
                                                            k === i ? { ...p, type: e.target.value } : p
                                                        )
                                                    )
                                                }
                                                placeholder="Например: Съёмка"
                                            />
                                        </AdminField>
                                        <AdminField label="Стоимость">
                                            <AdminInput
                                                value={price.value}
                                                onChange={(e) =>
                                                    set(
                                                        'prices',
                                                        form.prices.map((p, k) =>
                                                            k === i ? { ...p, value: e.target.value } : p
                                                        )
                                                    )
                                                }
                                                placeholder="Например: 2500 ₽/час"
                                            />
                                        </AdminField>
                                    </AdminFieldRow>
                                ))}
                            </AdminFieldGroup>

                            <AdminAddButton
                                onClick={() => set('prices', [...form.prices, { type: '', value: '' }])}
                            >
                                Добавить стоимость
                            </AdminAddButton>
                        </AdminFormSection>
                    </>
                )}

                {step === 1 && (
                    <AdminFormSection
                        step={1}
                        title="Опыт участия в проектах"
                        description="Добавьте проекты, в которых участвовал исполнитель. Они появятся в анкете отдельной таблицей."
                    >
                        <AdminFieldGroup>
                            {form.works.map((work, i) => (
                                <div key={i} className="flex flex-col gap-[16px]">
                                    <AdminFieldRow>
                                        <AdminField label="Год">
                                            <AdminInput
                                                inputMode="numeric"
                                                value={work.year}
                                                onChange={(e) =>
                                                    set(
                                                        'works',
                                                        form.works.map((w, k) =>
                                                            k === i ? { ...w, year: e.target.value } : w
                                                        )
                                                    )
                                                }
                                                placeholder="2026"
                                            />
                                        </AdminField>
                                        <AdminField label="Проект">
                                            <AdminInput
                                                value={work.project}
                                                onChange={(e) =>
                                                    set(
                                                        'works',
                                                        form.works.map((w, k) =>
                                                            k === i
                                                                ? { ...w, project: e.target.value }
                                                                : w
                                                        )
                                                    )
                                                }
                                                placeholder="Рекламная кампания нового бренда одежды"
                                            />
                                        </AdminField>
                                    </AdminFieldRow>
                                    <AdminFieldRow>
                                        <AdminField label="Бренд / заказчик">
                                            <AdminInput
                                                value={work.brand}
                                                onChange={(e) =>
                                                    set(
                                                        'works',
                                                        form.works.map((w, k) =>
                                                            k === i ? { ...w, brand: e.target.value } : w
                                                        )
                                                    )
                                                }
                                                placeholder="LIME"
                                            />
                                        </AdminField>
                                        <AdminField label="Роль">
                                            <AdminInput
                                                value={work.role}
                                                onChange={(e) =>
                                                    set(
                                                        'works',
                                                        form.works.map((w, k) =>
                                                            k === i ? { ...w, role: e.target.value } : w
                                                        )
                                                    )
                                                }
                                                placeholder="Главная модель"
                                            />
                                        </AdminField>
                                    </AdminFieldRow>

                                    {form.works.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                set(
                                                    'works',
                                                    form.works.filter((_, k) => k !== i)
                                                )
                                            }
                                            className="flex cursor-pointer items-center gap-[8px] self-start text-[14px] font-medium text-[#d14343] transition-opacity hover:opacity-70 lg:text-[16px]"
                                        >
                                            <Trash2 size={20} strokeWidth={2} />
                                            Удалить проект
                                        </button>
                                    )}
                                </div>
                            ))}
                        </AdminFieldGroup>

                        <AdminAddButton
                            onClick={() =>
                                set('works', [
                                    ...form.works,
                                    { year: '', project: '', brand: '', role: '' },
                                ])
                            }
                        >
                            Добавить проект
                        </AdminAddButton>
                    </AdminFormSection>
                )}

                {step === 2 && (
                    <AdminFormSection
                        step={1}
                        title="Портфолио"
                        description="Загрузите работы исполнителя. Первая фотография станет обложкой анкеты."
                    >
                        <PortfolioUpload
                            photos={form.photos}
                            onChange={(photos) => set('photos', photos)}
                        />
                    </AdminFormSection>
                )}
            </AdminFormLayout>

            <CreatedModal
                open={done}
                onClose={() => setDone(false)}
                viewHref="/admin/executors/e-1"
                listHref="/admin/executors"
            />
        </>
    )
}

// Portfolio yuklash — Figma'da adminka uchun alohida chizilmagan, sayt
// bo'ylab ishlatiladigan yuklash qolipida.
function PortfolioUpload({ photos, onChange }) {
    return (
        <div className="flex flex-col gap-[16px]">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-[8px] rounded-[6px] bg-light-white p-[24px] text-center text-[14px] text-grey transition-colors hover:bg-black/5 lg:p-[40px] lg:text-[16px]">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                        onChange([
                            ...photos,
                            ...Array.from(e.target.files || []).map((file) => file.name),
                        ])
                    }
                />
                Перетащите файлы сюда или нажмите, чтобы выбрать
                <span className="text-[12px] text-[#aaa] lg:text-[14px]">
                    JPG или PNG, до 10 МБ каждая
                </span>
            </label>

            {photos.length > 0 && (
                <ul className="flex flex-col gap-[8px]">
                    {photos.map((name, i) => (
                        <li
                            key={`${name}-${i}`}
                            className="flex items-center justify-between gap-[16px] rounded-[6px] bg-light-white p-[12px] text-[14px] text-grey lg:p-[16px] lg:text-[16px]"
                        >
                            <span className="min-w-0 flex-1 truncate">{name}</span>
                            <button
                                type="button"
                                onClick={() => onChange(photos.filter((_, k) => k !== i))}
                                aria-label="Удалить"
                                className="cursor-pointer text-[#d14343] transition-opacity hover:opacity-70"
                            >
                                <Trash2 size={20} strokeWidth={2} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
