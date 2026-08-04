'use client'

import React from 'react'
import { FiStar } from 'react-icons/fi'

// Отзывы (Figma: Оставить отзыв 320:11329) — ko'rsatish va tanlash rejimi.
export default function Rating({ value = 0, max = 5, size = 20, editable = false, onChange }) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: max }).map((_, i) => {
                const filled = i < Math.round(value)
                const star = (
                    <FiStar
                        size={size}
                        className={filled ? 'fill-gold text-gold' : 'text-black/20'}
                    />
                )
                return editable ? (
                    <button
                        key={i}
                        type="button"
                        onClick={() => onChange?.(i + 1)}
                        className="cursor-pointer"
                        aria-label={`Оценка ${i + 1}`}
                    >
                        {star}
                    </button>
                ) : (
                    <span key={i}>{star}</span>
                )
            })}
        </div>
    )
}
