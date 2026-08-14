'use client'

import React, { useState } from 'react'
import { MapPin, Upload } from 'lucide-react'
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

// ─────────────────────────────────────────────────────────────────────────────
// «Создать площадку» — Figma «Площадки» 343:11570 / mobil 456:23264.
// Tuzilishi «Создать проект» (338:20138) bilan bir xil: raqamlangan bo'limlar
// va o'ngda qadamlar ro'yxati.
// ─────────────────────────────────────────────────────────────────────────────

const TYPES = [
    { value: '', label: 'Выберите тип площадки' },
    { value: 'photo', label: 'Фотостудия' },
    { value: 'loft', label: 'Лофт' },
    { value: 'interior', label: 'Интерьерная студия' },
    { value: 'cyclorama', label: 'Циклорама' },
]

const YES_NO = [
    { value: 'yes', label: 'Есть' },
    { value: 'no', label: 'Нет' },
]

export default function AdminVenueForm({ mode = 'create' }) {
    const editing = mode === 'edit'
    const [done, setDone] = useState(false)
    const [form, setForm] = useState({
        owner: '',
        name: '',
        type: '',
        about: '',
        suitable: ['Портретной съёмки', 'Рекламной съёмки'],
        area: '',
        height: '',
        capacity: '',
        halls: '',
        light: 'yes',
        parking: 'yes',
        city: '',
        address: '',
        weekday: '',
        weekend: '',
        day: '',
        extra: '',
        equipment: '',
        photos: '',
    })

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    return (
        <>
            <AdminBreadcrumb
                items={[
                    { label: 'Административная панель', href: '/admin/dashboard' },
                    { label: 'Площадки', href: '/admin/venues' },
                    { label: editing ? 'Редактировать площадку' : 'Создать площадку' },
                ]}
            />

            <AdminFormLayout
                aside={
                    <AdminFormSteps
                        title="Создание площадки"
                        steps={['Основная информация', 'Характеристики', 'Фотографии']}
                        current={0}
                        onSubmit={() => setDone(true)}
                        submitLabel="Сохранить"
                    />
                }
            >
                <AdminFormHeader
                    title={editing ? 'Редактировать площадку' : 'Создать площадку'}
                    description="Заполните информацию о площадке. После сохранения она будет опубликована и станет доступна заказчикам."
                />

                <AdminFormSection step={1} title="Основная информация">
                    <AdminFieldGroup>
                        <AdminField label="Владелец">
                            <AdminInput
                                value={form.owner}
                                onChange={(e) => set('owner', e.target.value)}
                                placeholder="Введите имя или название компании..."
                            />
                        </AdminField>
                        <AdminFieldRow>
                            <AdminField label="Название площадки">
                                <AdminInput
                                    value={form.name}
                                    onChange={(e) => set('name', e.target.value)}
                                    placeholder="Например: «Studio Loft 21»"
                                />
                            </AdminField>
                            <AdminField label="Тип площадки">
                                <AdminFormSelect
                                    value={form.type}
                                    onChange={(e) => set('type', e.target.value)}
                                    options={TYPES}
                                />
                            </AdminField>
                        </AdminFieldRow>
                        <AdminField label="Описание площадки">
                            <AdminTextarea
                                value={form.about}
                                onChange={(e) => set('about', e.target.value)}
                                placeholder="Что за площадка, какие залы и оборудование доступны."
                            />
                        </AdminField>
                        <AdminField
                            label="Подходит для"
                            hint="Добавьте до 5 направлений, для которых подходит площадка"
                        >
                            <AdminTagInput
                                tags={form.suitable}
                                onChange={(tags) => set('suitable', tags)}
                                placeholder="Введите направление и нажмите Enter"
                            />
                        </AdminField>
                    </AdminFieldGroup>
                </AdminFormSection>

                <AdminFormSection step={2} title="Характеристики">
                    <div className="grid gap-[16px] lg:grid-cols-2">
                        <AdminField label="Площадь">
                            <AdminInput
                                value={form.area}
                                onChange={(e) => set('area', e.target.value)}
                                placeholder="120 м²"
                            />
                        </AdminField>
                        <AdminField label="Высота потолков">
                            <AdminInput
                                value={form.height}
                                onChange={(e) => set('height', e.target.value)}
                                placeholder="5,5 м"
                            />
                        </AdminField>
                        <AdminField label="Вместимость">
                            <AdminInput
                                value={form.capacity}
                                onChange={(e) => set('capacity', e.target.value)}
                                placeholder="до 20 человек"
                            />
                        </AdminField>
                        <AdminField label="Количество залов">
                            <AdminInput
                                value={form.halls}
                                onChange={(e) => set('halls', e.target.value)}
                                placeholder="2"
                            />
                        </AdminField>
                        <AdminField label="Естественный свет">
                            <AdminFormSelect
                                value={form.light}
                                onChange={(e) => set('light', e.target.value)}
                                options={YES_NO}
                            />
                        </AdminField>
                        <AdminField label="Парковка">
                            <AdminFormSelect
                                value={form.parking}
                                onChange={(e) => set('parking', e.target.value)}
                                options={YES_NO}
                            />
                        </AdminField>
                    </div>
                </AdminFormSection>

                <AdminFormSection step={3} title="Адрес и стоимость">
                    <AdminFieldGroup>
                        <AdminFieldRow>
                            <AdminField label="Город">
                                <AdminInput
                                    value={form.city}
                                    onChange={(e) => set('city', e.target.value)}
                                    placeholder="Введите  город"
                                />
                            </AdminField>
                            <AdminField label="Адрес площадки">
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
                            <AdminField label="Будни">
                                <AdminInput
                                    value={form.weekday}
                                    onChange={(e) => set('weekday', e.target.value)}
                                    placeholder="от 2 500 ₽/час"
                                />
                            </AdminField>
                            <AdminField label="Выходные">
                                <AdminInput
                                    value={form.weekend}
                                    onChange={(e) => set('weekend', e.target.value)}
                                    placeholder="от 3 000 ₽/час"
                                />
                            </AdminField>
                        </AdminFieldRow>
                        <AdminFieldRow>
                            <AdminField label="Съёмочный день">
                                <AdminInput
                                    value={form.day}
                                    onChange={(e) => set('day', e.target.value)}
                                    placeholder="от 18 000 ₽"
                                />
                            </AdminField>
                            <AdminField label="Дополнительный час">
                                <AdminInput
                                    value={form.extra}
                                    onChange={(e) => set('extra', e.target.value)}
                                    placeholder="2 500 ₽"
                                />
                            </AdminField>
                        </AdminFieldRow>
                        <AdminField label="Оснащение">
                            <AdminTextarea
                                value={form.equipment}
                                onChange={(e) => set('equipment', e.target.value)}
                                placeholder="Свет, циклорама, гримёрная, Wi-Fi и другое оборудование."
                            />
                        </AdminField>
                    </AdminFieldGroup>
                </AdminFormSection>

                <AdminFormSection step={4} title="Фотографии">
                    <label className="flex cursor-pointer items-center gap-[12px] self-start rounded-[6px] bg-light-white px-[16px] py-[12px] text-[14px] font-medium text-grey transition-colors hover:text-black lg:px-[24px] lg:py-[16px] lg:text-[16px]">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) =>
                                set('photos', `${e.target.files?.length || 0} фото выбрано`)
                            }
                        />
                        <Upload size={24} strokeWidth={2} className="shrink-0" />
                        {form.photos || 'Нажмите для загрузки или перетащите файл сюда'}
                    </label>
                </AdminFormSection>
            </AdminFormLayout>

            <CreatedModal
                open={done}
                onClose={() => setDone(false)}
                viewHref="/admin/venues/v-1"
                listHref="/admin/venues"
            />
        </>
    )
}
