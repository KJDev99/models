'use client'

import React from 'react'

// items: [{ label, value, count? }]
export default function Tabs({ items = [], value, onChange, className = '' }) {
    return (
        <div className={`scrollbar-hide flex gap-2 overflow-x-auto ${className}`}>
            {items.map((item) => (
                <button
                    key={item.value}
                    type="button"
                    onClick={() => onChange?.(item.value)}
                    className={[
                        'shrink-0 rounded-full px-5 py-2.5 text-base whitespace-nowrap transition-colors duration-150',
                        item.value === value
                            ? 'bg-gold text-white'
                            : 'bg-light-white text-grey hover:text-black',
                    ].join(' ')}
                >
                    {item.label}
                    {item.count != null && (
                        <span className="ml-2 opacity-70">{item.count}</span>
                    )}
                </button>
            ))}
        </div>
    )
}
