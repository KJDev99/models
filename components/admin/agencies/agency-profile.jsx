'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Eye, LayoutGrid, List, Mail, MessageCircle, Phone, SquarePen } from 'lucide-react'
import { AdminBreadcrumb } from '@/components/admin/ui/admin-form'
import {
    AdminRowMenu,
    AdminSearch,
    AdminSelect,
    AdminStatus,
} from '@/components/admin/ui/admin-ui'
import AdminProfileModal, {
    ModalAvatar,
    ModalField,
    ModalInput,
    ModalTextarea,
} from '@/components/admin/ui/admin-profile-modal'
import { profileMenu, rowMenu } from '@/components/admin/ui/admin-menu-items'
import { RowActionModals } from '@/components/admin/ui/admin-modals'
import { USER_STATUS } from '@/components/admin/ui/admin-statuses'
import { AGENCY_PROFILE } from '@/components/admin/agencies/agencies-data'
import Button from '@/components/ui/button'

// ─────────────────────────────────────────────────────────────────────────────
// Agentlik profili — Figma «LUMEN AGENCY» 338:18370 / mobil 453:17040.
// Tepasida logotip va ma'lumot kartochkasi, ostida «Исполнители» bo'limi.
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminAgencyProfile({ profile = AGENCY_PROFILE }) {
    const router = useRouter()
    const [status, setStatus] = useState(profile.status)
    const [action, setAction] = useState(null)
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({
        name: profile.name,
        manager: profile.manager,
        field: profile.field,
        city: profile.city,
        about: profile.about,
        phone: profile.phone,
        email: profile.email,
    })

    const state = USER_STATUS[status] || USER_STATUS.active

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    return (
        <>
            <AdminBreadcrumb
                items={[
                    { label: 'Административная панель', href: '/admin/dashboard' },
                    { label: profile.name },
                ]}
            />

            <div className="flex flex-col gap-[24px] lg:gap-[50px]">
                <div className="flex flex-col gap-[16px] lg:flex-row lg:items-stretch">
                    <div className="relative h-[220px] overflow-hidden rounded-[6px] bg-white lg:h-auto lg:w-[554px] lg:shrink-0">
                        <Image
                            src={profile.logo}
                            alt={profile.name}
                            fill
                            sizes="554px"
                            className="object-contain p-[24px]"
                        />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
                        <div className="flex flex-col gap-[16px]">
                            <div className="flex flex-wrap items-center justify-between gap-[12px]">
                                <h1 className="text-[20px] font-medium text-black lg:text-[32px]">
                                    {profile.name}
                                </h1>
                                <div className="flex items-center gap-[12px] lg:gap-[16px]">
                                    <AdminStatus tone={state.tone} className="lg:w-[130px]">
                                        {state.label}
                                    </AdminStatus>
                                    <button
                                        type="button"
                                        onClick={() => setEditing(true)}
                                        aria-label="Редактировать профиль"
                                        className="flex size-[32px] cursor-pointer items-center justify-center rounded-[6px] ui-icon-btn p-[4px]"
                                    >
                                        <SquarePen size={24} strokeWidth={2} />
                                    </button>
                                    <span className="flex size-[32px] items-center justify-center rounded-[6px] ui-icon-btn p-[4px]">
                                        <AdminRowMenu compact
                                            items={profileMenu({
                                                status,
                                                onSettings: () => setEditing(true),
                                                onBlock: () =>
                                                    setAction({ type: 'block', row: profile }),
                                                onUnblock: () =>
                                                    setAction({ type: 'unblock', row: profile }),
                                                onDelete: () =>
                                                    setAction({ type: 'delete', row: profile }),
                                            })}
                                        />
                                    </span>
                                </div>
                            </div>

                            <p className="flex flex-wrap items-center gap-[10px] text-[14px] font-medium text-grey lg:text-[16px]">
                                {profile.field}
                                <span aria-hidden className="size-[3px] rounded-full bg-grey" />
                                {profile.city}
                            </p>
                        </div>

                        <div className="flex flex-col gap-[16px]">
                            <h2 className="text-[16px] font-bold text-black lg:text-[18px]">
                                О агентстве
                            </h2>
                            <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                                {profile.about}
                            </p>
                        </div>

                        <div className="flex flex-col gap-[16px]">
                            <h2 className="text-[16px] font-bold text-black lg:text-[18px]">
                                Контакты
                            </h2>
                            <div className="flex flex-wrap gap-[16px] text-[14px] font-medium text-grey lg:gap-[24px] lg:text-[16px]">
                                <a
                                    href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}
                                    className="flex items-center gap-[8px] transition-colors hover:text-black"
                                >
                                    <Phone size={24} strokeWidth={2} />
                                    {profile.phone}
                                </a>
                                <a
                                    href={`mailto:${profile.email}`}
                                    className="flex items-center gap-[8px] transition-colors hover:text-black"
                                >
                                    <Mail size={24} strokeWidth={2} />
                                    {profile.email}
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4 lg:gap-[16px]">
                            {profile.stats.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex flex-col gap-[12px] rounded-[6px] bg-light-white p-[16px] text-black lg:gap-[16px]"
                                >
                                    <span className="font-display text-[24px] uppercase lg:text-[32px]">
                                        {item.value}
                                    </span>
                                    <span className="text-[12px] lg:text-[14px]">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                            href={`/admin/agencies/${profile.id}/executors/new`}
                            variant="gold"
                            size="lg"
                            full
                            className="mt-auto"
                        >
                            Добавить исполнителя
                        </Button>
                    </div>
                </div>

                <AgencyExecutors
                    profile={profile}
                    onAction={setAction}
                    onEdit={(item) =>
                        router.push(`/admin/agencies/${profile.id}/executors/${item.id}`)
                    }
                />
            </div>

            <AdminProfileModal
                open={editing}
                onClose={() => setEditing(false)}
                sections={{
                    info: (
                        <>
                            <ModalAvatar src={profile.logo} />
                            <ModalField label="Название агентства">
                                <ModalInput
                                    value={form.name}
                                    onChange={(e) => set('name', e.target.value)}
                                />
                            </ModalField>
                            <ModalField
                                label="Имя представителя"
                                hint="Имя представителя видно только администрации и используется для связи с агентством."
                            >
                                <ModalInput
                                    value={form.manager}
                                    onChange={(e) => set('manager', e.target.value)}
                                />
                            </ModalField>
                            <ModalField label="Сфера деятельности">
                                <ModalInput
                                    value={form.field}
                                    onChange={(e) => set('field', e.target.value)}
                                />
                            </ModalField>
                            <ModalField label="Город">
                                <ModalInput
                                    value={form.city}
                                    onChange={(e) => set('city', e.target.value)}
                                />
                            </ModalField>
                            <ModalField label="О компании">
                                <ModalTextarea
                                    value={form.about}
                                    onChange={(e) => set('about', e.target.value)}
                                />
                            </ModalField>
                        </>
                    ),
                    contacts: (
                        <>
                            <ModalField label="Телефон">
                                <ModalInput
                                    value={form.phone}
                                    onChange={(e) => set('phone', e.target.value)}
                                />
                            </ModalField>
                            <ModalField label="Электронная почта">
                                <ModalInput
                                    value={form.email}
                                    onChange={(e) => set('email', e.target.value)}
                                />
                            </ModalField>
                        </>
                    ),
                    security: (
                        <>
                            <ModalField label="Текущий пароль">
                                <ModalInput type="password" placeholder="Введите пароль" />
                            </ModalField>
                            <ModalField label="Новый пароль">
                                <ModalInput type="password" placeholder="Введите новый пароль" />
                            </ModalField>
                        </>
                    ),
                    delete: (
                        <ModalField
                            label="Удаление аккаунта"
                            hint="Агентство и все его исполнители будут удалены без возможности восстановления."
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setEditing(false)
                                    setAction({ type: 'delete', row: profile })
                                }}
                                className="cursor-pointer self-start rounded-[6px] bg-[#fdecec] px-[24px] py-[12px] text-[14px] font-medium text-[#d14343] transition-colors hover:bg-[#fbdcdc] lg:py-[16px] lg:text-[16px]"
                            >
                                Удалить агентство
                            </button>
                        </ModalField>
                    ),
                }}
            />

            <RowActionModals
                action={action}
                onClose={() => setAction(null)}
                onBlock={() => setStatus('blocked')}
                onUnblock={() => setStatus('active')}
                onDelete={() => router.push('/admin/agencies')}
            />
        </>
    )
}

