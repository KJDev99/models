'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronDown, Play } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// «Портфолио» — Figma 129:6317 (Модели) / 129:7210 (Фотографы).
// Desktop: tablar qatori (aktivi gold fonda, qolganlari gold ramkada),
//          setka 4×N (323×250, oralig'i 16), pastda «Показать ещё».
// Mobil:   tablar o'rniga ochiladigan ro'yxat, setka 2 ustunli.
//
// `tabs` — [{key, label, count}], `items` — {tabKey: [{id, image}]}.
// ─────────────────────────────────────────────────────────────────────────────

function TabSelect({ tabs, active, onChange }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        function onOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', onOutside)
        return () => document.removeEventListener('mousedown', onOutside)
    }, [])

    const current = tabs.find((t) => t.key === active) || tabs[0]

    return (
        <div ref={ref} className="relative lg:hidden">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full cursor-pointer items-center justify-between gap-[12px] rounded-[6px] border border-gold bg-white p-[12px] text-left"
            >
                <span className="flex items-center gap-[12px] text-[14px] font-medium text-gold">
                    {current.label}
                    <span className="text-gold/70">({current.count})</span>
                </span>
                <ChevronDown
                    size={24}
                    strokeWidth={2}
                    className={`shrink-0 text-gold transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {open && (
                <div className="menu-in absolute top-full right-0 left-0 z-30 mt-[8px] rounded-[6px] bg-white py-[8px] shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => {
                                onChange(tab.key)
                                setOpen(false)
                            }}
                            className={`block w-full px-[16px] py-[10px] text-left text-[14px] transition-colors hover:bg-light-white ${
                                tab.key === active ? 'text-gold' : 'text-black'
                            }`}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

// `video` — kadr ustiga qoraytiruvchi qatlam va markazda play belgisi qo'yiladi
// (Figma 138:8030 — bg rgba(0,0,0,0.25), belgi 52px oq).
// `title` — Площадкиda bo'lim «Фотографии» deb ataladi (Figma 138:8498).
export default function DetailPortfolio({
    tabs,
    items,
    step,
    video = false,
    title = 'Портфолио',
}) {
    const [active, setActive] = useState(tabs[0].key)
    const [limit, setLimit] = useState(step)

    const list = useMemo(() => items[active] || [], [items, active])
    const visible = list.slice(0, limit)
    const hasMore = list.length > limit

    function changeTab(key) {
        setActive(key)
        setLimit(step)
    }

    return (
        <section className="flex flex-col gap-[16px] lg:gap-[32px]">
            <h2 className="font-display text-[24px] leading-[26px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:leading-none lg:tracking-[0.64px]">
                {title}
            </h2>

            <div className="flex flex-col gap-[16px] lg:gap-[24px]">
                <TabSelect tabs={tabs} active={active} onChange={changeTab} />

                {/* Desktop tablari */}
                <div className="hidden flex-wrap gap-[16px] lg:flex">
                    {tabs.map((tab) => {
                        const on = tab.key === active
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => changeTab(tab.key)}
                                aria-pressed={on}
                                className={`flex cursor-pointer items-center gap-[12px] rounded-[6px] px-[16px] py-[16px] text-[16px] leading-[20px] transition-colors ${
                                    on
                                        ? 'bg-gold text-white'
                                        : 'border border-gold bg-white text-gold hover:bg-gold/10'
                                }`}
                            >
                                {tab.label}
                                <span className={on ? 'text-white/70' : 'text-gold/70'}>
                                    ({tab.count})
                                </span>
                            </button>
                        )
                    })}
                </div>

                <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4 lg:gap-[16px]">
                    {visible.map((item) => (
                        <div
                            key={item.id}
                            className="group/tile relative h-[160px] overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:h-[250px]"
                        >
                            <Image
                                src={item.image}
                                alt=""
                                fill
                                sizes="(max-width: 1024px) 50vw, 323px"
                                className="object-cover transition-transform duration-500 group-hover/tile:scale-105"
                            />

                            {video && (
                                <>
                                    <span
                                        aria-hidden
                                        className="absolute inset-0 bg-black/25 transition-colors group-hover/tile:bg-black/40"
                                    />
                                    <span
                                        aria-hidden
                                        className="absolute top-1/2 left-1/2 flex size-[40px] -translate-x-1/2 -translate-y-1/2 items-center justify-center text-white transition-transform duration-300 group-hover/tile:scale-110 lg:size-[52px]"
                                    >
                                        <Play
                                            size={52}
                                            strokeWidth={1.5}
                                            className="size-[32px] fill-white lg:size-[42px]"
                                        />
                                    </span>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {hasMore && (
                    <button
                        type="button"
                        onClick={() => setLimit((v) => v + step)}
                        className="mx-auto flex w-full cursor-pointer items-center justify-center rounded-[6px] border border-gold px-[24px] py-[12px] text-[14px] font-medium text-gold transition-colors hover:bg-gold hover:text-white lg:w-[200px] lg:py-[16px] lg:text-[18px]"
                    >
                        Показать ещё
                    </button>
                )}
            </div>
        </section>
    )
}
