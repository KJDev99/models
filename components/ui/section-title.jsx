import React from 'react'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

// Bosh sahifadagi bo'lim sarlavhasi + "смотреть все" havolasi.
export default function SectionTitle({ title, subtitle, href, hrefLabel = 'Смотреть все' }) {
    return (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 lg:mb-8">
            <div>
                <h2 className="text-[28px] leading-tight font-medium text-black lg:text-[44px]">
                    {title}
                </h2>
                {subtitle && <p className="mt-2 text-base text-grey">{subtitle}</p>}
            </div>
            {href && (
                <Link
                    href={href}
                    className="inline-flex items-center gap-2 text-base text-gold transition-opacity hover:opacity-80"
                >
                    {hrefLabel}
                    <FiArrowRight />
                </Link>
            )}
        </div>
    )
}
