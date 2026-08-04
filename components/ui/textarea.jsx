'use client'

import React from 'react'

export default function Textarea({
    label,
    hint,
    error,
    maxLength,
    value,
    className = '',
    required,
    ...rest
}) {
    return (
        <label className={`flex w-full flex-col gap-2 ${className}`}>
            {label && (
                <span className="flex items-center justify-between text-sm text-grey">
                    <span>
                        {label}
                        {required && <span className="text-danger"> *</span>}
                    </span>
                    {maxLength && (
                        <span className="text-grey/70">
                            {(value || '').length}/{maxLength}
                        </span>
                    )}
                </span>
            )}

            <textarea
                value={value}
                maxLength={maxLength}
                rows={5}
                className={[
                    'w-full resize-y rounded-[12px] border bg-white p-4 text-base text-black',
                    'placeholder:text-grey/60 outline-none transition-colors duration-200 focus:border-gold',
                    error ? 'border-danger' : 'border-black/15',
                ].join(' ')}
                {...rest}
            />

            {error && <span className="text-sm text-danger">{error}</span>}
            {!error && hint && <span className="text-sm text-grey/80">{hint}</span>}
        </label>
    )
}
