'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
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
import PhotoThumb, { PhotoThumbs } from '@/components/admin/ui/photo-thumb'
import { useApi, useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'
import * as site from '@/lib/api/site'
import { num } from '@/components/executor/questionnaire/questionnaire-api'

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

export default function AdminVenueForm({ mode = 'create', initialValues = null }) {
    const editing = mode === 'edit'
    const router = useRouter()
    const { id } = useParams()

    const [done, setDone] = useState(false)
    const [savedId, setSavedId] = useState(editing ? id : null)
    // Yuklangan suratlar manzillari — eskiz sifatida ko'rsatiladi.
    const [photos, setPhotos] = useState(() => initialValues?.photoUrls || [])
    const [form, setForm] = useState(() => ({
        owner: '',
        name: '',
        type: '',
        about: '',
        suitable: [],
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
        ...(initialValues || {}),
    }))

    // «Владелец» — ro'yxat GET /admin/customers dan (backend/admin.md).
    const customersFetcher = useCallback(() => adminApi.customers({ page_size: 100 }), [])
    const { data: customers } = useApi(customersFetcher)
    const ownerOptions = useMemo(
        () => [
            { value: '', label: 'Выберите владельца' },
            ...(customers?.items || []).map((c) => ({
                value: c.id,
                label:
                    c.company_name ||
                    [c.first_name, c.last_name].filter(Boolean).join(' ') ||
                    c.email,
            })),
        ],
        [customers],
    )

    const create = useAction(adminApi.createVenue)
    const update = useAction(adminApi.updateVenue)
    const upload = useAction(site.upload)
    const addPhoto = useAction(adminApi.addVenuePhoto)

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    // Formani `POST/PUT /admin/venues` tanasiga o'giradi.
    //
    // `extra` — muqova kabi keyin ma'lum bo'ladigan maydonlar uchun.
    // Backendda PUT to'liq almashtirish: faqat `{ cover_url }` yuborilsa
    // `owner_id` va `name` yo'qligi uchun 422 qaytadi, shuning uchun
    // muqova ham har doim to'liq tana bilan ketadi (mijoz izohi 31.08).
    function body(extra = {}) {
        const price = (label, value) =>
            value?.trim() ? { rental_type: label, price_label: value.trim() } : null

        return {
            owner_id: form.owner || undefined,
            name: form.name,
            venue_type: TYPES.find((t) => t.value === form.type)?.label || undefined,
            category: form.type || undefined,
            description: form.about || undefined,
            suitable_for: form.suitable,
            area_m2: num(form.area),
            ceiling_height_m: num(form.height),
            capacity: num(form.capacity),
            halls_count: num(form.halls),
            natural_light: form.light === 'yes',
            parking: form.parking === 'yes',
            city: form.city || undefined,
            address: form.address || undefined,
            equipment_description: form.equipment || undefined,
            prices: [
                price('Будни', form.weekday),
                price('Выходные', form.weekend),
                price('Съёмочный день', form.day),
                price('Дополнительный час', form.extra),
            ].filter(Boolean),
            ...extra,
        }
    }

    async function persist(extra = {}) {
        const res = savedId
            ? await update.run(savedId, body(extra))
            : await create.run(body(extra))
        if (!res.success) {
            toast.error(res.error.message)
            return null
        }
        const nextId = res.data?.id || savedId
        if (nextId && nextId !== savedId) setSavedId(nextId)
        return nextId
    }

    async function submit() {
        const venueId = await persist()
        if (venueId) setDone(true)
    }

    // Suratlar: birinchisi muqova, qolganlari galereyaga tushadi.
    async function pickPhotos(files) {
        if (!files.length) return
        const venueId = savedId || (await persist())
        if (!venueId) return

        const added = []
        for (const [i, file] of files.entries()) {
            const res = await upload.run(file)
            if (!res.success) {
                toast.error(res.error.message)
                continue
            }
            const url = res.data?.url
            if (!url) continue
            // Birinchi surat — muqova (agar hali qo'yilmagan bo'lsa).
            if (i === 0 && !photos.length) {
                const cov = await update.run(venueId, body({ cover_url: url }))
                if (!cov.success) toast.error(cov.error.message)
            }
            await addPhoto.run(venueId, { url, album: 'Общие' })
            added.push(url)
        }
        if (added.length) {
            setPhotos((list) => [...list, ...added])
            toast.success(`Загружено фото: ${added.length}`)
        }
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
                        onSubmit={submit}
                        submitLabel={
                            create.loading || update.loading ? 'Сохраняем…' : 'Сохранить'
                        }
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
                            <AdminFormSelect
                                value={form.owner}
                                options={ownerOptions}
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
                            onChange={(e) => {
                                const files = Array.from(e.target.files || [])
                                e.target.value = ''
                                pickPhotos(files)
                            }}
                        />
                        <Upload size={24} strokeWidth={2} className="shrink-0" />
                        {upload.loading
                            ? 'Загружаем…'
                            : photos.length
                              ? 'Добавить ещё'
                              : 'Нажмите для загрузки или перетащите файл сюда'}
                    </label>

                    {photos.length > 0 && (
                        <PhotoThumbs>
                            {photos.map((url, i) => (
                                <PhotoThumb
                                    key={`${url}-${i}`}
                                    src={url}
                                    onRemove={() =>
                                        setPhotos((list) => list.filter((_, k) => k !== i))
                                    }
                                />
                            ))}
                        </PhotoThumbs>
                    )}
                </AdminFormSection>
            </AdminFormLayout>

            <CreatedModal
                open={done}
                onClose={() => {
                    setDone(false)
                    router.push('/admin/venues')
                }}
                viewHref={savedId ? `/admin/venues/${savedId}` : '/admin/venues'}
                listHref="/admin/venues"
            />
        </>
    )
}
