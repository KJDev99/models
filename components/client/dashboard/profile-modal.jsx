'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AdminProfileModal, {
    ModalAvatar,
    ModalField,
    ModalInput,
    ModalSelect,
    ModalTextarea,
} from '@/components/admin/ui/admin-profile-modal'
import Button from '@/components/ui/button'
import { CabinetSecurityRow } from '@/components/shared/cabinet/cabinet-ui'
import { useSecurityNote } from '@/components/shared/cabinet/use-security-info'
import { Lock, Mail, Phone } from 'lucide-react'
import {
    DeleteAccountModal,
    EmailModal,
    PasswordModal,
    PhoneModal,
} from '@/components/client/dashboard/security-modals'
import { useAction } from '@/lib/use-api'
import * as customerApi from '@/lib/api/customer'
import * as site from '@/lib/api/site'
import { useAuthStore } from '@/store/useAuthStore'
import { ROLES } from '@/lib/roles'

// ─────────────────────────────────────────────────────────────────────────────
// «Редактировать профиль» — Figma «Заказчик» 320:8226 (1200×810).
// Oyna karkasi adminkadagi bilan bitta komponent (338:18303), faqat
// maydonlar заказчик uchun: тип аккаунта, имя/фамилия, город, о компании.
//
// Saqlash (backend/customer.md):
//   Информация → PATCH /customer/profile/info
//   Контакты   → PATCH /customer/profile/contacts
//   Фото       → POST  /site/upload → POST /customer/profile/photo
// ─────────────────────────────────────────────────────────────────────────────

const ACCOUNT_TYPES = [
    { value: 'individual', label: 'Частное лицо' },
    { value: 'company', label: 'Компания' },
]

// «Безопасность» bo'limidagi qatorlar (Figma 260:6989).
const SECURITY_ROWS = [
    { key: 'password', title: 'Пароль', icon: Lock },
    { key: 'email', title: 'Электронная почта', icon: Mail },
    { key: 'phone', title: 'Телефон', icon: Phone },
]

// Backend profilidan forma holatini yasaydi. «Информация … пока не заполнена» —
// bo'sh profil uchun ko'rsatiladigan matn, uni maydonga tushirmaymiz.
const ABOUT_PLACEHOLDER = 'Информация о компании пока не заполнена'

function fromProfile(profile) {
    return {
        customerType: profile?.customerType || 'individual',
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        companyName: profile?.companyName || '',
        field: profile?.field || '',
        representative: profile?.representative || '',
        inn: profile?.inn || '',
        city: profile?.city || '',
        about: profile?.about === ABOUT_PLACEHOLDER ? '' : profile?.about || '',
        logo: profile?.logo || null,
        phone: profile?.phone || '',
        site: profile?.site || '',
    }
}

