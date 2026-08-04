'use client'

import React from 'react'
import { FiSearch, FiX } from 'react-icons/fi'

export default function SearchInput({
    value,
    onChange,
    placeholder = 'Поиск по имени, городу, категории...',
    className = '',
}) {
    return (
        <div className={`relative ${className}`}>
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-grey" size={20} />
            <input
                value={value || ''}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                className="h-12 w-full rounded-[12px] border border-black/15 bg-white pl-12 pr-10 text-base text-black outline-none transition-colors duration-200 placeholder:text-grey/60 focus:border-gold"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange?.('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-grey hover:text-black"
                    aria-label="Очистить"
                >
                    <FiX size={18} />
                </button>
            )}
        </div>
    )
}
