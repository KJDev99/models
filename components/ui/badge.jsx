import React from 'react'

export default function Badge({ children, className = '' }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${className || 'bg-light-white text-grey'}`}
        >
            {children}
        </span>
    )
}
