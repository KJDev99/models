'use client'

import React from 'react'

// Figma: "Видимость профиля" (334:14236) — anketani yashirish/ko'rsatish.
export default function Toggle({ label, description, checked, onChange, disabled }) {
    return (
        <label className="flex cursor-pointer items-center justify-between gap-4 select-none">
            <span className="flex flex-col">
                <span className="text-base text-black">{label}</span>
                {description && <span className="text-sm text-grey">{description}</span>}
            </span>
            <button
                type="button"
                role="switch"
                aria-checked={Boolean(checked)}
                disabled={disabled}
                onClick={() => onChange?.(!checked)}
                className={[
                    'relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200',
                    checked ? 'bg-gold' : 'bg-black/15',
                    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                ].join(' ')}
            >
                <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-200 ${
                        checked ? 'left-6' : 'left-1'
                    }`}
                />
            </button>
        </label>
    )
}
