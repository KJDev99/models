'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { MapPin, Upload, X } from 'lucide-react'
import Container from '@/components/ui/container'
import { ClientBreadcrumb, ClientResult } from '@/components/client/ui/client-ui'
import {
    AdminAddButton,
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
// «Новая площадка» — Figma 227:5938 (Основная информация) · 229:6503
// (Фотографии) · 230:6837 (На модерации). Mobil: 413:15635 · 413:16089 ·
// 414:16558.
//
// Birinchi qadamda to'rt bo'lim, ikkinchisida galereyalar, uchinchisida natija.
// O'ng ustunda uch qadam, «Далее», «В черновик» va (ikkinchi qadamda) «Назад».
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
    { value: '', label: 'Выберите категорию' },
    { value: 'studio', label: 'Фотостудия' },
    { value: 'loft', label: 'Лофт' },
    { value: 'hall', label: 'Зал' },
    { value: 'outdoor', label: 'Открытая площадка' },
]

const TYPES = [
    { value: '', label: 'Выберите тип проекта' },
    { value: 'photo', label: 'Для фотосъёмки' },
    { value: 'video', label: 'Для видеосъёмки' },
    { value: 'event', label: 'Для мероприятий' },
]

const MIN_RENT = [
    { value: '', label: 'Выберите минимальное время аренды' },
    { value: '1', label: '1 час' },
    { value: '2', label: '2 часа' },
    { value: '4', label: '4 часа' },
]

const YES_NO = [
    { value: 'yes', label: 'Есть' },
    { value: 'no', label: 'Нет' },
]

const STEPS = ['Основная информация', 'Фотографии', 'На модерации']

