'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Calendar, ChevronDown } from 'lucide-react'
import Modal, { ModalButton } from '@/components/ui/modal'
import { useAction } from '@/lib/use-api'
import * as site from '@/lib/api/site'

// ─────────────────────────────────────────────────────────────────────────────
// Площадки sahifasidagi ikkita modal:
//   1. Забронировать      — 164:17700 / 373:15583
//   2. Заявка отправлена  — 164:18096 / 373:16022
//
// Qolip barcha modallar bilan bir xil (`components/ui/modal.jsx`): markazda
// 550px oq oyna, uppercase sarlavha, pastda gold va gold-15% tugmalar.
// «Требуется вход» oynasi umumiy `detail-modals.jsx` dan olinadi.
// ─────────────────────────────────────────────────────────────────────────────

const TIME_SLOTS = [
    '09:00 – 12:00',
    '12:00 – 15:00',
    '15:00 – 18:00',
    '18:00 – 21:00',
    'Съёмочный день',
]

// Modal ichidagi maydonlar — light-white fon, radius 6 (Figma 164:17704).
function Field({ as: Tag = 'input', ...props }) {
    return (
        <Tag
            {...props}
            className={`w-full rounded-[6px] bg-light-white p-[12px] text-[14px] text-black outline-none placeholder:text-[#aaa] lg:p-[16px] lg:text-[16px] ${
                Tag === 'textarea'
                    ? 'custom-scrollbar min-h-[100px] resize-none lg:min-h-[132px]'
                    : ''
            }`}
        />
    )
}

// 1. Забронировать — nom, sana, vaqt va izoh (Figma 164:17700)
export function BookingModal({ open, onClose, onSent, venueId }) {
    const [project, setProject] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [comment, setComment] = useState('')

    // Bo'sh `type="date"` maydoni brauzerning «mm/dd/yyyy» matnini ko'rsatadi,
    // Figma'da esa «Выберите дату» yozuvi turibdi. Shuning uchun maydon bo'sh
    // va fokusda bo'lmaganda oddiy matn maydoni sifatida chiziladi.
    const [dateFocused, setDateFocused] = useState(false)

    const book = useAction(site.bookVenue)

    // Backend hozir faqat `shoot_date` ni qabul qiladi (POST /site/venues/{id}/book).
    // Loyiha nomi, vaqt oralig'i va izoh uchun maydon yo'q — backend-report.md ga
    // kiritilgan; qiymatlar hozircha yuborilmaydi.
    async function submit() {
        if (!project.trim() || !date) return
        const res = await book.run(venueId, { shootDate: date })
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        setProject('')
        setDate('')
        setTime('')
        setComment('')
        onSent(res.data)
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Забронировать"
            footer={
                <>
                    <ModalButton onClick={submit} disabled={!project.trim() || !date || book.loading}>
                        Отправить заявку
                    </ModalButton>
                    <ModalButton variant="secondary" onClick={onClose}>
                        Отменить
                    </ModalButton>
                </>
            }
        >
            <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                <Field
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    placeholder="Название проекта или съёмки"
                />

                {/* Sana — Figma'da o'ng chekkada kalendar ikonkasi.
                    Brauzerning o'z ikonkasi yashiriladi, lekin bosilganda
                    kalendar ochilishi uchun ustidan cho'ziladi. */}
                <label className="relative block">
                    <input
                        type={dateFocused || date ? 'date' : 'text'}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        onFocus={() => setDateFocused(true)}
                        onBlur={() => setDateFocused(false)}
                        placeholder="Выберите дату"
                        aria-label="Выберите дату"
                        className="w-full cursor-pointer rounded-[6px] bg-light-white p-[12px] text-[14px] text-black outline-none placeholder:text-[#aaa] lg:p-[16px] lg:text-[16px] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                    />
                    <Calendar
                        size={24}
                        strokeWidth={2}
                        aria-hidden
                        className="pointer-events-none absolute top-1/2 right-[12px] -translate-y-1/2 text-black lg:right-[16px]"
                    />
                </label>

                {/* Vaqt — Figma'da chevron bilan ochiladigan ro'yxat */}
                <div className="relative">
                    <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        aria-label="Выберите время"
                        className={`w-full cursor-pointer appearance-none rounded-[6px] bg-light-white p-[12px] pr-[44px] text-[14px] outline-none lg:p-[16px] lg:pr-[52px] lg:text-[16px] ${
                            time ? 'text-black' : 'text-[#aaa]'
                        }`}
                    >
                        <option value="">Выберите время</option>
                        {TIME_SLOTS.map((slot) => (
                            <option key={slot} value={slot}>
                                {slot}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        size={24}
                        strokeWidth={2}
                        aria-hidden
                        className="pointer-events-none absolute top-1/2 right-[12px] -translate-y-1/2 text-black lg:right-[16px]"
                    />
                </div>

                <Field
                    as="textarea"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Комментарий (необязательно)"
                />
            </div>
        </Modal>
    )
}

// 2. Заявка отправлена (Figma 164:18096)
export function BookingSentModal({ open, onClose }) {
    const router = useRouter()

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Заявка отправлена"
            description="Заявка успешно отправлена. Чат с площадкой уже создан."
            footer={<ModalButton onClick={() => router.push('/chat')}>Открыть чат</ModalButton>}
        />
    )
}
