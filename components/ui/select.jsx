'use client'

import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'

// Custom dropdown — native <select> Figma dizayniga to'g'ri kelmaydi.
// options: [{ label, value }]
export default function Select({
    label,
    value,
    options = [],
    placeholder = 'Выберите',
    error,
    onChange,
    className = '',
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        function onOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', onOutside)
        return () => document.removeEventListener('mousedown', onOutside)
    }, [])

    const selected = options.find((o) => o.value === value)

    return (
        <div className={`flex w-full flex-col gap-2 ${className}`} ref={ref}>
            {label && <span className="text-sm text-grey">{label}</span>}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className={[
                        'flex h-12 w-full items-center justify-between gap-3 rounded-[12px] border bg-white px-4',
                        'text-left text-base transition-colors duration-200 hover:border-gold',
                        error ? 'border-danger' : 'border-black/15',
                        selected ? 'text-black' : 'text-grey/60',
                    ].join(' ')}
                >
                    <span className="truncate">{selected?.label || placeholder}</span>
                    <IoIosArrowDown
                        className={`shrink-0 text-grey transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    />
                </button>

                {open && (
                    <div className="custom-scrollbar absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-[12px] border border-black/10 bg-white py-2 shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
                        {options.length === 0 && (
                            <p className="px-4 py-3 text-sm text-grey">Нет вариантов</p>
                        )}
                        {options.map((o) => (
                            <button
                                key={o.value}
                                type="button"
                                onClick={() => {
                                    onChange?.(o.value)
                                    setOpen(false)
                                }}
                                className={`block w-full px-4 py-3 text-left text-base transition-colors duration-150 hover:bg-light-white ${
                                    o.value === value ? 'text-gold' : 'text-black'
                                }`}
                            >
                                {o.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {error && <span className="text-sm text-danger">{error}</span>}
        </div>
    )
}
