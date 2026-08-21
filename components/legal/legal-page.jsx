'use client'

import React, { useCallback } from 'react'
import Container from '@/components/ui/container'
import Breadcrumb from '@/components/ui/breadcrumb'
import { useApi } from '@/lib/use-api'
import * as site from '@/lib/api/site'

// ─────────────────────────────────────────────────────────────────────────────
// Huquqiy hujjatlar — futerdagi «Пользовательское соглашение» va «Политика
// конфиденциальности» havolalari. Figma'da alohida freym chizilmagan, shuning
// uchun matn sahifasi «Контакты» qolipida: yo'lakcha → sarlavha → matn.
//
// Manba: GET /site/legal/{slug}?locale=ru (backend/site.md).
// Matn oddiy matn bo'lib keladi — bo'sh qatorlar bo'yicha abzatslarga bo'linadi.
// ─────────────────────────────────────────────────────────────────────────────
export default function LegalPage({ slug, title }) {
    const fetcher = useCallback(() => site.legal(slug), [slug])
    const { data, loading, error } = useApi(fetcher, { enabled: Boolean(slug) })

    const heading = data?.title || title

    return (
        <Container className="flex flex-col gap-[16px] py-[16px] lg:gap-[24px] lg:py-[24px]">
            <Breadcrumb items={[{ name: 'Главная', href: '/' }, { name: heading }]} />

            <h1 className="font-display text-[24px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:tracking-[0.64px]">
                {heading}
            </h1>

            {loading && <div className="h-[400px] animate-pulse rounded-[6px] bg-black/5" />}

            {!loading && (
                <div className="flex flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:p-[24px]">
                    {error ? (
                        <p className="text-[14px] text-grey lg:text-[16px]">{error.message}</p>
                    ) : (
                        paragraphs(data?.body).map((text, i) => (
                            <p
                                key={i}
                                className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]"
                            >
                                {text}
                            </p>
                        ))
                    )}
                </div>
            )}
        </Container>
    )
}

function paragraphs(body) {
    if (!body) return ['Документ пока не заполнен.']
    return String(body)
        .split(/\n\s*\n|\n/)
        .map((line) => line.trim())
        .filter(Boolean)
}
