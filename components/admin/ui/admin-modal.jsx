'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Adminka modali — Figma 344:15552 («Отклонить профиль») va shu qolipdagi
// barcha oynalar: qora 25% fon, 550px oq panel, p-24, elementlar orasi 24;
// sarlavha markazda Helvetica Neue 36px uppercase, o'ngda ✕ (32px).
// Mobilda: chetlaridan 12px, p-12, sarlavha 24px, ✕ 24px.
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminModal({ open, title, onClose, children }) {
    useEffect(() => {
        if (!open) return

        const { overflow } = document.body.style
        document.body.style.overflow = 'hidden'

        function onKey(e) {
            if (e.key === 'Escape') onClose()
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
                className="modal-in custom-scrollbar flex max-h-[90vh] w-full max-w-[550px] flex-col gap-[16px] overflow-y-auto rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]"
            >
                {/* Yon ustunlar teng kenglikda — sarlavha ikki qatorga bo'linsa ham
                    markazda qoladi (Figma 344:15553). */}
                <div className="grid grid-cols-[24px_1fr_24px] items-start gap-[12px] lg:grid-cols-[32px_1fr_32px]">
                    <span aria-hidden />
                    <h2 className="font-display text-center text-[24px] leading-[28px] text-black uppercase lg:text-[36px] lg:leading-[44px]">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Закрыть"
                        className="flex size-[24px] cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-70 lg:size-[32px]"
                    >
                        <X size={32} strokeWidth={2} className="size-[24px] lg:size-[32px]" />
                    </button>
                </div>

                {children}
            </div>
        </div>
    )
}

// Modal ichidagi katta tugma (Figma 344:15573 / 344:15878).
export function AdminModalButton({ children, onClick, variant = 'primary', type = 'button' }) {
    const styles = {
        primary: 'bg-gold text-white hover:bg-[#c19754]',
        secondary: 'bg-[#f7f2e9] text-gold hover:bg-[#f1e8d8]',
        success: 'bg-[#44a400] text-white hover:bg-[#3b8f00]',
        danger: 'bg-[#e53b35] text-white hover:bg-[#cf332e]',
    }[variant]

    return (
        <button
            type={type}
            onClick={onClick}
            className={`relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-[6px] px-[24px] py-[12px] text-[14px] font-medium transition-colors lg:py-[16px] lg:text-[18px] ${
                variant === 'secondary' ? '' : 'ui-shine'
            } ${styles}`}
        >
            <span className="relative">{children}</span>
        </button>
    )
}

// Modal ostidagi izoh matni (Figma 344:16170).
export function AdminModalText({ children }) {
    return (
        <p className="text-center text-[14px] text-grey lg:text-[18px]">{children}</p>
    )
}

// Sabab yozish maydoni (Figma 344:15557).
export function AdminModalTextarea({ value, onChange, placeholder }) {
    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="h-[100px] w-full resize-none rounded-[6px] bg-light-white p-[16px] text-[14px] text-black outline-none placeholder:text-[#aaa] lg:text-[16px]"
        />
    )
}