// «Исполнители» bo'limi — Figma 338:18416.
function AgencyExecutors({ profile, onAction, onEdit }) {
    const [tab, setTab] = useState('all')
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('')
    const [view, setView] = useState('grid')
    const [shown, setShown] = useState(8)

    const list = useMemo(() => {
        const q = query.trim().toLowerCase()
        return profile.executors.filter((item) => {
            if (tab !== 'all' && item.kind !== tab) return false
            if (status && item.status !== status) return false
            if (!q) return true
            return item.name.toLowerCase().includes(q)
        })
    }, [profile.executors, tab, query, status])

    return (
        <section className="flex flex-col gap-[16px] lg:gap-[24px]">
            <h2 className="font-display text-[24px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:tracking-[0.64px]">
                Исполнители
            </h2>

            <div className="flex flex-col gap-[12px] lg:flex-row lg:items-center lg:gap-[16px]">
                <AdminSearch
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Имя / ключевые слова"
                    variant="white"
                />
                <AdminSelect
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    options={[
                        { value: '', label: 'Все статусы' },
                        { value: 'active', label: 'Активен' },
                        { value: 'paused', label: 'На паузе' },
                        { value: 'blocked', label: 'Заблокирован' },
                    ]}
                    variant="white"
                    className="lg:w-[227px] lg:shrink-0"
                />
                <div className="hidden gap-[16px] rounded-[8px] bg-white p-[16px] lg:flex">
                    {[
                        { key: 'grid', icon: LayoutGrid, label: 'Сеткой' },
                        { key: 'list', icon: List, label: 'Списком' },
                    ].map((item) => {
                        const Icon = item.icon
                        return (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => setView(item.key)}
                                aria-label={item.label}
                                aria-pressed={view === item.key}
                                className={`cursor-pointer transition-colors ${
                                    view === item.key ? 'text-gold' : 'text-black'
                                }`}
                            >
                                <Icon size={24} strokeWidth={2} />
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="flex flex-wrap gap-[12px] lg:gap-[16px]">
                {profile.executorTabs.map((item) => {
                    const on = item.key === tab
                    return (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => setTab(item.key)}
                            className={`flex cursor-pointer items-center gap-[8px] rounded-[6px] px-[16px] py-[12px] text-[14px] font-medium transition-colors lg:gap-[12px] lg:p-[16px] lg:text-[16px] ${
                                on ? 'bg-gold text-white' : 'border border-gold text-gold hover:bg-gold/10'
                            }`}
                        >
                            {item.label}
                            <span>({item.count})</span>
                        </button>
                    )
                })}
            </div>

            {list.length === 0 ? (
                <p className="py-[24px] text-center text-[14px] text-grey lg:text-[16px]">
                    Ничего не найдено
                </p>
            ) : (
                <div
                    className={
                        view === 'grid'
                            ? 'grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-[16px]'
                            : 'flex flex-col gap-[12px] lg:gap-[16px]'
                    }
                >
                    {list.slice(0, shown).map((item) => (
                        <ExecutorCard
                            key={item.id}
                            item={item}
                            view={view}
                            onEdit={() => onEdit(item)}
                            onAction={onAction}
                        />
                    ))}
                </div>
            )}

            {shown < list.length && (
                <button
                    type="button"
                    onClick={() => setShown(shown + 8)}
                    className="w-full cursor-pointer self-center rounded-[6px] border border-gold p-[16px] text-[14px] font-medium text-gold transition-colors hover:bg-gold/10 lg:w-[200px] lg:text-[16px]"
                >
                    Показать еще
                </button>
            )}
        </section>
    )
}

function ExecutorCard({ item, view, onEdit, onAction }) {
    const state = USER_STATUS[item.status]
    const menu = rowMenu({
        status: item.status,
        onEdit,
        onToggle: () => {},
        onBlock: () => onAction({ type: 'block', row: item }),
        onUnblock: () => onAction({ type: 'unblock', row: item }),
        onDelete: () => onAction({ type: 'delete', row: item }),
    })

    if (view === 'list') {
        return (
            <article className="flex items-center gap-[12px] rounded-[6px] bg-white p-[12px] lg:gap-[16px] lg:p-[16px]">
                <span className="relative block size-[64px] shrink-0 overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:size-[80px]">
                    <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
                    <p className="text-[14px] font-medium text-black lg:text-[16px]">{item.name}</p>
                    <p className="text-[12px] text-grey lg:text-[14px]">
                        {item.type} · {item.chips.join(' · ')}
                    </p>
                </div>
                <AdminStatus tone={state.tone} className="lg:w-[133px]">
                    {state.label}
                </AdminStatus>
                <button
                    type="button"
                    onClick={onEdit}
                    aria-label="Редактировать"
                    className="flex size-[32px] cursor-pointer items-center justify-center rounded-[6px] ui-icon-btn p-[4px]"
                >
                    <SquarePen size={24} strokeWidth={2} />
                </button>
                <span className="flex size-[32px] items-center justify-center rounded-[6px] ui-icon-btn p-[4px]">
                    <AdminRowMenu compact items={menu} />
                </span>
            </article>
        )
    }

    return (
        <article className="relative flex h-[350px] w-full flex-col justify-between overflow-hidden rounded-[6px] bg-[#d9d9d9] p-[12px] lg:h-[400px] lg:p-[16px]">
            <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 1024px) 100vw, 323px"
                className="object-cover"
            />
            <span className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_55.222%,rgba(0,0,0,0.8)_88.889%)]" />

            <div className="relative flex items-start justify-between gap-[8px]">
                <span className="rounded-[6px] bg-black/25 px-[12px] py-[8px] text-[12px] font-medium text-white backdrop-blur-[2.5px] lg:text-[14px]">
                    {item.type}
                </span>
                <span className="flex items-center gap-[8px]">
                    <button
                        type="button"
                        onClick={onEdit}
                        aria-label="Редактировать"
                        className="flex size-[32px] cursor-pointer items-center justify-center rounded-[6px] bg-black/30 p-[4px] text-white transition-colors hover:bg-black/45"
                    >
                        <SquarePen size={24} strokeWidth={2} />
                    </button>
                    <span className="flex size-[32px] items-center justify-center rounded-[6px] bg-black/30 p-[4px] text-white">
                        <AdminRowMenu compact items={menu} />
                    </span>
                </span>
            </div>

            <div className="relative flex flex-col gap-[12px]">
                <p className="text-[14px] font-medium text-white lg:text-[16px]">{item.name}</p>
                <div className="flex flex-wrap gap-[8px]">
                    {item.chips.map((chip) => (
                        <span
                            key={chip}
                            className="rounded-[6px] bg-black/25 px-[12px] py-[8px] text-[12px] font-medium text-white backdrop-blur-[2.5px] lg:text-[14px]"
                        >
                            {chip}
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-[10px]">
                    <AdminStatus tone={state.tone} className="min-w-0 flex-1">
                        {state.label}
                    </AdminStatus>
                    <span className="flex items-center gap-[16px] text-[12px] text-white lg:text-[14px]">
                        <span className="flex items-center gap-[8px]">
                            <MessageCircle size={20} strokeWidth={2} />
                            {item.comments}
                        </span>
                        <span className="flex items-center gap-[8px]">
                            <Eye size={20} strokeWidth={2} />
                            {item.views}
                        </span>
                    </span>
                </div>
            </div>
        </article>
    )
}
