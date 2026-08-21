'use client'

import React from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Yuklangan surat eskizi — forma sahifalarida bir xil ko'rinadi
// (Figma: «Площадка → Фотографии» 227:6084 albom kartochkalari).
//
// `src` ikki xil bo'lishi mumkin: `URL.createObjectURL()` dan kelgan blob
// (hali yuborilmagan fayl) yoki serverdagi manzil. Blob'ni `next/image`
// optimallashtira olmaydi, shuning uchun `unoptimized`.
// ─────────────────────────────────────────────────────────────────────────────
export default function PhotoThumb({ src, onRemove, alt = '' }) {
    if (!src) return null
    const isBlob = String(src).startsWith('blob:') || String(src).startsWith('data:')

    return (
        <span className="relative block size-[64px] shrink-0 overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:size-[80px]">
            <Image
                src={src}
                alt={alt}
                fill
                sizes="80px"
                className="object-cover"
                unoptimized={isBlob}
            />
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    aria-label="Удалить фото"
                    className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30 text-white opacity-0 transition-opacity hover:opacity-100"
                >
                    <X size={20} strokeWidth={2} />
                </button>
            )}
        </span>
    )
}

// Bir nechta eskiz uchun qator.
export function PhotoThumbs({ children }) {
    return <div className="flex flex-wrap gap-[12px] lg:gap-[16px]">{children}</div>
}
