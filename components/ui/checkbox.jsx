'use client'

import React from 'react'
import { FiCheck } from 'react-icons/fi'

export default function Checkbox({ label, checked, onChange, count, disabled }) {
    return (
        <label
            className={`flex cursor-pointer items-center gap-3 select-none ${
                disabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
        >
            <input
                type="checkbox"
                className="sr-only"
                checked={Boolean(checked)}
                disabled={disabled}
                onChange={(e) => onChange?.(e.target.checked)}
            />
            <span
                className={[
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors duration-150',
                    checked ? 'border-gold bg-gold text-white' : 'border-black/25 bg-white',
                ].join(' ')}
            >
                {checked && <FiCheck size={14} />}
            </span>
            <span className="flex-1 text-base text-black">{label}</span>
            {count != null && <span className="text-sm text-grey">{count}</span>}
        </label>
    )
}
