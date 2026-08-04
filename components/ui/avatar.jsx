import React from 'react'
import Image from 'next/image'
import { initials } from '@/lib/format'

const SIZES = { sm: 32, md: 48, lg: 64, xl: 96 }

export default function Avatar({ src, name = '', size = 'md', className = '' }) {
    const px = SIZES[size] || SIZES.md

    return (
        <span
            className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-light-white text-grey ${className}`}
            style={{ width: px, height: px }}
        >
            {src ? (
                <Image src={src} alt={name} fill sizes={`${px}px`} className="object-cover" />
            ) : (
                <span className="text-sm font-medium">{initials(name)}</span>
            )}
        </span>
    )
}