export default function ClientProfileModal({ open, onClose, profile, onSaved }) {
    const router = useRouter()
    const logout = useAuthStore((s) => s.logout)

    // Forma boshlang'ich qiymatlari mount paytida olinadi — oyna faqat
    // «Редактировать» bosilganda mount bo'ladi (dashboard-view), shuning uchun
    // effekt bilan sinxronlash shart emas.
    const [form, setForm] = useState(() => fromProfile(profile))
    const [security, setSecurity] = useState(null)

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

    const saveInfo = useAction(customerApi.updateInfo)
    const saveContacts = useAction(customerApi.updateContacts)

    // «Безопасность» qatorlari: niqoblangan pochta/telefon va parol sanasi
    // GET /customer/settings dan keladi.
    const noteFor = useSecurityNote(
        form.customerType === 'company' ? ROLES.COMPANY : ROLES.CLIENT,
        profile,
    )
    const upload = useAction(site.upload)
    const savePhoto = useAction(customerApi.updatePhoto)

    async function submitInfo() {
        const res = await saveInfo.run({
            customer_type: form.customerType,
            first_name: form.firstName || undefined,
            last_name: form.lastName || undefined,
            company_name: form.customerType === 'company' ? form.companyName : undefined,
            // Kompaniya uchun ikkita qo'shimcha maydon (backend javobi, 16-band).
            sphere_of_activity:
                form.customerType === 'company' ? form.field || undefined : undefined,
            representative_name:
                form.customerType === 'company' ? form.representative || undefined : undefined,
            inn: form.inn || undefined,
            city: form.city,
            about: form.about || undefined,
        })
        finish(res, 'Информация сохранена')
    }

    async function submitContacts() {
        const res = await saveContacts.run({
            phone: form.phone || undefined,
            contact_phone: form.phone || undefined,
            website: form.site || undefined,
        })
        finish(res, 'Контакты сохранены')
    }

    function finish(res, message) {
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success(message)
        onSaved?.()
        onClose()
    }

    // Avatar: avval faylni yuklaymiz, so'ng URL'ni profilga bog'laymiz.
    async function pickPhoto(file) {
        if (!file) return
        const uploaded = await upload.run(file)
        if (!uploaded.success) {
            toast.error(uploaded.error.message)
            return
        }
        const url = uploaded.data?.url
        const res = await savePhoto.run(url)
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        setForm((f) => ({ ...f, logo: url }))
        toast.success('Фото обновлено')
        onSaved?.()
    }

    const busy = saveInfo.loading || saveContacts.loading

    return (
        <AdminProfileModal
            open={open}
            onClose={onClose}
            // Har bir bo'lim o'z tugmalarini chizadi (Figma 260:6973), shuning
            // uchun oynaning umumiy «Сохранить / Отменить» qatori chiqmaydi.
            hideActionsFor={['info', 'contacts', 'security', 'delete']}
            sections={{
                info: (
                    <>
                        <ModalAvatar src={form.logo} onPick={pickPhoto} />
                        <ModalField label="Тип аккаунта">
                            <ModalSelect
                                options={ACCOUNT_TYPES}
                                value={form.customerType}
                                onChange={set('customerType')}
                            />
                        </ModalField>

                        {form.customerType === 'company' ? (
                            <>
                                <ModalField label="Название компании">
                                    <ModalInput
                                        value={form.companyName}
                                        onChange={set('companyName')}
                                        placeholder="Введите название"
                                    />
                                </ModalField>
                                <ModalField label="Сфера деятельности">
                                    <ModalInput
                                        value={form.field}
                                        onChange={set('field')}
                                        placeholder="Например, российский бренд одежды"
                                    />
                                </ModalField>
                                <ModalField label="Имя представителя">
                                    <ModalInput
                                        value={form.representative}
                                        onChange={set('representative')}
                                        placeholder="Введите имя"
                                    />
                                </ModalField>
                                <ModalField label="ИНН">
                                    <ModalInput
                                        value={form.inn}
                                        onChange={set('inn')}
                                        placeholder="Введите ИНН"
                                    />
                                </ModalField>
                            </>
                        ) : null}

                        <ModalField label="Имя">
                            <ModalInput
                                value={form.firstName}
                                onChange={set('firstName')}
                                placeholder="Введите имя"
                            />
                        </ModalField>
                        <ModalField label="Фамилия">
                            <ModalInput
                                value={form.lastName}
                                onChange={set('lastName')}
                                placeholder="Введите фамилию"
                            />
                        </ModalField>
                        <ModalField label="Город">
                            <ModalInput
                                value={form.city}
                                onChange={set('city')}
                                placeholder="Введите город"
                            />
                        </ModalField>
                        <ModalField label="О компании">
                            <ModalTextarea
                                value={form.about}
                                onChange={set('about')}
                                max={600}
                                placeholder="Расскажите, чем занимается ваша компания, какие проекты реализует и с кем сотрудничает."
                            />
                        </ModalField>

                        <Button
                            variant="gold"
                            onClick={submitInfo}
                            disabled={busy || !form.city.trim()}
                            className="lg:w-[240px]"
                        >
                            Сохранить
                        </Button>
                    </>
                ),
                contacts: (
                    <>
                        <ModalField label="Телефон">
                            <ModalInput
                                type="tel"
                                value={form.phone}
                                onChange={set('phone')}
                                placeholder="+ 7 (000)-000-00-00"
                            />
                        </ModalField>
                        <ModalField label="Электронная почта">
                            {/* Pochta «Безопасность» bo'limidan o'zgaradi
                                (POST /customer/settings/email + tasdiqlash). */}
                            <ModalInput
                                type="email"
                                value={profile?.email || ''}
                                readOnly
                                placeholder="po4ta@mail.ru"
                            />
                        </ModalField>
                        <ModalField label="Сайт">
                            <ModalInput
                                value={form.site}
                                onChange={set('site')}
                                placeholder="lime.ru"
                            />
                        </ModalField>

                        <Button
                            variant="gold"
                            onClick={submitContacts}
                            disabled={busy}
                            className="lg:w-[240px]"
                        >
                            Сохранить
                        </Button>
                    </>
                ),
                security: (
                    <>
                        <p className="text-[12px] leading-[18px] text-grey lg:text-[14px] lg:leading-[20px]">
                            Защитите свой аккаунт и управляйте способами входа.
                        </p>

                        {SECURITY_ROWS.map((row) => (
                            <CabinetSecurityRow
                                key={row.key}
                                icon={row.icon}
                                title={row.title}
                                note={noteFor(row.key)}
                                onChange={() => setSecurity(row.key)}
                            />
                        ))}
                    </>
                ),
                delete: (
                    <>
                        <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                            Аккаунт будет удалён вместе с проектами, площадками и перепиской.
                            Восстановить данные после удаления невозможно.
                        </p>
                        <Button
                            variant="danger"
                            onClick={() => setSecurity('delete')}
                            className="lg:w-[240px]"
                        >
                            Удалить аккаунт
                        </Button>
                    </>
                ),
            }}
        >
            <PasswordModal
                open={security === 'password'}
                onClose={() => setSecurity(null)}
                onDone={async () => {
                    setSecurity(null)
                    // Parol almashgach barcha refresh tokenlar bekor qilinadi.
                    toast.success('Пароль изменён, войдите заново')
                    await logout()
                    router.push('/')
                }}
            />
            <EmailModal open={security === 'email'} onClose={() => setSecurity(null)} />
            <PhoneModal
                open={security === 'phone'}
                onClose={() => setSecurity(null)}
                onDone={() => {
                    setSecurity(null)
                    toast.success('Номер изменён')
                    onSaved?.()
                }}
            />
            <DeleteAccountModal
                open={security === 'delete'}
                onClose={() => setSecurity(null)}
                onConfirm={async () => {
                    setSecurity(null)
                    onClose()
                    toast.success('Аккаунт удалён')
                    await logout()
                    router.push('/')
                }}
            />
        </AdminProfileModal>
    )
}
