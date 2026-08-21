'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Upload, X } from 'lucide-react'
import Container from '@/components/ui/container'
import { CabinetBreadcrumb, CabinetResult } from '@/components/shared/cabinet/cabinet-ui'
import { PLACEHOLDER } from '@/lib/assets'
import {
    experienceItems,
    performerActions,
    profileBody,
} from '@/components/executor/questionnaire/questionnaire-api'
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
    AdminFormTabs,
    AdminInput,
    AdminTagInput,
    AdminTextarea,
} from '@/components/admin/ui/admin-form'

// ─────────────────────────────────────────────────────────────────────────────
// «Заполнить профиль» — Figma: Основная информация 260:12972 (Модель),
// 265:16499 (Фотограф), 265:17127 (Видеограф) · Опыт участия в проектах
// 264:13381 · Портфолио 265:13865 · На модерации 265:14317.
// Mobil: 415:18018 · 418:15080 · 418:15353 · 434:15737.
//
// To'rt qadam. Birinchi qadamda ijrochi turi tanlanadi va uchinchi bo'lim
// (Параметры / Информация) shunga qarab almashadi.
// ─────────────────────────────────────────────────────────────────────────────

const TYPES = [
    { value: 'model', label: 'Модель' },
    { value: 'photographer', label: 'Фотограф' },
    { value: 'videographer', label: 'Видеограф' },
]

const STEPS = ['Основная информация', 'Опыт участия в проектах', 'Портфолио', 'На модерации']

// ── Tanlov ro'yxatlari (Figma 260:13066…260:13246) ──────────────────────────

// Sonli diapazon: 170 → «170 см».
function range(from, to, unit) {
    return Array.from({ length: to - from + 1 }, (_, i) => {
        const value = `${from + i} ${unit}`
        return { value, label: value }
    })
}

function withPlaceholder(placeholder, options) {
    return [{ value: '', label: placeholder }, ...options]
}

const YES_NO = [
    { value: 'yes', label: 'Да' },
    { value: 'no', label: 'Нет' },
]

const HAS_NOT = [
    { value: 'yes', label: 'Есть' },
    { value: 'no', label: 'Нет' },
]

const CLOTHES = withPlaceholder(
    'Выберите размер',
    ['XS (40)', 'S (42)', 'M (44)', 'L (46)', 'XL (48)'].map((v) => ({ value: v, label: v })),
)

const SHOES = withPlaceholder(
    'Выберите размер',
    range(34, 45, '').map((o) => ({ value: o.value.trim(), label: o.label.trim() })),
)

const HAIR = withPlaceholder(
    'Выберите цвет волос',
    ['Блонд', 'Русый', 'Тёмно-русый', 'Шатен', 'Брюнет', 'Рыжий'].map((v) => ({
        value: v,
        label: v,
    })),
)

const EYES = withPlaceholder(
    'Выберите цвет глаз',
    ['Голубые', 'Зелёные', 'Карие', 'Серые', 'Чёрные'].map((v) => ({ value: v, label: v })),
)

// ── «Опыт работы» maydonlari tur bo'yicha (260:13032 / 265:16600 / 265:17228) ─
const EXPERIENCE_FIELDS = {
    model: ['Лет опыта', 'Количество съёмок', 'Количество брендов', 'Количество проектов'],
    photographer: ['Лет опыта', 'Количество съёмок', 'Количество брендов', 'Количество проектов'],
    videographer: ['Лет опыта', 'Количество кейсов', 'Количество брендов', 'Количество видеороликов'],
}

// ── «Информация» maydonlari — фотограф va видеограф uchun ────────────────────
const INFO_SELECTS = {
    photographer: [
        ['Обработка фотографий', YES_NO],
        ['Срочная обработка', YES_NO],
        ['Работа по договору', YES_NO],
        ['Загранпаспорт', HAS_NOT],
    ],
    videographer: [
        ['Монтаж видео', YES_NO],
        ['Цветокоррекция', YES_NO],
        ['Съёмка с дрона', YES_NO],
        ['Работа по договору', YES_NO],
        ['Загранпаспорт', HAS_NOT],
    ],
}

