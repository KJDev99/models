'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Heart } from 'lucide-react'
import CatalogToolbar from '@/components/shared/catalog/catalog-toolbar'
import AgencyExecutorCard from '@/components/agencies/[slug]/agency-executor-card'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'

// ─────────────────────────────────────────────────────────────────────────────
// «Исполнители» — Figma 164:13904 (desktop) va 377:14960 ichidagi mobil variant.
//
// Qidiruv qatori umumiy `CatalogToolbar` dan olinadi (Figma 270:24468 —
// katalogdagi bilan bir xil). Ostida turlar bo'yicha tablar, keyin to'rt
// ustunli setka va «Показать ещё».
//
// Izoh: Figma'da bu bo'limning ro'yxat holati chizilmagan — almashtirgich
// bosilganda kataloglardagi qator uslubi ishlatiladi.
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

// Ro'yxat ko'rinishidagi qator — kataloglardagi qatorlar bilan bir uslubda.
function ExecutorRow({ executor }) {
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const liked = items.some(
        (i) => i.type === FAVORITE_TYPES.EXECUTOR && i.id === executor.href,
    )

    function onLike() {
        toggle({
            type: FAVORITE_TYPES.EXECUTOR,
            id: executor.href,
            slug: executor.href,
            title: executor.name,
            image: executor.image,
        })
    }

    return (
        <article className="flex items-center gap-[12px] rounded-[6px] bg-white p-[12px] lg:gap-[16px] lg:p-[24px]">
            <Link
                href={executor.href}
                className="relative block size-[40px] shrink-0 overflow-hidden rounded-full bg-[#d9d9d9] lg:size-[94px] lg:rounded-[6px]"
            >
                <Image
                    src={executor.image}
                    alt={executor.name}
                    fill
                    sizes="94px"
                    className="object-cover"
                />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-[8px] lg:gap-[12px]">
                <Link
                    href={executor.href}
                    className="truncate text-[16px] font-medium text-black transition-colors hover:text-gold"
                >
                    {executor.name}
                </Link>

                <div className="flex flex-wrap gap-[8px] lg:gap-[12px]">
                    <span className="flex items-center justify-center rounded-[6px] bg-gold/15 px-[12px] py-[8px] text-[12px] font-medium whitespace-nowrap text-gold lg:text-[14px]">
                        {executor.type}
                    </span>
                    {executor.chips.map((chip) => (
                        <span
                            key={chip}
                            className="flex items-center justify-center rounded-[6px] bg-light-white px-[12px] py-[8px] text-[12px] font-medium whitespace-nowrap text-grey lg:text-[14px]"
                        >
                            {chip}
                        </span>
                    ))}
                </div>
            </div>

            <button
                type="button"
                onClick={onLike}
                aria-label={liked ? 'Убрать из избранного' : 'В избранное'}
                className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] ui-icon-btn"
            >
                <Heart
                    size={24}
                    strokeWidth={2}
                    className={liked ? 'fill-current' : ''}
                />
            </button>
        </article>
    )
}

export default function AgencyExecutors({ executors, tabs, step, sortOptions }) {
    const [tab, setTab] = useState(tabs[0].key)
    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState(sortOptions[0].value)
    const [view, setView] = useState('grid')
    const [limit, setLimit] = useState(step)

    const found = useMemo(() => {
        const query = search.trim().toLowerCase()
        const list = executors.filter((item) => {
            if (tab !== 'all' && item.kind !== tab) return false
            if (query && !item.name.toLowerCase().includes(query)) return false
            return true
        })
        if (sort === 'name-asc') return [...list].sort((a, b) => a.name.localeCompare(b.name, 'ru'))
        if (sort === 'new') return [...list].reverse()
        return list
    }, [executors, tab, search, sort])

    const visible = found.slice(0, limit)
    const hasMore = found.length > limit

    function changeTab(key) {
        setTab(key)
        setLimit(step)
    }

    function submitSearch() {
        setSearch(searchInput)
        setLimit(step)
    }

    return (
        <section className="flex flex-col gap-[16px] lg:gap-[32px]">
            <h2 className="font-display text-[24px] leading-[26px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:leading-none lg:tracking-[0.64px]">
                Исполнители
            </h2>

            <div className="flex flex-col gap-[16px] lg:gap-[24px]">
                <CatalogToolbar
                    fields={[]}
                    sortOptions={sortOptions}
                    searchPlaceholder="Имя / ключевые слова"
                    search={searchInput}
                    onSearchChange={setSearchInput}
                    onSearchSubmit={submitSearch}
                    sort={sort}
                    onSortChange={setSort}
                    view={view}
                    onViewChange={setView}
                    values={{}}
                    onClearField={() => {}}
                    onOpenAllFilters={() => {}}
                    onOpenField={() => {}}
                />

                <TabSelect tabs={tabs} active={tab} onChange={changeTab} />

                {/* Desktop tablari — Figma 164:13907 */}
                <div className="hidden flex-wrap gap-[16px] lg:flex">
                    {tabs.map((item) => {
                        const on = item.key === tab
                        return (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => changeTab(item.key)}
                                aria-pressed={on}
                                className={`flex cursor-pointer items-center gap-[12px] rounded-[6px] px-[16px] py-[16px] text-[16px] leading-[20px] transition-colors ${
                                    on
                                        ? 'bg-gold text-white'
                                        : 'border border-gold bg-white text-gold hover:bg-gold/10'
                                }`}
                            >
                                {item.label}
                                <span className={on ? 'text-white/70' : 'text-gold/70'}>
                                    ({item.count})
                                </span>
                            </button>
                        )
                    })}
                </div>

                {visible.length === 0 ? (
                    <div className="flex flex-col items-center gap-[12px] rounded-[6px] bg-white p-[40px] text-center">
                        <p className="text-[16px] font-medium text-black lg:text-[18px]">
                            Ничего не найдено
                        </p>
                        <p className="text-[14px] text-grey lg:text-[16px]">
                            Попробуйте изменить запрос или выбрать другую категорию.
                        </p>
                    </div>
                ) : view === 'grid' ? (
                    <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-[16px]">
                        {visible.map((item) => (
                            <AgencyExecutorCard key={item.id} executor={item} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                        {visible.map((item) => (
                            <ExecutorRow key={item.id} executor={item} />
                        ))}
                    </div>
                )}

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
