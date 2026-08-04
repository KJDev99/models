'use client'

import React from 'react'
import Link from 'next/link'

// Barcha auth ekranlarining oq kartochkasi.
export default function AuthCard({ title, description, children, footer, back }) {
    return (
        <section className="w-full max-w-[480px] rounded-[16px] bg-white p-6 lg:p-10">
            {back && (
                <Link
                    href={back}
                    className="mb-6 inline-block text-sm text-grey transition-colors hover:text-black"
                >
                    ← Назад
                </Link>
            )}

            <h1 className="text-[26px] leading-tight font-medium text-black lg:text-[32px]">
                {title}
            </h1>
            {description && <p className="mt-3 text-base text-grey">{description}</p>}

            <div className="mt-8">{children}</div>

            {footer && <div className="mt-6 text-center text-base text-grey">{footer}</div>}
        </section>
    )
}
