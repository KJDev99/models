'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import Button from '@/components/ui/button'
import Container from '@/components/ui/container'
import { SEARCH_FIELDS } from '@/components/home/home-data'

// ─────────────────────────────────────────────────────────────────────────────
// Figma: qora qidiruv paneli — desktop 52:1297, mobil 373:17051.
// Desktop: 5 ta teng ustun (4 maydon + «Найти»), orasida vertikal chiziq.
// Mobil: maydonlar ustma-ust, orasida gorizontal chiziq.
// ─────────────────────────────────────────────────────────────────────────────

const RESOURCE_BY_DIRECTION = {
    model: '/models',
    photographer: '/photographers',
    videographer: '/videographers',
    venue: '/venues',
}

function SearchField({ field, value, onChange }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        function onOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', onOutside)
        return () => document.removeEventListener('mousedown', onOutside)
    }, [])

    const selected = field.options.find((o) => o.value === value)
    const isPlaceholder = !selected || !selected.value

    return (
        <div
            ref={ref}
            className="relative flex min-w-0 flex-1 flex-col justify-center gap-[8px] lg:gap-[12px]"
        >
            <p className="text-[12px] font-medium text-[#c7c7c7] lg:text-[14px]">{field.label}</p>

            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full cursor-pointer items-center justify-between gap-[8px] text-left"
            >
                <span
                    className={`truncate text-[14px] lg:text-[18px] ${
                        isPlaceholder ? 'text-[#a7a7a7]' : 'text-white'
                    }`}
                >
                    {selected?.label || field.placeholder}
                </span>
                <ChevronDown
                    size={24}
                    strokeWidth={2}
                    className={`shrink-0 text-white transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {open && (
                <div className="menu-in custom-scrollbar absolute top-full right-0 left-0 z-50 mt-[12px] max-h-[260px] overflow-y-auto rounded-[6px] bg-white py-[8px] shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                    {field.options.map((o) => (
                        <button
                            key={o.value || o.label}
                            type="button"
                            onClick={() => {
                                onChange(o.value)
                                setOpen(false)
                            }}
                            className={`block w-full px-[16px] py-[10px] text-left text-[14px] transition-colors hover:bg-light-white lg:text-[16px] ${
                                o.value === value ? 'text-gold' : 'text-black'
                            }`}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function SearchBar() {
    const router = useRouter()
    const [values, setValues] = useState({ direction: '', category: '', city: '', type: '' })

    function set(key) {
        return (value) => setValues((v) => ({ ...v, [key]: value }))
    }

    function submit() {
        const target = RESOURCE_BY_DIRECTION[values.direction] || '/models'
        const params = new URLSearchParams()
        if (values.category) params.set('category', values.category)
        if (values.city) params.set('city', values.city)
        if (values.type) params.set('type', values.type)
        const query = params.toString()
        router.push(query ? `${target}?${query}` : target)
    }

    return (
        <section className="w-full bg-black">
            <Container className="flex flex-col gap-[8px] py-[12px] lg:flex-row lg:items-center lg:gap-[16px] lg:py-[24px]">
                {SEARCH_FIELDS.map((field, i) => (
                    <React.Fragment key={field.key}>
                        {i > 0 && (
                            <>
                                {/* Mobil — gorizontal chiziq, desktop — vertikal */}
                                <span className="h-px w-full bg-white/20 lg:h-[52px] lg:w-px" />
                            </>
                        )}
                        <SearchField
                            field={field}
                            value={values[field.key]}
                            onChange={set(field.key)}
                        />
                    </React.Fragment>
                ))}

                <Button
                    onClick={submit}
                    variant="gold"
                    iconRight={<ArrowUpRight size={24} strokeWidth={2} />}
                    className="mt-[4px] w-full lg:mt-0 lg:min-w-0 lg:flex-1"
                >
                    Найти
                </Button>
            </Container>
        </section>
    )
}
