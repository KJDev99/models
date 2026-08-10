'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Figma'dagi barcha modallar uchun asos: Требуется вход (164:14791),
// Пригласить в проект (164:15199), Приглашение отправлено (164:15594),
// Оставить отзыв (320:11329). Mobil variantlar: 363:12791 / 363:13246 /
// 363:13717 / 375:13931.
//
// O'lchamlar (desktop): en 550px, radius 6, ichki bo'shliq 24, elementlar
// orasi 16. Sarlavha — Helvetica Neue 32px uppercase, markazda; tavsif —
// 16px kulrang, markazda. Mobil: chetlaridan 12px, p-12, sarlavha 20px.
//
// Modal markazda ochiladi va yengil kattalashib chiqadi (`modal-in`).
// ─────────────────────────────────────────────────────────────────────────────
export default function Modal({
    open,
    onClose,
    title,
    description,
    children,
    footer,
    width = 'max-w-[550px]',
}) {
    useEffect(() => {
        if (!open) return

        const { overflow } = document.body.style
        document.body.style.overflow = 'hidden'

        function onKey(e) {
            if (e.key === 'Escape') onClose?.()
        }
        document.addEventListener('keydown', onKey)

        return () => {
            document.body.style.overflow = overflow
            document.removeEventListener('keydown', onKey)
        }
    }, [open, onClose])

    if (!open) return null

    return (
        <div
            className="fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-[12px]"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                className={`modal-in custom-scrollbar max-h-[90vh] w-full ${width} overflow-y-auto rounded-[6px] bg-white p-[12px] lg:p-[24px]`}
            >
                <div className="relative flex flex-col gap-[12px] lg:gap-[16px]">
                    {/* Yopish tugmasi sarlavha qatorining o'ng chekkasida turadi */}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Закрыть"
                        className="absolute top-0 right-0 cursor-pointer text-black transition-opacity hover:opacity-70"
                    >
                        <X size={24} strokeWidth={2} />
                    </button>

                    {title && (
                        <h2 className="font-display px-[32px] text-center text-[20px] leading-[26px] text-black uppercase lg:text-[32px] lg:leading-[38px]">
                            {title}
                        </h2>
                    )}

                    {description && (
                        /* Figma'da tavsif ustuni tor — matn ikki qatorga bo'linadi */
                        <p className="mx-auto max-w-[400px] text-center text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[26px]">
                            {description}
                        </p>
                    )}

                    {children}

                    {footer && <div className="flex flex-col gap-[12px] lg:gap-[16px]">{footer}</div>}
                </div>
            </div>
        </div>
    )
}

// Modal ichidagi tugmalar — Figma'da to'liq kenglikda, balandligi 54px
// (mobilda 44px). `primary` — gold fon, `secondary` — gold 15%.
export function ModalButton({ children, onClick, variant = 'primary', type = 'button', disabled }) {
    const styles =
        variant === 'primary'
            ? 'bg-gold text-white hover:bg-gold/90'
            : 'bg-gold/15 text-gold hover:bg-gold/25'

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`flex w-full cursor-pointer items-center justify-center rounded-[6px] px-[24px] py-[12px] text-[14px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 lg:py-[16px] lg:text-[18px] ${styles}`}
        >
            {children}
        </button>
    )
}