// `initialStep` / `initialType` — manzildagi `?step=` va `?type=` orqali
// Figma'dagi qadamlarni to'g'ridan-to'g'ri ochish uchun.
//
// Matn parametrlari «Агентство» kabinetidagi «Добавить исполнителя»
// (Figma 270:21262) uchun — u yerda forma o'zi aynan shu, faqat sarlavha,
// izoh, yo'lakcha va «О себе» to'ldiruvchisi boshqacha.
export default function ExecutorQuestionnaireForm({
    initialStep = 0,
    initialType = 'model',
    // Endpoint to'plami — o'z anketasi yoki agentlikning «Добавить исполнителя».
    actions = performerActions,
    // Agentlik anketa qo'shganda backend email yoki telefon talab qiladi
    // (POST /agency/performers → 409 «Укажите email или телефон»). Figma'da
    // bu maydonlar chizilmagan, shuning uchun faqat shu oqimda ko'rsatiladi.
    contactFields = false,
    // Yakunlangach qayerga o'tish.
    doneHref = '/executor/dashboard',
    // Boshlang'ich qiymatlar (kabinetdan yuklangan anketa).
    initialValues = null,
    title = 'Заполнить профиль',
    description = 'Заполните основную информацию о себе. После отправки профиль пройдет модерацию и станет доступен заказчикам в каталоге исполнителей.',
    aboutPlaceholder = 'Расскажите о себе, опыте работы и направлениях, в которых вы снимаетесь.',
    breadcrumb,
    resultTitle = 'Анкета успешно отправлена на модерацию',
    resultText = 'Мы проверим данные и портфолио.\nПосле одобрения профиль появится в каталоге исполнителей.',
    doneLabel = 'Перейти в личный кабинет',
}) {
    const router = useRouter()

    const [step, setStep] = useState(initialStep)
    const [type, setType] = useState(initialValues?.type || initialType)
    const [saving, setSaving] = useState(false)

    const [form, setForm] = useState(() => ({
        firstName: '',
        lastName: '',
        city: '',
        about: '',
        directions: [],
        height: '',
        weight: '',
        chest: '',
        waist: '',
        hips: '',
        clothes: '',
        shoes: '',
        hair: '',
        eyes: '',
        passport: '',
        travel: '',
        specialization: '',
        email: '',
        phone: '',
        ...(initialValues?.form || {}),
    }))
    const [experience, setExperience] = useState(
        () => initialValues?.experience || ['', '', '', ''],
    )
    // Фотограф / видеограф «Информация» bo'limidagi tanlovlar — nomi bo'yicha.
    const [info, setInfo] = useState(() => initialValues?.info || {})
    const [prices, setPrices] = useState(() => initialValues?.prices || [{ kind: '', value: '' }])
    const [projects, setProjects] = useState(
        () =>
            initialValues?.projects || [
                { year: '', title: '', brand: '', role: '' },
                { year: '', title: '', brand: '', role: '' },
            ],
    )
    // Surat elementi: { file, preview } — yangi tanlangan, yoki { url } — server.
    const [mainPhoto, setMainPhoto] = useState(() => initialValues?.mainPhoto || null)
    const [albums, setAlbums] = useState(() => initialValues?.albums || [{ name: '', photos: [] }])

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    // ── Saqlash ─────────────────────────────────────────────────────────────

    // Har qadamda o'z endpointi chaqiriladi (backend/performer.md).
    async function saveStep(asDraft) {
        setSaving(true)
        try {
            if (step === 0) {
                await actions.saveProfile(
                    profileBody({ type, form, experience, info, prices }),
                    asDraft,
                )
            } else if (step === 1) {
                await actions.saveExperience(experienceItems(projects))
            } else if (step === 2) {
                await savePortfolio()
                await actions.submit()
            }
            return true
        } catch (err) {
            toast.error(err?.api?.message || 'Не удалось сохранить')
            return false
        } finally {
            setSaving(false)
        }
    }

    // Yangi tanlangan fayllar yuklanadi; serverda turganlari o'tkazib yuboriladi.
    async function savePortfolio() {
        if (mainPhoto?.file) {
            const uploaded = await actions.upload(mainPhoto.file)
            await actions.setPhoto(uploaded.url)
        }
        for (const album of albums) {
            for (const photo of album.photos) {
                if (!photo?.file) continue
                const uploaded = await actions.upload(photo.file)
                await actions.addPhoto(uploaded.url, album.name?.trim() || undefined)
            }
        }
    }

    async function next() {
        if (sent) {
            router.push(doneHref)
            return
        }
        const ok = await saveStep(false)
        if (ok) setStep((s) => Math.min(3, s + 1))
    }

    async function saveDraft() {
        const ok = await saveStep(true)
        if (ok) toast.success('Сохранено в черновик')
    }

    // Fayl tanlash — brauzerda darhol ko'rsatish uchun `preview` yasaladi.
    function pickFiles(files, apply) {
        const list = Array.from(files || []).map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }))
        if (list.length) apply(list)
    }

    // `info` — тур bo'yicha uchinchi bo'lim: модель uchun «Параметры»,
    // qolganlari uchun «Информация» (Figma 265:16600 / 265:17228).
    const infoSelects = INFO_SELECTS[type]
    const sent = step === 3

    return (
        <Container>
            <div className="flex flex-col gap-[16px] py-[16px] lg:gap-[24px] lg:py-[24px]">
                <CabinetBreadcrumb
                    items={
                        breadcrumb || [
                            { label: 'Главная', href: '/' },
                            { label: 'Личный кабинет', href: '/executor/dashboard' },
                            { label: title },
                        ]
                    }
                />

                <AdminFormLayout
                    aside={
                        <AdminFormSteps
                            title="Создание профиля"
                            steps={STEPS}
                            current={step}
                            onSubmit={next}
                            submitLabel={saving ? 'Сохраняем…' : sent ? doneLabel : 'Далее'}
                            secondary={sent ? null : { label: 'В черновик', onClick: saveDraft }}
                            tertiary={
                                step === 1 || step === 2
                                    ? { label: 'Назад', onClick: () => setStep(step - 1) }
                                    : null
                            }
                        />
                    }
                >
                    {sent ? (
                        <CabinetResult
                            image="/img/executor/questionnaire/moderation.png"
                            title={resultTitle}
                            text={resultText}
                        />
                    ) : (
                        <AdminFormHeader title={title} description={description} />
                    )}

                    {step === 0 && (
                        <>
                            <AdminFormSection step={1} title="Основная информация">
                                <AdminFormTabs tabs={TYPES} value={type} onChange={setType} />

                                <AdminFieldGroup>
                                    <AdminFieldRow>
                                        <AdminField label="Имя">
                                            <AdminInput
                                                value={form.firstName}
                                                onChange={(e) => set('firstName', e.target.value)}
                                                placeholder="Введите имя"
                                            />
                                        </AdminField>
                                        <AdminField label="Фамилия">
                                            <AdminInput
                                                value={form.lastName}
                                                onChange={(e) => set('lastName', e.target.value)}
                                                placeholder="Введите фамилию"
                                            />
                                        </AdminField>
                                    </AdminFieldRow>

                                    <AdminField label="Город">
                                        <AdminInput
                                            value={form.city}
                                            onChange={(e) => set('city', e.target.value)}
                                            placeholder="Введите город"
                                        />
                                    </AdminField>

                                    <AdminField label="О себе">
                                        <AdminTextarea
                                            value={form.about}
                                            onChange={(e) => set('about', e.target.value)}
                                            max={1000}
                                            placeholder={aboutPlaceholder}
                                        />
                                    </AdminField>

                                    <AdminField
                                        label="Направления работы"
                                        hint="Добавьте до 5 направлений, в которых вы работаете"
                                    >
                                        <AdminTagInput
                                            tags={form.directions}
                                            onChange={(tags) => set('directions', tags)}
                                            placeholder="Введите направление и нажмите Enter"
                                        />
                                    </AdminField>

                                    {contactFields && (
                                        <AdminFieldRow>
                                            <AdminField
                                                label="Электронная почта"
                                                hint="Нужна для входа исполнителя в кабинет"
                                            >
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
                                                    placeholder="+ 7 (000)-000-00-00"
                                                />
                                            </AdminField>
                                        </AdminFieldRow>
                                    )}
                                </AdminFieldGroup>
                            </AdminFormSection>

                            <AdminFormSection step={2} title="Опыт работы">
                                <AdminFieldGroup>
                                    {[0, 2].map((offset) => (
                                        <AdminFieldRow key={offset}>
                                            {[offset, offset + 1].map((i) => (
                                                <AdminField
                                                    key={i}
                                                    label={EXPERIENCE_FIELDS[type][i]}
                                                >
                                                    <AdminInput
                                                        value={experience[i]}
                                                        onChange={(e) =>
                                                            setExperience((list) =>
                                                                list.map((v, j) =>
                                                                    j === i ? e.target.value : v,
                                                                ),
                                                            )
                                                        }
                                                        placeholder="Например: 4"
                                                    />
                                                </AdminField>
                                            ))}
                                        </AdminFieldRow>
                                    ))}
                                </AdminFieldGroup>
                            </AdminFormSection>

                            <AdminFormSection
                                step={3}
                                title={type === 'model' ? 'Параметры' : 'Информация'}
                            >
                                <AdminFieldGroup>
                                    {type === 'model' ? (
                                        <>
                                            <AdminFieldRow>
                                                <AdminField label="Рост">
                                                    <AdminFormSelect
                                                        value={form.height}
                                                        onChange={(e) =>
                                                            set('height', e.target.value)
                                                        }
                                                        options={range(150, 200, 'см')}
                                                    />
                                                </AdminField>
                                                <AdminField label="Вес">
                                                    <AdminFormSelect
                                                        value={form.weight}
                                                        onChange={(e) =>
                                                            set('weight', e.target.value)
                                                        }
                                                        options={range(40, 100, 'кг')}
                                                    />
                                                </AdminField>
                                            </AdminFieldRow>
                                            <AdminFieldRow>
                                                <AdminField label="Грудь">
                                                    <AdminFormSelect
                                                        value={form.chest}
                                                        onChange={(e) =>
                                                            set('chest', e.target.value)
                                                        }
                                                        options={range(70, 120, 'см')}
                                                    />
                                                </AdminField>
                                                <AdminField label="Талия">
                                                    <AdminFormSelect
                                                        value={form.waist}
                                                        onChange={(e) =>
                                                            set('waist', e.target.value)
                                                        }
                                                        options={range(50, 100, 'см')}
                                                    />
                                                </AdminField>
                                            </AdminFieldRow>
                                            <AdminFieldRow>
                                                <AdminField label="Бёдра">
                                                    <AdminFormSelect
                                                        value={form.hips}
                                                        onChange={(e) => set('hips', e.target.value)}
                                                        options={range(70, 120, 'см')}
                                                    />
                                                </AdminField>
                                                <AdminField label="Размер одежды">
                                                    <AdminFormSelect
                                                        value={form.clothes}
                                                        onChange={(e) =>
                                                            set('clothes', e.target.value)
                                                        }
                                                        options={CLOTHES}
                                                    />
                                                </AdminField>
                                            </AdminFieldRow>
                                            <AdminFieldRow>
                                                <AdminField label="Размер обуви">
                                                    <AdminFormSelect
                                                        value={form.shoes}
                                                        onChange={(e) =>
                                                            set('shoes', e.target.value)
                                                        }
                                                        options={SHOES}
                                                    />
                                                </AdminField>
                                                <AdminField label="Цвет волос">
                                                    <AdminFormSelect
                                                        value={form.hair}
                                                        onChange={(e) => set('hair', e.target.value)}
                                                        options={HAIR}
                                                    />
                                                </AdminField>
                                            </AdminFieldRow>
                                            <AdminFieldRow>
                                                <AdminField label="Цвет глаз">
                                                    <AdminFormSelect
                                                        value={form.eyes}
                                                        onChange={(e) => set('eyes', e.target.value)}
                                                        options={EYES}
                                                    />
                                                </AdminField>
                                                <AdminField label="Загранпаспорт">
                                                    <AdminFormSelect
                                                        value={form.passport}
                                                        onChange={(e) =>
                                                            set('passport', e.target.value)
                                                        }
                                                        options={HAS_NOT}
                                                    />
                                                </AdminField>
                                            </AdminFieldRow>
                                            <AdminField label="Выезд в другие города">
                                                <AdminFormSelect
                                                    value={form.travel}
                                                    onChange={(e) => set('travel', e.target.value)}
                                                    options={YES_NO}
                                                />
                                            </AdminField>
                                        </>
                                    ) : (
                                        <>
                                            <AdminFieldRow>
                                                <AdminField label="Специализация">
                                                    <AdminInput
                                                        value={form.specialization}
                                                        onChange={(e) =>
                                                            set('specialization', e.target.value)
                                                        }
                                                        placeholder="Например: Fashion, Beauty"
                                                    />
                                                </AdminField>
                                                <AdminField label="Выезд в другие города">
                                                    <AdminFormSelect
                                                        value={form.travel}
                                                        onChange={(e) =>
                                                            set('travel', e.target.value)
                                                        }
                                                        options={YES_NO}
                                                    />
                                                </AdminField>
                                            </AdminFieldRow>

                                            {/* Qolgan maydonlar juft-juft joylashadi; toq
                                                bo'lsa oxirgisi bir o'zi qatorda qoladi. */}
                                            {infoSelects
                                                .filter((_, i) => i % 2 === 0)
                                                .map((_, pairIndex) => {
                                                    const pair = infoSelects.slice(
                                                        pairIndex * 2,
                                                        pairIndex * 2 + 2,
                                                    )
                                                    return (
                                                        <AdminFieldRow key={pairIndex}>
                                                            {pair.map(([label, options]) => (
                                                                <AdminField
                                                                    key={label}
                                                                    label={label}
                                                                    className={
                                                                        pair.length === 1
                                                                            ? 'lg:max-w-[calc(50%-8px)]'
                                                                            : ''
                                                                    }
                                                                >
                                                                    <AdminFormSelect
                                                                        value={
                                                                            info[label] ??
                                                                            options[0].value
                                                                        }
                                                                        onChange={(e) =>
                                                                            setInfo((v) => ({
                                                                                ...v,
                                                                                [label]:
                                                                                    e.target.value,
                                                                            }))
                                                                        }
                                                                        options={options}
                                                                    />
                                                                </AdminField>
                                                            ))}
                                                        </AdminFieldRow>
                                                    )
                                                })}
                                        </>
                                    )}
                                </AdminFieldGroup>
                            </AdminFormSection>

                            <AdminFormSection
                                step={4}
                                title="Стоимость"
                                description="Укажите форматы работы и стоимость услуг. Можно добавить несколько вариантов."
                            >
                                <AdminFieldGroup>
                                    {prices.map((price, i) => (
                                        <AdminFieldRow key={`price-${i}`}>
                                            <AdminField label="Тип услуги">
                                                <AdminInput
                                                    value={price.kind}
                                                    onChange={(e) =>
                                                        setPrices((list) =>
                                                            list.map((p, j) =>
                                                                j === i
                                                                    ? { ...p, kind: e.target.value }
                                                                    : p,
                                                            ),
                                                        )
                                                    }
                                                    placeholder="Например: Съёмка"
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
                                                                    : p,
                                                            ),
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
                        </>
                    )}

                    {step === 1 && (
                        <AdminFormSection step={5} title="Опыт участия в проектах">
                            <AdminFieldGroup>
                                {projects.map((project, i) => (
                                    <div
                                        key={`project-${i}`}
                                        className="flex flex-col gap-[12px] lg:gap-[16px]"
                                    >
                                        <div className="flex items-center justify-between gap-[12px]">
                                            <span className="text-[14px] font-medium text-black lg:text-[16px]">
                                                Проект {i + 1}
                                            </span>
                                            {i > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setProjects((list) =>
                                                            list.filter((_, j) => j !== i),
                                                        )
                                                    }
                                                    aria-label="Удалить проект"
                                                    className="cursor-pointer text-black transition-opacity hover:opacity-70"
                                                >
                                                    <X size={20} strokeWidth={2} />
                                                </button>
                                            )}
                                        </div>

                                        <AdminFieldRow>
                                            <ProjectField
                                                label="Год"
                                                placeholder="Например: 2026"
                                                value={project.year}
                                                onChange={(v) => setProject(setProjects, i, 'year', v)}
                                            />
                                            <ProjectField
                                                label="Название проекта"
                                                placeholder="Например: Каталог весенней коллекции"
                                                value={project.title}
                                                onChange={(v) =>
                                                    setProject(setProjects, i, 'title', v)
                                                }
                                            />
                                        </AdminFieldRow>
                                        <AdminFieldRow>
                                            <ProjectField
                                                label="Бренд / заказчик"
                                                placeholder="Например: LIME"
                                                value={project.brand}
                                                onChange={(v) =>
                                                    setProject(setProjects, i, 'brand', v)
                                                }
                                            />
                                            <ProjectField
                                                label="Роль"
                                                placeholder="Например: Модель каталога"
                                                value={project.role}
                                                onChange={(v) => setProject(setProjects, i, 'role', v)}
                                            />
                                        </AdminFieldRow>
                                    </div>
                                ))}

                                <AdminAddButton
                                    onClick={() =>
                                        setProjects((list) => [
                                            ...list,
                                            { year: '', title: '', brand: '', role: '' },
                                        ])
                                    }
                                >
                                    Добавить ещё проект
                                </AdminAddButton>
                            </AdminFieldGroup>
                        </AdminFormSection>
                    )}

                    {step === 2 && (
                        <AdminFormSection
                            step={6}
                            title="Портфолио"
                            description="Создайте отдельные альбомы для разных направлений работы, например: «Реклама», «Каталоги», «Показы» или «Клипы»."
                        >
                            <AdminFieldGroup>
                                <AdminField
                                    label="Главное фото профиля"
                                    hint="Эта фотография будет отображаться в каталоге исполнителей и на странице вашего профиля."
                                >
                                    <div className="flex flex-col items-start gap-[12px] lg:gap-[16px]">
                                        <span className="relative block size-[100px] overflow-hidden rounded-[6px] bg-light-white lg:size-[120px]">
                                            <Image
                                                src={
                                                    mainPhoto?.preview ||
                                                    mainPhoto?.url ||
                                                    PLACEHOLDER
                                                }
                                                alt=""
                                                fill
                                                sizes="120px"
                                                className="object-cover"
                                                unoptimized={Boolean(mainPhoto?.preview)}
                                            />
                                        </span>
                                        <UploadBox
                                            label="Изменить фотографию"
                                            onPick={(files) =>
                                                pickFiles(files, (list) => setMainPhoto(list[0]))
                                            }
                                        />
                                    </div>
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
                                                            list.filter((_, j) => j !== i),
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
                                                        j === i ? { ...a, name: e.target.value } : a,
                                                    ),
                                                )
                                            }
                                            placeholder="Например: Белый зал"
                                        />

                                        <UploadBox
                                            multiple
                                            onPick={(files) =>
                                                pickFiles(files, (list) =>
                                                    setAlbums((all) =>
                                                        all.map((a, j) =>
                                                            j === i
                                                                ? {
                                                                      ...a,
                                                                      photos: [...a.photos, ...list],
                                                                  }
                                                                : a,
                                                        ),
                                                    ),
                                                )
                                            }
                                        />

                                        {album.photos.length > 0 && (
                                            <div className="flex flex-wrap gap-[12px] lg:gap-[16px]">
                                                {album.photos.map((photo, j) => (
                                                    <span
                                                        key={`photo-${j}`}
                                                        className="relative block size-[64px] overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:size-[80px]"
                                                    >
                                                        <Image
                                                            src={photo.preview || photo.url}
                                                            alt=""
                                                            fill
                                                            sizes="80px"
                                                            className="object-cover"
                                                            unoptimized={Boolean(photo.preview)}
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
                                                                                          m !== j,
                                                                                  ),
                                                                              }
                                                                            : a,
                                                                    ),
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

// Loyihalar ro'yxatidagi bitta maydonni yangilash.
function setProject(setProjects, index, key, value) {
    setProjects((list) => list.map((p, i) => (i === index ? { ...p, [key]: value } : p)))
}

function ProjectField({ label, placeholder, value, onChange }) {
    return (
        <AdminField label={label}>
            <AdminInput
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </AdminField>
    )
}

// Fayl yuklash maydoni (Figma 265:13931).
// Fayllar darhol yuborilmaydi — «Далее» bosilganda birga yuklanadi.
function UploadBox({
    label = 'Нажмите для загрузки или перетащите файл сюда',
    multiple = false,
    onPick,
}) {
    return (
        <label className="flex cursor-pointer items-center gap-[12px] self-start rounded-[6px] bg-light-white px-[16px] py-[12px] text-[14px] font-medium text-grey transition-colors hover:text-black lg:px-[24px] lg:py-[16px] lg:text-[16px]">
            <input
                type="file"
                accept="image/*"
                multiple={multiple}
                className="hidden"
                onChange={(e) => {
                    const files = e.target.files
                    e.target.value = ''
                    onPick?.(files)
                }}
            />
            <Upload size={24} strokeWidth={2} className="shrink-0" />
            {label}
        </label>
    )
}
