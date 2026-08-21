'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Globe, Image as ImageIcon, Mail, Phone, SquarePen } from 'lucide-react'
import { AdminBreadcrumb } from '@/components/admin/ui/admin-form'
import { AdminRowMenu, AdminStatus } from '@/components/admin/ui/admin-ui'
import AdminPublications from '@/components/admin/ui/admin-publications'
import AdminProfileModal, {
    ModalAvatar,
    ModalField,
    ModalInput,
    ModalSelect,
    ModalTextarea,
} from '@/components/admin/ui/admin-profile-modal'
import { profileMenu, rowMenu } from '@/components/admin/ui/admin-menu-items'
import { RowActionModals } from '@/components/admin/ui/admin-modals'
import { USER_STATUS } from '@/components/admin/ui/admin-statuses'
// `profile` — `adminCustomerProfile()` adapteri natijasi (lib/adapters.js).
import Button from '@/components/ui/button'

// ─────────────────────────────────────────────────────────────────────────────
// Zakazchik profili — Figma «Профиль компании - проекты» 338:16465 va
// «Пустой профиль» 338:16778. Tahrirlash oynasi — 338:17056 / 338:18303.
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminClientProfile({
    profile,
    onSave,
    onBlock,
    onUnblock,
    onDelete,
    onPublicationAction,
}) {
    const router = useRouter()
    const [action, setAction] = useState(null)
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState(() => ({
        type: profile.type === 'Компания' ? 'company' : 'person',
        name: profile.name || '',
        field: profile.field || '',
        city: profile.city || '',
        about: profile.about || '',
        phone: profile.phone || '',
        email: profile.email || '',
        site: profile.site || '',
    }))

    const status = profile.status
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
                    {/* Logotip (Figma 338:16475) */}
                    <div className="relative flex h-[220px] items-center justify-center overflow-hidden rounded-[6px] bg-white lg:h-auto lg:w-[554px] lg:shrink-0">
                        {profile.logo ? (
                            <Image
                                src={profile.logo}
                                alt={profile.name}
                                fill
                                sizes="554px"
                                className="object-contain p-[24px]"
                            />
                        ) : (
                            <span className="flex size-full items-center justify-center bg-[#d9d9d9] text-[#b0b0b0]">
                                <ImageIcon size={96} strokeWidth={1.2} />
                            </span>
                        )}
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
                                {profile.field && (
                                    <span aria-hidden className="size-[3px] rounded-full bg-grey" />
                                )}
                                {profile.city}
                            </p>
                        </div>

                        <div className="flex flex-col gap-[16px]">
                            <h2 className="text-[16px] font-bold text-black lg:text-[18px]">
                                О компании
                            </h2>
                            <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                                {profile.about || 'Информация о компании пока не заполнена'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-[16px]">
                            <h2 className="text-[16px] font-bold text-black lg:text-[18px]">
                                Контакты
                            </h2>
                            {profile.phone || profile.email || profile.site ? (
                                <div className="flex flex-wrap gap-[16px] text-[14px] font-medium text-grey lg:gap-[24px] lg:text-[16px]">
                                    {profile.phone && (
                                        <a
                                            href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}
                                            className="flex items-center gap-[8px] transition-colors hover:text-black"
                                        >
                                            <Phone size={24} strokeWidth={2} />
                                            {profile.phone}
                                        </a>
                                    )}
                                    {profile.email && (
                                        <a
                                            href={`mailto:${profile.email}`}
                                            className="flex items-center gap-[8px] transition-colors hover:text-black"
                                        >
                                            <Mail size={24} strokeWidth={2} />
                                            {profile.email}
                                        </a>
                                    )}
                                    {profile.site && (
                                        <a
                                            href={`https://${profile.site}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-[8px] transition-colors hover:text-black"
                                        >
                                            <Globe size={24} strokeWidth={2} />
                                            {profile.site}
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <p className="text-[14px] text-grey lg:text-[16px]">
                                    Контакты не добавлены
                                </p>
                            )}
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

                        <div className="mt-auto flex flex-col gap-[16px] sm:flex-row">
                            <Button
                                href="/admin/projects/new"
                                variant="gold"
                                size="lg"
                                className="flex-1"
                            >
                                Разместить проект
                            </Button>
                            <Button
                                href="/admin/venues/new"
                                variant="goldStroke"
                                size="lg"
                                className="flex-1"
                            >
                                Добавить площадку
                            </Button>
                        </div>
                    </div>
                </div>

                <AdminPublications
                    tabs={profile.publicationTabs}
                    items={profile.publications}
                    emptyTitle="Пока нет публикаций"
                    emptyText="Разместите первый проект или добавьте площадку — после публикации они появятся здесь."
                    menuItems={(item) =>
                        rowMenu({
                            status: item.status,
                            onEdit: () => router.push(item.editHref),
                            onToggle: () => onPublicationAction?.('toggle', item),
                            onBlock: () => onPublicationAction?.('pause', item),
                            onUnblock: () => onPublicationAction?.('resume', item),
                            onDelete: () => onPublicationAction?.('delete', item),
                        })
                    }
                />
            </div>

            {editing && (
            <AdminProfileModal
                open
                onClose={() => setEditing(false)}
                sections={{
                    info: (
                        <>
                            <ModalAvatar src={profile.logo} />
                            <ModalField label="Тип аккаунта">
                                <ModalSelect
                                    value={form.type}
                                    onChange={(e) => set('type', e.target.value)}
                                    options={[
                                        { value: 'person', label: 'Частное лицо' },
                                        { value: 'company', label: 'Компания' },
                                    ]}
                                />
                            </ModalField>
                            <ModalField label="Название">
                                <ModalInput
                                    value={form.name}
                                    onChange={(e) => set('name', e.target.value)}
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
                                    placeholder="+ 7 (000)-000-00-00"
                                />
                            </ModalField>
                            <ModalField label="Электронная почта">
                                <ModalInput
                                    value={form.email}
                                    onChange={(e) => set('email', e.target.value)}
                                    placeholder="Введите почту"
                                />
                            </ModalField>
                            <ModalField label="Сайт">
                                <ModalInput
                                    value={form.site}
                                    onChange={(e) => set('site', e.target.value)}
                                    placeholder="lime.ru"
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
                            <ModalField label="Повторите новый пароль">
                                <ModalInput type="password" placeholder="Повторите пароль" />
                            </ModalField>
                        </>
                    ),
                    delete: (
                        <ModalField
                            label="Удаление аккаунта"
                            hint="Аккаунт и все связанные с ним публикации будут удалены без возможности восстановления."
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setEditing(false)
                                    setAction({ type: 'delete', row: profile })
                                }}
                                className="cursor-pointer self-start rounded-[6px] bg-[#fdecec] px-[24px] py-[12px] text-[14px] font-medium text-[#d14343] transition-colors hover:bg-[#fbdcdc] lg:py-[16px] lg:text-[16px]"
                            >
                                Удалить аккаунт
                            </button>
                        </ModalField>
                    ),
                }}
                onSave={async () => {
                    await onSave?.(form)
                    setEditing(false)
                }}
            />
            )}

            <RowActionModals
                action={action}
                onClose={() => setAction(null)}
                onBlock={onBlock}
                onUnblock={onUnblock}
                onDelete={onDelete}
            />
        </>
    )
}
