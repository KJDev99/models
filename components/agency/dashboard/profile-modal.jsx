'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Lock, Mail, Phone } from 'lucide-react'
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
    EmailModal,
    PasswordModal,
    PhoneModal,
} from '@/components/client/dashboard/security-modals'
import { AGENCY } from '@/components/agency/dashboard/dashboard-data'

// ─────────────────────────────────────────────────────────────────────────────
// «Редактировать профиль» — Figma 270:21182 (1200×1158), mobil 437:17337 ichida.
// Oyna karkasi adminka va «Заказчик» kabinetidagi bilan bitta komponent,
// faqat «Информация» bo'limidagi maydonlar agentlik uchun.
// ─────────────────────────────────────────────────────────────────────────────

const SECURITY_ROWS = [
    { key: 'password', title: 'Пароль', icon: Lock, note: 'Последнее изменение 01.07.2026' },
    { key: 'email', title: 'Электронная почта', icon: Mail, note: AGENCY.email },
    { key: 'phone', title: 'Телефон', icon: Phone, note: AGENCY.phone },
]

export default function AgencyProfileModal({ open, onClose }) {
    const [about, setAbout] = useState(AGENCY.about)
    const [security, setSecurity] = useState(null)

    function save() {
        onClose()
        toast.success('Изменения сохранены')
    }

    const actions = (
        <div className="flex flex-col gap-[12px] lg:flex-row lg:gap-[16px]">
            <Button variant="gold" onClick={save} full className="lg:flex-1">
                Сохранить
            </Button>
            <Button variant="white" onClick={onClose} full className="lg:flex-1">
                Отменить
            </Button>
        </div>
    )

    return (
        <AdminProfileModal
            open={open}
            onClose={onClose}
            // Har bir bo'lim o'z tugmalarini chizadi (Figma 270:21182).
            hideActionsFor={['info', 'contacts', 'security', 'delete']}
            sections={{
                info: (
                    <>
                        <ModalAvatar src={AGENCY.logo} />
                        <ModalField label="Название агентства">
                            <ModalInput defaultValue={AGENCY.name} placeholder="Введите название" />
                        </ModalField>
                        <ModalField
                            label="Имя представителя"
                            hint="Имя представителя видно только администрации и используется для связи с агентством."
                        >
                            <ModalInput defaultValue="Алексей" placeholder="Введите имя" />
                        </ModalField>
                        <ModalField label="Сфера деятельности">
                            <ModalInput
                                defaultValue={AGENCY.kind}
                                placeholder="Например: Модельное и креативное агентство"
                            />
                        </ModalField>
                        <ModalField label="Город">
                            <ModalInput defaultValue={AGENCY.city} placeholder="Введите город" />
                        </ModalField>
                        <ModalField label="О компании">
                            <ModalTextarea
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                max={600}
                                placeholder="Расскажите, чем занимается агентство, каких исполнителей представляет и с кем сотрудничает."
                            />
                        </ModalField>
                        {actions}
                    </>
                ),

                contacts: (
                    <>
                        <ModalField label="Телефон">
                            <ModalInput
                                type="tel"
                                defaultValue={AGENCY.phone}
                                placeholder="+ 7 (000)-000-00-00"
                            />
                        </ModalField>
                        <ModalField label="Электронная почта">
                            <ModalInput
                                type="email"
                                defaultValue={AGENCY.email}
                                placeholder="po4ta@mail.ru"
                            />
                        </ModalField>
                        <ModalField label="Сайт">
                            <ModalInput placeholder="lumen.ru" />
                        </ModalField>
                        {actions}
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
                                note={row.note}
                                onChange={() => setSecurity(row.key)}
                            />
                        ))}
                        {actions}
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
