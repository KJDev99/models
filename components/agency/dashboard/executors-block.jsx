'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, LayoutGrid, List, MessageCircle, SquarePen } from 'lucide-react'
import { AdminRowMenu, AdminSearch, AdminSelect, AdminStatus } from '@/components/admin/ui/admin-ui'
import { USER_STATUS, userStatus } from '@/components/admin/ui/admin-statuses'
import { CabinetTitle } from '@/components/shared/cabinet/cabinet-ui'

// ─────────────────────────────────────────────────────────────────────────────
// «ИСПОЛНИТЕЛИ» bloki — Figma «LUMEN AGENCY» 270:20518, mobil 437:17337.
//
// Tepada qidiruv, holat tanlash va ko'rinish almashtirgichi, ostida turlar
// bo'yicha tablar va anketalar setkasi. Kartochka ochiq saytdagi agentlik
// sahifasidagi bilan bir xil (164:13989), farqi — yurakcha o'rnida qalam va
// «⋮», pastda esa holat va hisoblagichlar.
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
    { value: '', label: 'Все статусы' },
    ...Object.entries(USER_STATUS).map(([value, s]) => ({ value, label: s.label })),
]

export default function AgencyExecutorsBlock({
    executors,
    tabs,
    step,
    menuItems,
    emptyTitle,
    emptyText,
}) {
    const [tab, setTab] = useState(tabs[0].key)
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('')
    const [view, setView] = useState('grid')
    const [limit, setLimit] = useState(step)

    const found = useMemo(() => {
        const q = query.trim().toLowerCase()
        return executors.filter((item) => {
            if (tab !== 'all' && item.kind !== tab) return false
            if (status && item.status !== status) return false
            if (q && !item.name.toLowerCase().includes(q)) return false
            return true
        })
    }, [executors, tab, query, status])

    const visible = found.slice(0, limit)
    const hasMore = found.length > limit
    const empty = executors.length === 0

    return (
        <section className="flex flex-col gap-[16px] lg:gap-[24px]">
            <CabinetTitle>Исполнители</CabinetTitle>

            {empty ? (
                <div className="flex flex-col gap-[12px]">
                    <p className="text-[16px] font-semibold text-black lg:text-[18px]">
                        {emptyTitle}
                    </p>
                    <p className="text-[14px] text-grey lg:text-[16px]">{emptyText}</p>
                </div>
            ) : (
                <div className="flex flex-col gap-[16px]">
                    <div className="flex flex-col gap-[12px] lg:flex-row lg:items-center lg:gap-[16px]">
                        <AdminSearch
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Имя / ключевые слова"
                            variant="white"
                        />
                        <AdminSelect
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            options={STATUS_OPTIONS}
                            className="bg-white lg:w-[227px] lg:shrink-0"
                            variant="white"
                        />
                        <div className="hidden gap-[16px] rounded-[8px] bg-white p-[16px] lg:flex">
                            {[
                                { key: 'grid', icon: LayoutGrid, label: 'Сеткой' },
                                { key: 'list', icon: List, label: 'Списком' },
                            ].map((item) => {
                                const Icon = item.icon
                                return (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => setView(item.key)}
                                        aria-label={item.label}
                                        aria-pressed={view === item.key}
                                        className={`cursor-pointer transition-colors ${
                                            view === item.key ? 'text-gold' : 'text-black'
                                        }`}
                                    >
                                        <Icon size={24} strokeWidth={2} />
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-[12px] lg:gap-[16px]">
                        {tabs.map((item) => {
                            const on = item.key === tab
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => {
                                        setTab(item.key)
                                        setLimit(step)
                                    }}
                                    aria-pressed={on}
                                    className={`flex cursor-pointer items-center gap-[8px] rounded-[6px] px-[16px] py-[12px] text-[14px] font-medium transition-colors lg:gap-[12px] lg:p-[16px] lg:text-[16px] ${
                                        on
                                            ? 'bg-gold text-white'
                                            : 'border border-gold text-gold hover:bg-gold/10'
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
                        <p className="py-[24px] text-center text-[14px] text-grey lg:text-[16px]">
                            Ничего не найдено
                        </p>
                    ) : view === 'grid' ? (
                        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-[16px]">
                            {visible.map((item) => (
                                <ExecutorCard
                                    key={item.id}
                                    executor={item}
                                    menuItems={menuItems}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                            {visible.map((item) => (
                                <ExecutorRow key={item.id} executor={item} menuItems={menuItems} />
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
            )}
        </section>
    )
}

// Rasm ustidagi chip — ochiq saytdagi kartochka bilan bir xil (164:13993).
function Chip({ children }) {
    return (
        <span className="flex items-center justify-center rounded-[6px] bg-black/25 px-[12px] py-[8px] text-[12px] font-medium whitespace-nowrap text-white backdrop-blur-[2.5px] lg:text-[14px]">
            {children}
        </span>
    )
}

function Counters({ item, className = '' }) {
    return (
        <span className={`flex items-center gap-[16px] text-[12px] lg:text-[14px] ${className}`}>
            <span className="flex items-center gap-[8px]">
                <MessageCircle size={24} strokeWidth={2} className="size-[20px] lg:size-[24px]" />
                {item.comments}
            </span>
            <span className="flex items-center gap-[8px]">
                <Eye size={24} strokeWidth={2} className="size-[20px] lg:size-[24px]" />
                {item.views}
            </span>
        </span>
    )
}

// Setkadagi kartochka (Figma 270:20599).
function ExecutorCard({ executor, menuItems }) {
    const state = userStatus(executor.status)

    return (
        <article className="group relative flex h-[350px] w-full flex-col justify-between overflow-hidden rounded-[6px] bg-[#d9d9d9] p-[12px] lg:h-[400px] lg:p-[16px]">
            <Link href={executor.href} className="absolute inset-0" aria-label={executor.name}>
                <Image
                    src={executor.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 323px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Figma: gradient 55.222% → 88.889% */}
                <span className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_55.222%,rgba(0,0,0,0.8)_88.889%)]" />
            </Link>

            <div className="relative flex items-start justify-between gap-[8px]">
                <Chip>{executor.type}</Chip>

                <div className="flex items-center gap-[8px]">
                    <Link
                        href={executor.editHref}
                        aria-label="Редактировать"
                        className="flex size-[32px] items-center justify-center rounded-[6px] bg-black/25 p-[4px] text-white backdrop-blur-[2.5px] transition-colors hover:bg-black/45"
                    >
                        <SquarePen size={24} strokeWidth={2} />
                    </Link>
                    <span className="flex size-[32px] items-center justify-center rounded-[6px] bg-black/25 p-[4px] text-white backdrop-blur-[2.5px]">
                        <AdminRowMenu compact items={menuItems(executor)} />
                    </span>
                </div>
            </div>

            <div className="relative flex flex-col gap-[12px]">
                <p className="text-[14px] leading-normal font-medium text-white lg:text-[16px]">
                    {executor.name}
                </p>
                <div className="flex flex-wrap gap-[8px]">
                    {executor.chips.map((chip) => (
                        <Chip key={chip}>{chip}</Chip>
                    ))}
                </div>
                <div className="flex items-center gap-[12px]">
                    <AdminStatus tone={state.tone} solid className="min-w-0 flex-1">
                        {state.label}
                    </AdminStatus>
                    <Counters item={executor} className="text-white" />
                </div>
            </div>
        </article>
    )
}

// Ro'yxat ko'rinishi — Figma'da chizilmagan, kabinetdagi qatorlar uslubida.
function ExecutorRow({ executor, menuItems }) {
    const state = userStatus(executor.status)

    return (
        <article className="flex flex-col gap-[12px] rounded-[6px] bg-white p-[12px] lg:flex-row lg:items-center lg:gap-[16px] lg:p-[16px]">
            <Link
                href={executor.href}
                className="relative block h-[140px] w-full shrink-0 overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:size-[80px]"
            >
                <Image src={executor.image} alt="" fill sizes="80px" className="object-cover" />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
                <Link
                    href={executor.href}
                    className="truncate text-[16px] font-semibold text-black transition-colors hover:text-gold lg:text-[18px]"
                >
                    {executor.name}
                </Link>
                <p className="flex flex-wrap items-center gap-[10px] text-[12px] text-grey lg:text-[14px]">
                    {executor.type}
                    {executor.chips.map((chip) => (
                        <React.Fragment key={chip}>
                            <span aria-hidden className="size-[3px] rounded-full bg-grey" />
                            {chip}
                        </React.Fragment>
                    ))}
                </p>
            </div>

            <div className="flex items-center gap-[12px] lg:gap-[16px]">
                <Counters item={executor} className="text-grey" />
                <AdminStatus tone={state.tone} className="lg:w-[133px]">
                    {state.label}
                </AdminStatus>
                <Link
                    href={executor.editHref}
                    aria-label="Редактировать"
                    className="ui-icon-btn flex size-[32px] items-center justify-center rounded-[6px] p-[4px]"
                >
                    <SquarePen size={24} strokeWidth={2} />
                </Link>
                <span className="ui-icon-btn flex size-[32px] items-center justify-center rounded-[6px] p-[4px]">
                    <AdminRowMenu compact items={menuItems(executor)} />
                </span>
            </div>
        </article>
    )
}
