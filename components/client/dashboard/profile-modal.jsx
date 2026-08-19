'use client'

import React, { useState } from 'react'
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
import { Lock, Mail, Phone } from 'lucide-react'
import {
    DeleteAccountModal,
    EmailModal,
    PasswordModal,
    PhoneModal,
} from '@/components/client/dashboard/security-modals'

// ─────────────────────────────────────────────────────────────────────────────
// «Редактировать профиль» — Figma «Заказчик» 320:8226 (1200×810).
// Oyna karkasi adminkadagi bilan bitta komponent (338:18303), faqat
// maydonlar заказчик uchun: тип аккаунта, имя/фамилия, город, о компании.
// ─────────────────────────────────────────────────────────────────────────────

const ACCOUNT_TYPES = [
    { value: 'client', label: 'Заказчик' },
    { value: 'company', label: 'Компания' },
]

// «Безопасность» bo'limidagi qatorlar (Figma 260:6989).
const SECURITY_ROWS = [
    { key: 'password', title: 'Пароль', icon: Lock },
    { key: 'email', title: 'Электронная почта', icon: Mail },
    { key: 'phone', title: 'Телефон', icon: Phone },
]

export default function ClientProfileModal({ open, onClose, profile }) {
    const [about, setAbout] = useState('')
    const [security, setSecurity] = useState(null)

    function save() {
        onClose()
        toast.success('Изменения сохранены')
    }

    const saveButton = (
        <Button variant="gold" onClick={save} className="lg:w-[240px]">
            Сохранить
        </Button>
    )

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
                        <ModalAvatar src={profile?.logo} />
                        <ModalField label="Тип аккаунта">
                            <ModalSelect options={ACCOUNT_TYPES} defaultValue="client" />
                        </ModalField>
                        <ModalField label="Имя">
                            <ModalInput placeholder="Введите имя" />
                        </ModalField>
                        <ModalField label="Фамилия">
                            <ModalInput placeholder="Введите фамилию" />
                        </ModalField>
                        <ModalField label="Город">
                            <ModalInput defaultValue={profile?.city} placeholder="Введите город" />
                        </ModalField>
                        <ModalField label="О компании">
                            <ModalTextarea
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                max={600}
                                placeholder="Расскажите, чем занимается ваша компания, какие проекты реализует и с кем сотрудничает."
                            />
                        </ModalField>
                        {saveButton}
                    </>
                ),
                contacts: (
                    <>
                        <ModalField label="Телефон">
                            <ModalInput
                                type="tel"
                                defaultValue={profile?.phone}
                                placeholder="+ 7 (000)-000-00-00"
                            />
                        </ModalField>
                        <ModalField label="Электронная почта">
                            <ModalInput
                                type="email"
                                defaultValue={profile?.email}
                                placeholder="po4ta@mail.ru"
                            />
                        </ModalField>
                        <ModalField label="Сайт">
                            <ModalInput defaultValue={profile?.site} placeholder="lime.ru" />
                        </ModalField>
                        {saveButton}
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
                                note={
                                    row.key === 'password'
                                        ? 'Последнее изменение 01.07.2026'
                                        : row.key === 'email'
                                          ? profile?.email || 'lime@mail.ru'
                                          : profile?.phone || 'lime@mail.ru'
                                }
                                onChange={() => setSecurity(row.key)}
                            />
                        ))}

                        <div className="flex flex-col gap-[12px] lg:flex-row lg:gap-[16px]">
                            <Button variant="gold" onClick={save} full className="lg:flex-1">
                                Сохранить
                            </Button>
                            <Button variant="white" onClick={onClose} full className="lg:flex-1">
                                Отменить
                            </Button>
                        </div>
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
                onDone={() => {
                    setSecurity(null)
                    toast.success('Пароль изменён')
                }}
            />
            <EmailModal open={security === 'email'} onClose={() => setSecurity(null)} />
            <PhoneModal
                open={security === 'phone'}
                onClose={() => setSecurity(null)}
                onDone={() => {
                    setSecurity(null)
                    toast.success('Номер изменён')
                }}
            />
            <DeleteAccountModal
                open={security === 'delete'}
                onClose={() => setSecurity(null)}
                onConfirm={() => {
                    setSecurity(null)
                    onClose()
                    toast.success('Заявка на удаление отправлена')
                }}
            />
        </AdminProfileModal>
    )
}
