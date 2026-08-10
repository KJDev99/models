'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Calendar, ChevronDown } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Filtr maydonlari — barcha kataloglar (Модели, Фотографы, Видеографы …) uchun
// umumiy. Maydonlar ro'yxati `fields` prop orqali beriladi, ko'rinish bir xil.
//
// Bir xil ko'rinish uch joyda ishlatiladi:
//   · desktop yon panel      — Figma 81:3003 / 93:6637
//   · mobil «Фильтры» oynasi — Figma 360:22138
//   · mobil bitta maydon     — Figma 360:21739
//
// Maydon foni light-white (#f8f8f8), radius 6px, ichki bo'shliq 16px.
// ─────────────────────────────────────────────────────────────────────────────

// Raqamli maydon: «от 18» — prefiks kulrang, qiymat qora.
function RangeInput({ prefix, placeholder, value, onChange }) {
    return (
        <label className="flex min-w-0 flex-1 items-center justify-center gap-[6px] rounded-[6px] bg-light-white p-[16px] text-[16px]">
            <span className="text-grey">{prefix}</span>
            {/* `type="text"` + inputMode: raqam klaviaturasi chiqadi, lekin
                spinner va g'ildirak bilan o'zgarish bo'lmaydi. */}
            <input
                type="text"
                inputMode="numeric"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ''))}
                className="w-full min-w-0 bg-transparent text-black outline-none placeholder:text-black"
            />
        </label>
    )
}

// Sana maydoni: «С 18 июня» — prefiks kulrang, o'ng chekkada kalendar ikonkasi
// (Figma 145:11249 — Проекты filtridagi «Дата съемки»).
//
// Bo'sh `type="date"` brauzerning «mm/dd/yyyy» matnini ko'rsatadi, Figma'da esa
// «18 июня» turibdi. Shuning uchun maydon bo'sh va fokusda bo'lmaganda oddiy
// matn maydoni sifatida chiziladi — Забронировать oynasidagi kabi.
function DateInput({ prefix, placeholder, value, onChange }) {
    const [focused, setFocused] = useState(false)

    return (
        <label className="relative flex items-center gap-[6px] rounded-[6px] bg-light-white p-[16px] text-[16px]">
            <span className="shrink-0 text-grey">{prefix}</span>
            <input
                type={focused || value ? 'date' : 'text'}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full min-w-0 cursor-pointer bg-transparent text-black outline-none placeholder:text-black [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
            />
            <Calendar
                size={24}
                strokeWidth={2}
                aria-hidden
                className="pointer-events-none shrink-0 text-black"
            />
        </label>
    )
}

function Select({ field, value, onChange }) {
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

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full cursor-pointer items-center justify-between gap-[8px] rounded-[6px] bg-light-white p-[16px] text-left"
            >
                <span className={`truncate text-[16px] ${value ? 'text-black' : 'text-grey'}`}>
                    {selected?.label || field.placeholder}
                </span>
                <ChevronDown
                    size={24}
                    strokeWidth={2}
                    className={`shrink-0 text-black transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {open && (
                <div className="menu-in custom-scrollbar absolute top-full right-0 left-0 z-30 mt-[8px] max-h-[240px] overflow-y-auto rounded-[6px] bg-white py-[8px] shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
                    {field.options.map((o) => (
                        <button
                            key={o.value || o.label}
                            type="button"
                            onClick={() => {
                                onChange(o.value)
                                setOpen(false)
                            }}
                            className={`block w-full px-[16px] py-[10px] text-left text-[16px] transition-colors hover:bg-light-white ${
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

// Bitta filtr guruhi: sarlavha + maydon(lar).
export function FilterField({ field, values, onChange, hideLabel = false }) {
    return (
        <div className="flex flex-col justify-center gap-[12px]">
            {!hideLabel && <p className="text-[14px] font-medium text-black">{field.label}</p>}

            {field.kind === 'range' ? (
                <div className="flex items-center gap-[16px]">
                    <RangeInput
                        prefix={field.from.prefix}
                        placeholder={field.from.placeholder}
                        value={values[field.from.key] ?? ''}
                        onChange={(v) => onChange({ [field.from.key]: v })}
                    />
                    <RangeInput
                        prefix={field.to.prefix}
                        placeholder={field.to.placeholder}
                        value={values[field.to.key] ?? ''}
                        onChange={(v) => onChange({ [field.to.key]: v })}
                    />
                </div>
            ) : field.kind === 'dateRange' ? (
                /* Sanalar ustma-ust turadi (Figma 145:11249) */
                <div className="flex flex-col gap-[8px]">
                    <DateInput
                        prefix={field.from.prefix}
                        placeholder={field.from.placeholder}
                        value={values[field.from.key] ?? ''}
                        onChange={(v) => onChange({ [field.from.key]: v })}
                    />
                    <DateInput
                        prefix={field.to.prefix}
                        placeholder={field.to.placeholder}
                        value={values[field.to.key] ?? ''}
                        onChange={(v) => onChange({ [field.to.key]: v })}
                    />
                </div>
            ) : (
                <Select
                    field={field}
                    value={values[field.key] ?? ''}
                    onChange={(v) => onChange({ [field.key]: v })}
                />
            )}
        </div>
    )
}

// Ikkala tugma — «Найти» (gold) va «Сброс» (gold 15%).
export function FilterActions({ onSubmit, onReset, className = '' }) {
    return (
        <>
            <button
                type="button"
                onClick={onSubmit}
                className={`group relative flex w-full cursor-pointer items-center justify-center gap-[12px] overflow-hidden rounded-[6px] bg-gold px-[24px] py-[16px] text-[18px] font-medium text-white ${className}`}
            >
                <span
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-0 h-[216px] w-[34px] -translate-x-[200%] -translate-y-1/2 rotate-[50.56deg] bg-white/25 blur-[6.25px] transition-transform duration-700 ease-out group-hover:translate-x-[600%]"
                />
                <span className="relative">Найти</span>
                <ArrowUpRight size={24} strokeWidth={2} className="relative" />
            </button>

            <button
                type="button"
                onClick={onReset}
                className="flex w-full cursor-pointer items-center justify-center rounded-[6px] bg-gold/15 px-[24px] py-[16px] text-[18px] font-medium text-gold transition-colors hover:bg-gold/25"
            >
                Сброс
            </button>
        </>
    )
}

// Desktop yon panel (Figma 81:3003 / 93:6637 — 323px, oq fon, radius 6, p-24).
// Агентства katalogida filtrlar umuman yo'q (Figma 155:12806) — panel chizilmaydi.
export default function CatalogFilters({ fields, values, onChange, onSubmit, onReset }) {
    if (!fields.length) return null

    return (
        <aside className="hidden w-[323px] shrink-0 flex-col justify-center gap-[16px] self-start rounded-[6px] bg-white p-[24px] lg:flex">
            <p className="font-display text-[24px] font-medium text-black uppercase">Фильтры</p>

            {fields.map((field) => (
                <React.Fragment key={field.key}>
                    <FilterField field={field} values={values} onChange={onChange} />
                    <span className="h-px w-full bg-black/8" />
                </React.Fragment>
            ))}

            <FilterActions onSubmit={onSubmit} onReset={onReset} />
        </aside>
    )
}
