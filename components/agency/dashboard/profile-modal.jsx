'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Lock } from 'lucide-react'
import AdminProfileModal, {
    ModalAvatar,
    ModalField,
    ModalInput,
    ModalTextarea,
} from '@/components/admin/ui/admin-profile-modal'
import Button from '@/components/ui/button'
import { CabinetSecurityRow } from '@/components/shared/cabinet/cabinet-ui'
import {
    DeleteAccountModal,
    PasswordModal,
} from '@/components/client/dashboard/security-modals'
import { useAction } from '@/lib/use-api'
import * as agencyApi from '@/lib/api/agency'
import * as site from '@/lib/api/site'
import { useAuthStore } from '@/store/useAuthStore'

// ─────────────────────────────────────────────────────────────────────────────
// «Редактировать профиль» — Figma 270:21182 (1200×1158), mobil 437:17337 ichida.
// Oyna karkasi adminka va «Заказчик» kabinetidagi bilan bitta komponent,
// faqat «Информация» bo'limidagi maydonlar agentlik uchun.
//
// Saqlash (backend/agency.md):
//   Информация → PATCH /agency/profile/info
//   Контакты   → PATCH /agency/profile/contacts
//   Пароль     → PATCH /agency/profile/security
//   Фото       → POST  /site/upload → POST /agency/profile/photo
//
// Backendda agentlik uchun pochta va telefonni almashtirish endpointi yo'q,
// shuning uchun «Безопасность» bo'limida faqat parol qatori qoladi
// (backend-report.md ga kiritilgan).
// ─────────────────────────────────────────────────────────────────────────────

function fromProfile(profile) {
    return {
        name: profile?.name || '',
        representative: profile?.representative || '',
        sphere: profile?.sphere || profile?.kind || '',
        city: profile?.city || '',
        about: profile?.about || '',
        logo: profile?.image || null,
        phone: profile?.phone || '',
        site: profile?.website || '',
    }
}

export default function AgencyProfileModal({ open, onClose, profile, onSaved }) {
    const router = useRouter()
    const logout = useAuthStore((s) => s.logout)

    const [form, setForm] = useState(() => fromProfile(profile))
    const [security, setSecurity] = useState(null)

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

    const saveInfo = useAction(agencyApi.updateInfo)
    const saveContacts = useAction(agencyApi.updateContacts)
    const upload = useAction(site.upload)
    const savePhoto = useAction(agencyApi.updatePhoto)

    function finish(res, message) {
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success(message)
        onSaved?.()
        onClose()
    }

    async function submitInfo() {
        const res = await saveInfo.run({
            agency_name: form.name,
            representative_name: form.representative,
            sphere_of_activity: form.sphere || undefined,
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
        toast.success('Логотип обновлён')
        onSaved?.()
    }

    const busy = saveInfo.loading || saveContacts.loading
    const required = form.name.trim() && form.representative.trim() && form.city.trim()

    return (
        <AdminProfileModal
            open={open}
            onClose={onClose}
            // Har bir bo'lim o'z tugmalarini chizadi (Figma 270:21182).
            hideActionsFor={['info', 'contacts', 'security', 'delete']}
            sections={{
                info: (
                    <>
                        <ModalAvatar src={form.logo} onPick={pickPhoto} />
                        <ModalField label="Название агентства">
                            <ModalInput
                                value={form.name}
                                onChange={set('name')}
                                placeholder="Введите название"
                            />
                        </ModalField>
                        <ModalField
                            label="Имя представителя"
                            hint="Имя представителя видно только администрации и используется для связи с агентством."
                        >
                            <ModalInput
                                value={form.representative}
                                onChange={set('representative')}
                                placeholder="Введите имя"
                            />
                        </ModalField>
                        <ModalField label="Сфера деятельности">
                            <ModalInput
                                value={form.sphere}
                                onChange={set('sphere')}
                                placeholder="Например: Модельное и креативное агентство"
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
                                placeholder="Расскажите, чем занимается агентство, каких исполнителей представляет и с кем сотрудничает."
                            />
                        </ModalField>

                        <Button
                            variant="gold"
                            onClick={submitInfo}
                            disabled={busy || !required}
                            full
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
                            {/* Backendda agentlik pochtasini almashtirish yo'q. */}
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
                                placeholder="lumen.ru"
                            />
                        </ModalField>

                        <Button
                            variant="gold"
                            onClick={submitContacts}
                            disabled={busy}
                            full
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
                        <CabinetSecurityRow
                            icon={Lock}
                            title="Пароль"
                            note="Смените пароль, если давно этого не делали"
                            onChange={() => setSecurity('password')}
                        />
                    </>
                ),

                delete: (
                    <>
                        <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                            Аккаунт будет удалён вместе с анкетами исполнителей и перепиской.
                            Восстановить данные после удаления невозможно.
                        </p>
                        <Button
                            variant="danger"
                            onClick={() => setSecurity('delete')}
                            full
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
                    toast.success('Пароль изменён, войдите заново')
                    await logout()
                    router.push('/')
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
