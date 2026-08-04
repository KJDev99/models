import React from 'react'

export default function Spinner({ size = 24, className = '' }) {
    return (
        <span
            className={`inline-block animate-spin rounded-full border-2 border-gold border-t-transparent ${className}`}
            style={{ width: size, height: size }}
            role="status"
            aria-label="Загрузка"
        />
    )
}
