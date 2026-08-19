'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'
import Modal, { ModalButton } from '@/components/ui/modal'
import { useAuthModalStore } from '@/store/useAuthModalStore'

// ─────────────────────────────────────────────────────────────────────────────
// Anketa sahifasidagi to'rtta modal.
//   1. Требуется вход          — 164:14791 / 363:12791
//   2. Пригласить в проект     — 164:15199 / 363:13246
//   3. Приглашение отправлено  — 164:15594 / 363:13717
//   4. Оставить отзыв          — 320:11329 / 375:13931
//
// Barchasi bir xil qolipda: markazda oq oyna, uppercase sarlavha, kulrang
// tavsif, pastda to'liq kenglikdagi gold va gold-15% tugmalar.
// ─────────────────────────────────────────────────────────────────────────────

// Modal ichidagi maydonlar — light-white fon, radius 6 (Figma 164:15199).
function Field({ as: Tag = 'input', ...props }) {
    return (
        <Tag
            {...props}
            className={`w-full rounded-[6px] bg-light-white p-[12px] text-[14px] text-black outline-none placeholder:text-[#aaa] lg:p-[16px] lg:text-[16px] ${
                Tag === 'textarea' ? 'custom-scrollbar min-h-[96px] resize-none lg:min-h-[110px]' : ''
            }`}
        />
    )
}

// 1. Требуется вход — ikkala tugma ham Авторизация oynasini ochadi.
export function AuthRequiredModal({ open, onClose }) {
    const openAuth = useAuthModalStore((s) => s.openAuth)

    function start(step) {
        onClose()
        openAuth(step)
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Требуется вход"
            description="Эта функция доступна заказчикам после входа в аккаунт."
            footer={
                <>
                    <ModalButton onClick={() => start('role')}>Войти</ModalButton>
                    <ModalButton variant="secondary" onClick={() => start('register')}>
                        Зарегистрироваться
                    </ModalButton>
                </>
            }
        />
    )
}

// Foydalanuvchining faol loyihalari (Figma 216:5064). Backend ulanganda
// «Мои проекты» ro'yxati bilan almashtiriladi.
const MY_PROJECTS = ['Съёмка для fashion-бренда', 'Съёмка для рекламы']

// 2. Пригласить в проект
export function InviteModal({ open, onClose, onSent }) {
    const [project, setProject] = useState('')
    const [message, setMessage] = useState('')

    function submit() {
        if (!project.trim()) return
        setProject('')
        setMessage('')
        onSent()
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Пригласить в проект"
            footer={
                <>
                    <ModalButton onClick={submit} disabled={!project.trim()}>
                        Отправить приглашение
                    </ModalButton>
                    <ModalButton variant="secondary" onClick={onClose}>
                        Отменить
                    </ModalButton>
                </>
            }
        >
            {/* Figma «Пригласить в проект» 216:5064 — «Съёмка» yorlig'i ostida
                foydalanuvchining faol loyihalari ro'yxati; bittasi tanlanadi. */}
            <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                <span className="text-[14px] text-grey lg:text-[16px]">Съёмка</span>

                <div className="flex flex-col overflow-hidden rounded-[6px] bg-white">
                    {MY_PROJECTS.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setProject(item)}
                            className={`cursor-pointer p-[12px] text-left text-[14px] transition-colors lg:p-[16px] lg:text-[16px] ${
                                project === item
                                    ? 'bg-gold/15 text-black'
                                    : 'text-grey hover:bg-light-white hover:text-black'
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <Field
                    as="textarea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Сообщение (необязательно)"
                />
            </div>
        </Modal>
    )
}

// 3. Приглашение отправлено
export function InviteSentModal({ open, onClose }) {
    const router = useRouter()

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Приглашение отправлено"
            description="Приглашение успешно отправлено. Чат с исполнителем уже создан."
            footer={<ModalButton onClick={() => router.push('/chat')}>Открыть чат</ModalButton>}
        />
    )
}

// 4. Оставить отзыв
export function ReviewModal({ open, onClose }) {
    const [rating, setRating] = useState(1)
    const [text, setText] = useState('')

    function submit() {
        if (!text.trim()) return
        setRating(1)
        setText('')
        onClose()
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Оставить отзыв"
            footer={
                <>
                    <ModalButton onClick={submit} disabled={!text.trim()}>
                        Опубликовать отзыв
                    </ModalButton>
                    <ModalButton variant="secondary" onClick={onClose}>
                        Отменить
                    </ModalButton>
                </>
            }
        >
            <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                <div className="flex items-center justify-center gap-[16px] lg:gap-[24px]">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setRating(i)}
                            aria-label={`Оценка ${i}`}
                            aria-pressed={i <= rating}
                            className="cursor-pointer transition-transform hover:scale-110"
                        >
                            <Star
                                size={32}
                                strokeWidth={2}
                                className={
                                    i <= rating
                                        ? 'fill-gold text-gold'
                                        : 'fill-black/20 text-black/20'
                                }
                            />
                        </button>
                    ))}
                </div>

                <Field
                    as="textarea"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Расскажите, как прошло сотрудничество, что вам понравилось и чем исполнитель или площадка запомнились."
                />
            </div>
        </Modal>
    )
}
