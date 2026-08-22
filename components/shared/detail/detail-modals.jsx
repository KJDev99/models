'use client'

import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Star } from 'lucide-react'
import Modal, { ModalButton } from '@/components/ui/modal'
import { useAuthModalStore } from '@/store/useAuthModalStore'
import { useApi, useAction } from '@/lib/use-api'
import * as site from '@/lib/api/site'
import * as customerApi from '@/lib/api/customer'
import { useAuth } from '@/lib/use-auth'
import { ROLES } from '@/lib/roles'

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

// 2. Пригласить в проект
//
// Loyihalar ro'yxati zakazchikning o'z loyihalaridan olinadi
// (GET /customer/projects?status=active), taklif esa
// POST /site/performers/{id}/invite orqali yuboriladi (backend/site.md).
export function InviteModal({ open, onClose, onSent, performerId }) {
    const { role } = useAuth()
    const isCustomer = role === ROLES.CLIENT || role === ROLES.COMPANY

    const [project, setProject] = useState('')

    const fetchProjects = useCallback(
        () => customerApi.projects({ status: 'active' }),
        [],
    )
    const { data, loading } = useApi(fetchProjects, { enabled: open && isCustomer })
    const projects = data?.items || []

    const invite = useAction(site.invitePerformer)

    async function submit() {
        if (!project) return
        const res = await invite.run(performerId, project)
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        setProject('')
        onSent()
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Пригласить в проект"
            footer={
                <>
                    <ModalButton onClick={submit} disabled={!project || invite.loading}>
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

                {loading ? (
                    <div className="h-[96px] animate-pulse rounded-[6px] bg-black/5" />
                ) : projects.length === 0 ? (
                    <p className="text-[14px] text-grey lg:text-[16px]">
                        У вас нет активных проектов. Сначала опубликуйте проект.
                    </p>
                ) : (
                    <div className="flex flex-col overflow-hidden rounded-[6px] bg-white">
                        {projects.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setProject(item.id)}
                                className={`cursor-pointer p-[12px] text-left text-[14px] transition-colors lg:p-[16px] lg:text-[16px] ${
                                    project === item.id
                                        ? 'bg-gold/15 text-black'
                                        : 'text-grey hover:bg-light-white hover:text-black'
                                }`}
                            >
                                {item.title}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    )
}

// 3. Приглашение отправлено
export function InviteSentModal({ open, onClose, conversationId }) {
    const router = useRouter()

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Приглашение отправлено"
            description="Приглашение успешно отправлено. Чат с исполнителем уже создан."
            footer={
                <ModalButton
                    onClick={() => router.push(conversationId ? `/chat/${conversationId}` : '/chat')}
                >
                    Открыть чат
                </ModalButton>
            }
        />
    )
}

// 4. Оставить отзыв
export function ReviewModal({ open, onClose, targetId, venueId, onSent }) {
    const [rating, setRating] = useState(1)
    const [text, setText] = useState('')
    const create = useAction(customerApi.createReview)

    async function submit() {
        if (!text.trim()) return
        const res = await create.run({ targetId, venueId, rating, body: text })
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        setRating(1)
        setText('')
        // Sharh darhol saytga chiqmaydi — backend `message` ni o'zi beradi
        // (status `pending_review`, backend javobi «Отзывы» bo'limi).
        toast.success(res.data?.message || 'Отзыв отправлен на модерацию')
        onSent?.()
        onClose()
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Оставить отзыв"
            footer={
                <>
                    <ModalButton onClick={submit} disabled={!text.trim() || create.loading}>
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
