'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// «Безопасность» bo'limidagi kichik oynalar — Figma:
//   Изменить пароль        260:7888  / mobil 394:22656
//   Изменить почту         260:8454  / mobil 394:22746
//   Подтвердите почту      260:8937  / mobil 394:22863
//   Почта подтверждена     260:9420  / mobil 394:22955
//   Изменение номера       260:9904  / mobil 400:23015
//   Удалить аккаунт?       270:24791 / mobil 400:23084
//
// Hammasi «Редактировать профиль» oynasining ustida ochiladi: 630px keng,
// markazda, sarlavha o'rtada, ostida maydonlar va ikkita tugma.
// ─────────────────────────────────────────────────────────────────────────────

export function SmallModal({ open, onClose, title, children }) {
    if (!open) return null

    return (
        <div
            className="fade-in fixed inset-0 z-[110] flex items-center justify-center bg-black/25 p-[12px]"
            // Oyna «Редактировать профиль» ichida turadi — bosish ostidagi
            // oynani ham yopib yubormasligi kerak.
            onClick={(e) => {
                e.stopPropagation()
                onClose()
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                className="modal-in flex w-full max-w-[630px] flex-col gap-[16px] rounded-[6px] bg-white p-[16px] lg:gap-[24px] lg:p-[24px]"
            >
                <div className="flex items-start gap-[12px]">
                    <h3 className="min-w-0 flex-1 text-center text-[18px] font-medium text-black lg:text-[20px]">
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Закрыть"
                        className="shrink-0 cursor-pointer text-black transition-opacity hover:opacity-70"
                    >
                        <X size={20} strokeWidth={2} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

export function SmallField({ label, ...props }) {
    return (
        <label className="flex flex-col gap-[8px] lg:gap-[12px]">
            <span className="text-[14px] text-grey lg:text-[16px]">{label}</span>
            <input
                {...props}
                className="w-full rounded-[6px] bg-light-white p-[12px] text-[14px] text-black outline-none placeholder:text-[#aaa] lg:p-[16px] lg:text-[16px]"
            />
        </label>
    )
}

export function SmallText({ children }) {
    return (
        <p className="text-[12px] leading-[18px] text-grey lg:text-[14px] lg:leading-[20px]">
            {children}
        </p>
    )
}

export function SmallActions({ primary, secondary }) {
    return (
        <div className="flex flex-col gap-[12px] lg:flex-row lg:gap-[16px]">
            <button
                type="button"
                onClick={primary.onClick}
                className="ui-shine relative min-w-0 flex-1 cursor-pointer overflow-hidden rounded-[6px] bg-gold px-[24px] py-[12px] text-[14px] font-medium text-white transition-colors hover:bg-[#c19754] lg:py-[16px] lg:text-[16px]"
            >
                <span className="relative">{primary.label}</span>
            </button>
            {secondary && (
                <button
                    type="button"
                    onClick={secondary.onClick}
                    className="min-w-0 flex-1 cursor-pointer rounded-[6px] bg-[#f7f2e9] px-[24px] py-[12px] text-[14px] font-medium text-gold transition-colors hover:bg-[#f1e8d8] lg:py-[16px] lg:text-[16px]"
                >
                    {secondary.label}
                </button>
            )}
        </div>
    )
}

// ── Konkret oynalar ──────────────────────────────────────────────────────────

// Изменить пароль (260:7888)
export function PasswordModal({ open, onClose, onDone }) {
    return (
        <SmallModal open={open} onClose={onClose} title="Изменить пароль">
            <SmallField label="Пароль" type="password" placeholder="Введите пароль" />
            <SmallField
                label="Повторите пароль"
                type="password"
                placeholder="Введите повторный пароль"
            />
            <SmallActions
                primary={{ label: 'Изменить', onClick: onDone }}
                secondary={{ label: 'Отменить', onClick: onClose }}
            />
        </SmallModal>
    )
}

// Изменить почту (260:8454) → Подтвердите почту (260:8937) → Почта подтверждена (260:9420)
export function EmailModal({ open, onClose }) {
    const [stage, setStage] = useState('form')

    function close() {
        setStage('form')
        onClose()
    }

    if (stage === 'sent') {
        return (
            <SmallModal open={open} onClose={close} title="Подтвердите почту">
                <SmallText>
                    Мы отправили письмо с подтверждением на указанный адрес. Перейдите по ссылке в
                    письме, чтобы подтвердить электронную почту.
                </SmallText>
                <SmallActions
                    primary={{ label: 'Перейти на главную', onClick: () => setStage('done') }}
                    secondary={{ label: 'Отправить письмо повторно', onClick: () => {} }}
                />
            </SmallModal>
        )
    }

    if (stage === 'done') {
        return (
            <SmallModal open={open} onClose={close} title="Почта подтверждена">
                <SmallText>
                    Электронная почта успешно подтверждена. Теперь на неё будут приходить
                    уведомления о проектах и сообщениях.
                </SmallText>
                <SmallActions primary={{ label: 'Хорошо', onClick: close }} />
            </SmallModal>
        )
    }

    return (
        <SmallModal open={open} onClose={close} title="Изменить почту">
            <SmallField label="Электронная почта" type="email" placeholder="Введите почту" />
            <SmallActions
                primary={{ label: 'Изменить', onClick: () => setStage('sent') }}
                secondary={{ label: 'Отменить', onClick: close }}
            />
        </SmallModal>
    )
}

// Изменение номера телефона (260:9904)
export function PhoneModal({ open, onClose, onDone }) {
    return (
        <SmallModal open={open} onClose={onClose} title="Изменение номера телефона">
            <SmallField label="Телефон" type="tel" placeholder="+ 7 (000)-000-00-00" />
            <SmallActions
                primary={{ label: 'Изменить', onClick: onDone }}
                secondary={{ label: 'Отменить', onClick: onClose }}
            />
        </SmallModal>
    )
}

// Удалить аккаунт? (270:24791)
export function DeleteAccountModal({ open, onClose, onConfirm }) {
    return (
        <SmallModal open={open} onClose={onClose} title="Удалить аккаунт?">
            <SmallText>
                Аккаунт будет удалён вместе с проектами, площадками и перепиской. Восстановить
                данные после удаления невозможно.
            </SmallText>
            <SmallActions
                primary={{ label: 'Удалить', onClick: onConfirm }}
                secondary={{ label: 'Отменить', onClick: onClose }}
            />
        </SmallModal>
    )
}
