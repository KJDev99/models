'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown, LayoutGrid, List, Plus, Search, SlidersHorizontal, X } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Katalog boshqaruvi: qidiruv, saralash va ko'rinish almashtirgichi.
// Figma: desktop 90:5700 / 93:6686, mobil 360:23274 (chiplar bilan).
//
// Mobilda yon panel o'rniga gorizontal chiplar qatori turadi: chapda umumiy
// filtr tugmasi, keyin har bir maydon uchun chip. To'ldirilgan chip gold
// bo'ladi va ✕ bilan tozalanadi (Figma 360:23321).
// ─────────────────────────────────────────────────────────────────────────────

function SortSelect({ options, value, onChange }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        function onOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', onOutside)
        return () => document.removeEventListener('mousedown', onOutside)
    }, [])

    const selected = options.find((o) => o.value === value) || options[0]

    return (
        <div ref={ref} className="relative min-w-0 flex-1 lg:flex-none">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full cursor-pointer items-center justify-between gap-[12px] rounded-[6px] bg-white p-[12px] text-left lg:p-[16px]"
            >
                <span className="truncate text-[12px] text-grey lg:text-[16px]">
                    {selected.label}
                </span>
                <ChevronDown
                    size={20}
                    strokeWidth={2}
                    className={`size-[15px] shrink-0 text-black transition-transform duration-200 lg:size-[20px] ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {open && (
                <div className="menu-in absolute top-full right-0 left-0 z-30 mt-[8px] rounded-[6px] bg-white py-[8px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] lg:left-auto lg:min-w-[243px]">
                    {options.map((o) => (
                        <button
                            key={o.value}
                            type="button"
                            onClick={() => {
                                onChange(o.value)
                                setOpen(false)
                            }}
                            className={`block w-full px-[16px] py-[10px] text-left text-[14px] whitespace-nowrap transition-colors hover:bg-light-white lg:text-[16px] ${
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

function ViewToggle({ view, onChange }) {
    return (
        <div className="flex shrink-0 items-center gap-[12px] rounded-[8px] bg-white p-[12px] lg:gap-[16px] lg:p-[16px]">
            <button
                type="button"
                onClick={() => onChange('grid')}
                aria-label="Плиткой"
                aria-pressed={view === 'grid'}
                className={`cursor-pointer transition-colors ${
                    view === 'grid' ? 'text-gold' : 'text-black/40 hover:text-black'
                }`}
            >
                <LayoutGrid size={24} strokeWidth={2} className="size-[15px] lg:size-[24px]" />
            </button>
            <button
                type="button"
                onClick={() => onChange('list')}
                aria-label="Списком"
                aria-pressed={view === 'list'}
                className={`cursor-pointer transition-colors ${
                    view === 'list' ? 'text-gold' : 'text-black/40 hover:text-black'
                }`}
            >
                <List size={24} strokeWidth={2} className="size-[15px] lg:size-[24px]" />
            </button>
        </div>
    )
}

// ISO sanani chipda o'qishga qulay ko'rinishga keltiradi: 2026-07-18 → 18.07.2026
function humanDate(value) {
    const [y, m, d] = value.split('-')
    return d ? `${d}.${m}.${y}` : value
}

// Maydonning to'ldirilganini matnga aylantiradi: «до 80», «от 18 – до 60».
function fieldSummary(field, values) {
    if (field.kind === 'range' || field.kind === 'dateRange') {
        const show = (v) => (field.kind === 'dateRange' ? humanDate(v) : v)
        const from = values[field.from.key]
        const to = values[field.to.key]
        if (from && to)
            return `${field.from.prefix} ${show(from)} – ${field.to.prefix} ${show(to)}`
        if (from) return `${field.from.prefix} ${show(from)}`
        if (to) return `${field.to.prefix} ${show(to)}`
        return null
    }
    const option = field.options.find((o) => o.value === values[field.key])
    return values[field.key] && option ? option.label : null
}

export default function CatalogToolbar({
    fields,
    sortOptions,
    searchPlaceholder,
    search,
    onSearchChange,
    onSearchSubmit,
    sort,
    onSortChange,
    view,
    onViewChange,
    values,
    onClearField,
    onOpenAllFilters,
    onOpenField,
    // Агентства katalogida ko'rinish almashtirgichi yo'q (Figma 155:12806).
    showViewToggle = true,
}) {
    return (
        <div className="flex flex-col gap-[12px] lg:gap-[24px]">
            <div className="flex flex-col gap-[12px] lg:flex-row lg:items-center lg:gap-[16px]">
                {/* Qidiruv — o'ng chekkasida gold tugma (Figma 90:5712) */}
                <div className="relative min-w-0 flex-1">
                    <div className="flex items-center gap-[12px] rounded-[6px] bg-white p-[12px] pr-[51px] lg:p-[16px] lg:pr-[68px]">
                        <Search
                            size={20}
                            strokeWidth={2}
                            className="size-[15px] shrink-0 text-black lg:size-[20px]"
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                            placeholder={searchPlaceholder}
                            className="w-full min-w-0 bg-transparent text-[12px] text-black outline-none placeholder:text-[#aaa] lg:text-[16px]"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={onSearchSubmit}
                        aria-label="Найти"
                        className="ui-shine absolute top-1/2 right-0 flex size-[39px] -translate-y-1/2 cursor-pointer items-center justify-center overflow-hidden rounded-r-[6px] bg-gold text-white transition-colors hover:bg-[#c19754] lg:size-[52px]"
                    >
                        <Search
                            size={20}
                            strokeWidth={2}
                            className="relative size-[15px] lg:size-[20px]"
                        />
                    </button>
                </div>

                <div className="flex items-start gap-[12px] lg:items-center lg:gap-[16px]">
                    <SortSelect options={sortOptions} value={sort} onChange={onSortChange} />
                    {showViewToggle && <ViewToggle view={view} onChange={onViewChange} />}
                </div>
            </div>

            {/* Mobil filtr chiplari — Figma 360:23318 */}
            <div
                className={`scrollbar-hide -mx-[12px] flex items-start gap-[12px] overflow-x-auto px-[12px] lg:hidden ${
                    fields.length ? '' : 'hidden'
                }`}
            >
                <button
                    type="button"
                    onClick={onOpenAllFilters}
                    aria-label="Все фильтры"
                    className="flex shrink-0 cursor-pointer items-center rounded-[8px] bg-white p-[12px] text-black"
                >
                    <SlidersHorizontal size={17} strokeWidth={2} />
                </button>

                {fields.map((field) => {
                    const summary = fieldSummary(field, values)
                    return summary ? (
                        <button
                            key={field.key}
                            type="button"
                            onClick={() => onClearField(field)}
                            className="flex shrink-0 cursor-pointer items-center gap-[8px] rounded-[8px] bg-gold p-[12px] text-[14px] font-medium whitespace-nowrap text-white"
                        >
                            {summary}
                            <X size={17} strokeWidth={2} className="size-[17px]" />
                        </button>
                    ) : (
                        <button
                            key={field.key}
                            type="button"
                            onClick={() => onOpenField(field)}
                            className="flex shrink-0 cursor-pointer items-center gap-[8px] rounded-[8px] bg-white p-[12px] text-[14px] font-medium whitespace-nowrap text-grey"
                        >
                            <Plus size={17} strokeWidth={2} className="size-[17px]" />
                            {field.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
