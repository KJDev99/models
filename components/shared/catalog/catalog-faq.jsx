'use client'

import React, { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import Container from '@/components/ui/container'

// ─────────────────────────────────────────────────────────────────────────────
// «Частые вопросы» — Figma 320:11866 (Модели) / 93:8181 (Фотографы).
// Desktop: ikkita ustun (662px), har birida ikkita savol, oralari 16px.
// Mobil: bitta ustun. Savol yopiq holatda «+», ochiqda «−».
// ─────────────────────────────────────────────────────────────────────────────

function FaqItem({ item, open, onToggle }) {
    return (
        <div className="rounded-[6px] bg-white">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="flex w-full cursor-pointer items-center justify-between gap-[16px] p-[12px] text-left lg:px-[16px] lg:py-[16px]"
            >
                <span className="text-[14px] leading-[20px] font-medium text-black lg:text-[16px] lg:leading-[24px]">
                    {item.q}
                </span>

                <span className="flex size-[32px] shrink-0 items-center justify-center rounded-[6px] bg-gold text-white lg:size-[40px]">
                    {open ? (
                        <Minus size={24} strokeWidth={2} />
                    ) : (
                        <Plus size={24} strokeWidth={2} />
                    )}
                </span>
            </button>

            {open && (
                <p className="menu-in px-[12px] pb-[16px] text-[14px] leading-[20px] text-grey lg:px-[16px] lg:pb-[24px] lg:text-[16px] lg:leading-[24px]">
                    {item.a}
                </p>
            )}
        </div>
    )
}

export default function CatalogFaq({ items }) {
    const [openIndex, setOpenIndex] = useState(null)

    // Figma'da savollar ustunlar bo'ylab tikka taqsimlangan: 1–3 chapda, 2–4 o'ngda.
    const columns = [
        items.filter((_, i) => i % 2 === 0),
        items.filter((_, i) => i % 2 === 1),
    ]

    return (
        <Container as="section" className="flex flex-col gap-[16px] lg:gap-[32px]">
            <h2 className="font-display text-[24px] leading-[26px] tracking-[0.48px] text-black uppercase lg:text-[48px] lg:leading-none lg:tracking-[0.96px]">
                Частые вопросы
            </h2>

            <div className="flex flex-col gap-[12px] lg:flex-row lg:gap-[16px]">
                {columns.map((column, ci) => (
                    <div key={ci} className="flex min-w-0 flex-1 flex-col gap-[12px] lg:gap-[16px]">
                        {column.map((item) => {
                            const index = items.indexOf(item)
                            return (
                                <FaqItem
                                    key={item.q}
                                    item={item}
                                    open={openIndex === index}
                                    onToggle={() =>
                                        setOpenIndex(openIndex === index ? null : index)
                                    }
                                />
                            )
                        })}
                    </div>
                ))}
            </div>
        </Container>
    )
}
