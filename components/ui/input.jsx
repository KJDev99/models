'use client'

import React, { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

// Figma: "Введите пароль" (85:1371) — eye / eye-off ikonkalari bilan.
export default function Input({
    label,
    hint,
    error,
    type = 'text',
    className = '',
    required,
    ...rest
}) {
    const [show, setShow] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && show ? 'text' : type

    return (
        <label className={`flex w-full flex-col gap-2 ${className}`}>
            {label && (
                <span className="text-sm text-grey">
                    {label}
                    {required && <span className="text-danger"> *</span>}
                </span>
            )}

            <span className="relative block">
                <input
                    type={inputType}
                    className={[
                        'h-12 w-full rounded-[12px] border bg-white px-4 text-base text-black',
                        'placeholder:text-grey/60 outline-none transition-colors duration-200',
                        'focus:border-gold disabled:bg-light-white disabled:text-grey',
                        error ? 'border-danger' : 'border-black/15',
                        isPassword ? 'pr-12' : '',
                    ].join(' ')}
                    {...rest}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-grey hover:text-black"
                        aria-label={show ? 'Скрыть пароль' : 'Показать пароль'}
                    >
                        {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                )}
            </span>

            {error && <span className="text-sm text-danger">{error}</span>}
            {!error && hint && <span className="text-sm text-grey/80">{hint}</span>}
        </label>
    )
}
