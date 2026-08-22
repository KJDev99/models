'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Eye, Lock, Mail, Phone, Shield, Trash2 } from 'lucide-react'
import AdminProfileModal from '@/components/admin/ui/admin-profile-modal'
import { CabinetSecurityRow } from '@/components/shared/cabinet/cabinet-ui'
import { useSecurityNote } from '@/components/shared/cabinet/use-security-info'
import {
    DeleteAccountModal,
    EmailModal,
    PasswordModal,
    PhoneModal,
} from '@/components/client/dashboard/security-modals'
import { useRouter } from 'next/navigation'
import { useAction } from '@/lib/use-api'
import * as performerApi from '@/lib/api/performer'
import { useAuthStore } from '@/store/useAuthStore'
import { ROLES } from '@/lib/roles'

// ─────────────────────────────────────────────────────────────────────────────
// «Настройка профиля» — Figma 265:14993 / 334:14236, mobil 434:16923.
//
// «Заказчик»dan farqi: bu yerda «Информация» va «Контакты» yo'q — anketa
// alohida sahifada (`/executor/questionnaire`) tahrirlanadi. Uchta bo'lim
// qoladi: Безопасность · Видимость профиля · Удаление аккаунта.
// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
    { key: 'security', label: 'Безопасность', icon: Shield },
    { key: 'visibility', label: 'Видимость профиля', icon: Eye },
    { key: 'delete', label: 'Удаление аккаунта', icon: Trash2 },
]

// «Безопасность» bo'limidagi qatorlar (Figma 260:6989 bilan bir xil komponent).
const SECURITY_ROWS = [
    { key: 'password', title: 'Пароль', icon: Lock },
    { key: 'email', title: 'Электронная почта', icon: Mail },
    { key: 'phone', title: 'Телефон', icon: Phone },
]

export default function ExecutorProfileSettingsModal({ open, onClose, profile, onSaved }) {
    const router = useRouter()
    const logout = useAuthStore((s) => s.logout)

    const [step, setStep] = useState(null)
    // Boshlang'ich holat backenddan (`is_hidden`), oyna ochilganda o'qiladi.
    const [hidden, setHidden] = useState(() => Boolean(profile?.isHidden))

    const setHiddenApi = useAction(performerApi.setHidden)

    // Pochta va telefon niqoblangan holda GET /performer/settings dan keladi.
    const noteFor = useSecurityNote(ROLES.EXECUTOR, profile)

    async function toggleHidden() {
        const next = !hidden
        const res = await setHiddenApi.run(next)
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        setHidden(next)
        toast.success(next ? 'Профиль скрыт' : 'Профиль снова виден')
        onSaved?.()
    }

    return (
        <AdminProfileModal
            open={open}
            onClose={onClose}
            title="Настройка профиля"
            tabs={TABS}
            // Har bir bo'lim o'z tugmalarini chizadi (Figma 334:14255 —
            // «Видимость профиля»da «Сохранить / Отменить» yo'q).
            hideActionsFor={['security', 'visibility', 'delete']}
            sections={{
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
                                onChange={() => setStep(row.key)}
                            />
                        ))}

                    </>
                ),

                // Figma 334:14255 — izoh va bitta 420px kenglikdagi gold tugma.
                visibility: (
                    <>
                        <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                            Если скрыть профиль, он перестанет отображаться в каталоге и станет
                            недоступен для заказчиков. Все данные и портфолио сохранятся.
                        </p>
                        <button
                            type="button"
                            onClick={toggleHidden}
                            disabled={setHiddenApi.loading}
                            className="ui-shine relative w-full cursor-pointer overflow-hidden rounded-[6px] bg-gold px-[24px] py-[12px] text-[14px] font-medium text-white transition-colors hover:bg-[#c19754] disabled:cursor-not-allowed disabled:opacity-50 lg:w-[420px] lg:py-[16px] lg:text-[18px]"
                        >
                            <span className="relative">
                                {hidden ? 'Показать профиль' : 'Скрыть профиль'}
                            </span>
                        </button>
                    </>
                ),

                delete: (
                    <>
                        <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                            Аккаунт будет удалён вместе с анкетой, портфолио и перепиской.
                            Восстановить данные после удаления невозможно.
                        </p>
                        <button
                            type="button"
                            onClick={() => setStep('delete')}
                            className="w-full cursor-pointer rounded-[6px] border border-danger px-[24px] py-[12px] text-[14px] font-medium text-danger transition-colors hover:bg-danger hover:text-white lg:w-[420px] lg:py-[16px] lg:text-[18px]"
                        >
                            Удалить аккаунт
                        </button>
                    </>
                ),
            }}
        >
            <PasswordModal
                open={step === 'password'}
                onClose={() => setStep(null)}
                onDone={async () => {
                    setStep(null)
                    toast.success('Пароль изменён, войдите заново')
                    await logout()
                    router.push('/')
                }}
            />
            <EmailModal open={step === 'email'} onClose={() => setStep(null)} />
            <PhoneModal
                open={step === 'phone'}
                onClose={() => setStep(null)}
                onDone={() => {
                    setStep(null)
                    toast.success('Номер изменён')
                    onSaved?.()
                }}
            />
            <DeleteAccountModal
                open={step === 'delete'}
                onClose={() => setStep(null)}
                onConfirm={async () => {
                    setStep(null)
                    onClose()
                    toast.success('Аккаунт удалён')
                    await logout()
                    router.push('/')
                }}
            />
        </AdminProfileModal>
    )
}