export default function ClientNewVenueForm({ mode = 'create' }) {
    const editing = mode === 'edit'
    const [step, setStep] = useState(0)
    const [form, setForm] = useState({
        title: '',
        category: '',
        type: '',
        description: '',
        city: '',
        address: '',
        suits: ['Портретная съёмка', 'Каталог', 'Реклама'],
        area: '',
        height: '',
        capacity: '',
        halls: '',
        minRent: '',
        floor: '',
        daylight: 'yes',
        lift: 'yes',
        parking: 'yes',
        cargo: 'yes',
        equipment: '',
    })
    const [prices, setPrices] = useState([{ kind: '', value: '' }])
    const [albums, setAlbums] = useState([
        { name: '', photos: ['/img/venues/venue.jpg', '/img/venues/venue.jpg'] },
        { name: '', photos: [] },
    ])

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
                        { label: editing ? 'Редактировать площадку' : 'Новая площадка' },
                    ]}
                />

                <AdminFormLayout
                    aside={
                        <AdminFormSteps
                            title="Создание площадки"
                            steps={STEPS}
                            current={step}
                            onSubmit={() => setStep((s) => Math.min(2, s + 1))}
                            submitLabel={sent ? 'Мои публикации' : 'Далее'}
                            secondary={
                                sent
                                    ? { label: 'Создать новую площадку', onClick: () => setStep(0) }
                                    : { label: 'В черновик', onClick: () => setStep(0) }
                            }
                            tertiary={
                                step === 1 ? { label: 'Назад', onClick: () => setStep(0) } : null
                            }
                        />
                    }
                >
                    {sent ? (
                        <ClientResult
                            title="Площадка успешно отправлена на модерацию"
                            text={
                                'Спасибо! Мы проверим информацию о площадке перед публикацией.\n' +
                                'Обычно модерация занимает до 24 часов.'
                            }
                        />
                    ) : (
                        <AdminFormHeader
                            title={editing ? 'Редактировать площадку' : 'Новая площадка'}
                            description="Заполните основную информацию о площадке. После отправки проект пройдет в модерацию и станет доступен исполнителям"
                        />
                    )}

                    {step === 0 && (
                        <>
                            <AdminFormSection step={1} title="Основная информация">
                                <AdminFieldGroup>
                                    <AdminField label="Название площадки">
                                        <AdminInput
                                            value={form.title}
                                            onChange={(e) => set('title', e.target.value)}
                                            placeholder="Например: Studio Loft 21"
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
                                            value={form.description}
                                            onChange={(e) => set('description', e.target.value)}
                                            placeholder="Расскажите о площадке, её особенностях, интерьере и для каких съёмок она подходит."
                                        />
                                    </AdminField>
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
                                    <AdminField
                                        label="Подходит для"
                                        hint="Добавьте до 5 особенностей площадки"
                                    >
                                        <AdminTagInput
                                            tags={form.suits}
                                            onChange={(tags) => set('suits', tags)}
                                            placeholder="Введите направление и нажмите Enter"
                                        />
                                    </AdminField>
                                </AdminFieldGroup>
                            </AdminFormSection>

                            <AdminFormSection step={2} title="Характеристики">
                                <AdminFieldGroup>
                                    <AdminFieldRow>
                                        <AdminField label="Площадь">
                                            <AdminInput
                                                value={form.area}
                                                onChange={(e) => set('area', e.target.value)}
                                                placeholder="Например: 120"
                                            />
                                        </AdminField>
                                        <AdminField label="Высота потолков">
                                            <AdminInput
                                                value={form.height}
                                                onChange={(e) => set('height', e.target.value)}
                                                placeholder="Например: 5,5 м"
                                            />
                                        </AdminField>
                                    </AdminFieldRow>
                                    <AdminFieldRow>
                                        <AdminField label="Вместимость">
                                            <AdminInput
                                                value={form.capacity}
                                                onChange={(e) => set('capacity', e.target.value)}
                                                placeholder="Например: 20 человек"
                                            />
                                        </AdminField>
                                        <AdminField label="Количество залов">
                                            <AdminInput
                                                value={form.halls}
                                                onChange={(e) => set('halls', e.target.value)}
                                                placeholder="Например: 2"
                                            />
                                        </AdminField>
                                    </AdminFieldRow>
                                    <AdminFieldRow>
                                        <AdminField label="Минимальная аренда">
                                            <AdminFormSelect
                                                value={form.minRent}
                                                onChange={(e) => set('minRent', e.target.value)}
                                                options={MIN_RENT}
                                            />
                                        </AdminField>
                                        <AdminField label="Этаж">
                                            <AdminInput
                                                value={form.floor}
                                                onChange={(e) => set('floor', e.target.value)}
                                                placeholder="Например: 3"
                                            />
                                        </AdminField>
                                    </AdminFieldRow>
                                    <AdminFieldRow>
                                        <AdminField label="Естественный свет">
                                            <AdminFormSelect
                                                value={form.daylight}
                                                onChange={(e) => set('daylight', e.target.value)}
                                                options={YES_NO}
                                            />
                                        </AdminField>
                                        <AdminField label="Лифт">
                                            <AdminFormSelect
                                                value={form.lift}
                                                onChange={(e) => set('lift', e.target.value)}
                                                options={YES_NO}
                                            />
                                        </AdminField>
                                    </AdminFieldRow>
                                    <AdminFieldRow>
                                        <AdminField label="Парковка">
                                            <AdminFormSelect
                                                value={form.parking}
                                                onChange={(e) => set('parking', e.target.value)}
                                                options={YES_NO}
                                            />
                                        </AdminField>
                                        <AdminField label="Грузовой вход">
                                            <AdminFormSelect
                                                value={form.cargo}
                                                onChange={(e) => set('cargo', e.target.value)}
                                                options={YES_NO}
                                            />
                                        </AdminField>
                                    </AdminFieldRow>
                                </AdminFieldGroup>
                            </AdminFormSection>

                            <AdminFormSection step={3} title="Стоимость">
                                <AdminFieldGroup>
                                    {prices.map((price, i) => (
                                        <AdminFieldRow key={`price-${i}`}>
                                            <AdminField label="Тип аренды">
                                                <AdminInput
                                                    value={price.kind}
                                                    onChange={(e) =>
                                                        setPrices((list) =>
                                                            list.map((p, j) =>
                                                                j === i
                                                                    ? { ...p, kind: e.target.value }
                                                                    : p
                                                            )
                                                        )
                                                    }
                                                    placeholder="Например: Будни"
                                                />
                                            </AdminField>
                                            <AdminField label="Стоимость">
                                                <AdminInput
                                                    value={price.value}
                                                    onChange={(e) =>
                                                        setPrices((list) =>
                                                            list.map((p, j) =>
                                                                j === i
                                                                    ? { ...p, value: e.target.value }
                                                                    : p
                                                            )
                                                        )
                                                    }
                                                    placeholder="Например: 2500 ₽/час"
                                                />
                                            </AdminField>
                                        </AdminFieldRow>
                                    ))}
                                    <AdminAddButton
                                        onClick={() =>
                                            setPrices((list) => [...list, { kind: '', value: '' }])
                                        }
                                    >
                                        Добавить стоимость
                                    </AdminAddButton>
                                </AdminFieldGroup>
                            </AdminFormSection>

                            <AdminFormSection step={4} title="Оснащение">
                                <AdminField label="Описание оснащения">
                                    <AdminTextarea
                                        value={form.equipment}
                                        onChange={(e) => set('equipment', e.target.value)}
                                        placeholder="Расскажите, какое оборудование и удобства доступны на площадке."
                                    />
                                </AdminField>
                            </AdminFormSection>
                        </>
                    )}

                    {step === 1 && (
                        <AdminFormSection
                            step={5}
                            title="Фотографии"
                            description="Создавайте отдельные галереи для разных зон площадки, например: «Кухня», «Белый зал» или «Гримёрная»."
                        >
                            <AdminFieldGroup>
                                <AdminField
                                    label="Обложка площадки"
                                    hint="Эта фотография будет отображаться в каталоге и на странице площадки."
                                >
                                    <UploadBox />
                                </AdminField>

                                {albums.map((album, i) => (
                                    <div
                                        key={`album-${i}`}
                                        className="flex flex-col gap-[12px] lg:gap-[16px]"
                                    >
                                        <div className="flex items-center justify-between gap-[12px]">
                                            <span className="text-[14px] text-grey lg:text-[16px]">
                                                Альбом {i + 1}
                                            </span>
                                            {i > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setAlbums((list) =>
                                                            list.filter((_, j) => j !== i)
                                                        )
                                                    }
                                                    aria-label="Удалить альбом"
                                                    className="cursor-pointer text-black transition-opacity hover:opacity-70"
                                                >
                                                    <X size={20} strokeWidth={2} />
                                                </button>
                                            )}
                                        </div>

                                        <AdminInput
                                            value={album.name}
                                            onChange={(e) =>
                                                setAlbums((list) =>
                                                    list.map((a, j) =>
                                                        j === i ? { ...a, name: e.target.value } : a
                                                    )
                                                )
                                            }
                                            placeholder="Например: Белый зал"
                                        />

                                        <UploadBox />

                                        {album.photos.length > 0 && (
                                            <div className="flex flex-wrap gap-[12px] lg:gap-[16px]">
                                                {album.photos.map((photo, j) => (
                                                    <span
                                                        key={`photo-${j}`}
                                                        className="relative block size-[64px] overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:size-[80px]"
                                                    >
                                                        <Image
                                                            src={photo}
                                                            alt=""
                                                            fill
                                                            sizes="80px"
                                                            className="object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setAlbums((list) =>
                                                                    list.map((a, k) =>
                                                                        k === i
                                                                            ? {
                                                                                  ...a,
                                                                                  photos: a.photos.filter(
                                                                                      (_, m) =>
                                                                                          m !== j
                                                                                  ),
                                                                              }
                                                                            : a
                                                                    )
                                                                )
                                                            }
                                                            aria-label="Удалить фото"
                                                            className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30 text-white transition-colors hover:bg-black/45"
                                                        >
                                                            <X size={20} strokeWidth={2} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <AdminAddButton
                                    onClick={() =>
                                        setAlbums((list) => [...list, { name: '', photos: [] }])
                                    }
                                >
                                    Добавить галерею
                                </AdminAddButton>
                            </AdminFieldGroup>
                        </AdminFormSection>
                    )}
                </AdminFormLayout>
            </div>
        </Container>
    )
}

// Fayl yuklash maydoni (Figma 227:6084).
function UploadBox() {
    return (
        <label className="flex cursor-pointer items-center gap-[12px] self-start rounded-[6px] bg-light-white px-[16px] py-[12px] text-[14px] font-medium text-grey transition-colors hover:text-black lg:px-[24px] lg:py-[16px] lg:text-[16px]">
            <input type="file" accept="image/*" multiple className="hidden" />
            <Upload size={24} strokeWidth={2} className="shrink-0" />
            Нажмите для загрузки или перетащите файл сюда
        </label>
    )
}
