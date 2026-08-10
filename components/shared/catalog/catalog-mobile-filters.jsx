'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { FilterActions, FilterField } from '@/components/shared/catalog/catalog-filters'

// ─────────────────────────────────────────────────────────────────────────────
// Mobil filtr oynalari (faqat 1024px'gacha).
//   · barcha maydonlar — Figma 360:22138 / 360:22218 (pastda yopishgan tugmalar)
//   · bitta maydon     — Figma 360:21739 (chipdan ochiladi)
//
// Ikkalasi ham pastdan sirg'alib chiqadi, orqa fon qorayadi va sahifa
// aylanmaydi. Esc yoki fonga bosish yopadi.
// ─────────────────────────────────────────────────────────────────────────────

function Sheet({ onClose, children, full = false }) {
    useEffect(() => {
        const { overflow } = document.body.style
        document.body.style.overflow = 'hidden'

        function onKeyDown(e) {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', onKeyDown)

        return () => {
            document.body.style.overflow = overflow
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [onClose])

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
            <button
                type="button"
                aria-label="Закрыть"
                onClick={onClose}
                className="fade-in absolute inset-0 cursor-default bg-black/25"
            />

            <div
                className={`sheet-up relative flex flex-col rounded-t-[6px] bg-white ${
                    full ? 'max-h-full' : ''
                }`}
            >
                {children}
            </div>
        </div>
    )
}

// Barcha maydonlar — sarlavha, aylanadigan ro'yxat va yopishgan tugmalar.
export function AllFiltersSheet({ fields, values, onChange, onSubmit, onReset, onClose }) {
    return (
        <Sheet onClose={onClose} full>
            <div className="flex items-center justify-between p-[12px] pb-0">
                <p className="font-display text-[24px] font-medium text-black uppercase">
                    Фильтры
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Закрыть"
                    className="cursor-pointer p-[2px] text-black"
                >
                    <X size={24} strokeWidth={2} />
                </button>
            </div>

            <div className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-[12px] overflow-y-auto p-[12px]">
                {fields.map((field) => (
                    <React.Fragment key={field.key}>
                        <FilterField field={field} values={values} onChange={onChange} />
                        <span className="h-px w-full bg-black/8" />
                    </React.Fragment>
                ))}
            </div>

            {/* Figma 360:22218 — tugmalar pastda yopishib turadi, yonma-yon */}
            <div className="flex shrink-0 items-center gap-[12px] border-t border-black/8 p-[12px] [&>button]:min-w-0 [&>button]:flex-1">
                <FilterActions
                    onSubmit={() => {
                        onSubmit()
                        onClose()
                    }}
                    onReset={onReset}
                />
            </div>
        </Sheet>
    )
}

// Bitta maydon — chipdan ochiladi (Figma 360:21739).
export function FieldSheet({ field, values, onChange, onClose }) {
    return (
        <Sheet onClose={onClose}>
            <div className="flex items-center justify-between p-[12px] pb-0">
                <p className="text-[14px] font-medium text-black">{field.label}</p>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Закрыть"
                    className="cursor-pointer p-[2px] text-black"
                >
                    <X size={24} strokeWidth={2} />
                </button>
            </div>

            {/* Sarlavha yuqorida turibdi — maydonnikini takrorlamaymiz */}
            <div className="p-[12px]">
                <FilterField field={field} values={values} onChange={onChange} hideLabel />
            </div>
        </Sheet>
    )
}
