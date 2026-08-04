'use client'

import React from 'react'

export default function Radio({ label, description, checked, onChange, name }) {
    return (
        <label className="flex cursor-pointer items-start gap-3 select-none">
            <input
                type="radio"
                name={name}
                className="sr-only"
                checked={Boolean(checked)}
                onChange={() => onChange?.(true)}
            />
            <span
                className={[
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-150',
                    checked ? 'border-gold' : 'border-black/25',
                ].join(' ')}
            >
                {checked && <span className="h-2.5 w-2.5 rounded-full bg-gold" />}
            </span>
            <span className="flex flex-col">
                <span className="text-base text-black">{label}</span>
                {description && <span className="text-sm text-grey">{description}</span>}
            </span>
        </label>
    )
}
