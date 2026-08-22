'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, LayoutGrid, List, MessageCircle, SquarePen } from 'lucide-react'
import { AdminRowMenu, AdminSearch, AdminSelect, AdminStatus } from '@/components/admin/ui/admin-ui'
import { PROJECT_STATUS, projectStatus } from '@/components/admin/ui/admin-statuses'

// ─────────────────────────────────────────────────────────────────────────────
// «Мои публикации» bloki — Figma «Профиль компании - проекты» 338:16522.
// Tepada bo'lim tugmalari (Проекты (8) / Площадки (4)), qidiruv, holat tanlash
// va ko'rinish almashtirgichi; ostida kartochkalar setkasi yoki ro'yxati.
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
    { value: '', label: 'Все статусы' },
    ...Object.entries(PROJECT_STATUS).map(([value, s]) => ({ value, label: s.label })),
]

export default function AdminPublications({ tabs, items, emptyTitle, emptyText, menuItems }) {
    const [tab, setTab] = useState(tabs[0].key)
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('')
    const [view, setView] = useState('grid')

    const list = useMemo(() => {
        const q = query.trim().toLowerCase()
        return items.filter((item) => {
            if (item.kind !== tab) return false
            if (status && item.status !== status) return false
            if (!q) return true
            return `${item.title} ${item.description}`.toLowerCase().includes(q)
        })
    }, [items, tab, query, status])

    const empty = items.length === 0

    return (
        <section className="flex flex-col gap-[16px] lg:gap-[24px]">
            <h2 className="font-display text-[24px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:tracking-[0.64px]">
                Мои публикации
            </h2>

            {empty ? (
                <div className="flex flex-col gap-[12px]">
                    <p className="text-[16px] font-semibold text-black lg:text-[18px]">
                        {emptyTitle}
                    </p>
                    <p className="text-[14px] text-grey lg:text-[16px]">{emptyText}</p>
                </div>
            ) : (
                <div className="flex flex-col gap-[16px]">
                    <div className="flex flex-wrap gap-[12px] lg:gap-[16px]">
                        {tabs.map((item) => {
                            const on = item.key === tab
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => setTab(item.key)}
                                    className={`flex cursor-pointer items-center gap-[8px] rounded-[6px] px-[16px] py-[12px] text-[14px] font-medium transition-colors lg:gap-[12px] lg:p-[16px] lg:text-[16px] ${
                                        on
                                            ? 'bg-gold text-white'
                                            : 'border border-gold text-gold hover:bg-gold/10'
                                    }`}
                                >
                                    {item.label}
                                    <span>({item.count})</span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex flex-col gap-[12px] lg:flex-row lg:items-center lg:gap-[16px]">
                        <AdminSearch
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Название проекта / ключевые слова"
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

                    {list.length === 0 ? (
                        <p className="py-[24px] text-center text-[14px] text-grey lg:text-[16px]">
                            Ничего не найдено
                        </p>
                    ) : view === 'grid' ? (
                        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-[16px]">
                            {list.map((item) => (
                                <PublicationCard key={item.id} item={item} menuItems={menuItems} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                            {list.map((item) => (
                                <PublicationRow key={item.id} item={item} menuItems={menuItems} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}

// Setkadagi kartochka (Figma 338:16552).
function PublicationCard({ item, menuItems }) {
    const state = projectStatus(item.status)

    return (
        <article className="flex flex-col overflow-hidden rounded-[6px]">
            <div className="relative flex h-[200px] items-start justify-end bg-[#787878] p-[16px]">
                <Image src={item.image} alt="" fill sizes="323px" className="object-cover" />

                <div className="relative flex items-center gap-[8px]">
                    <Link
                        href={item.editHref}
                        aria-label="Редактировать"
                        className="flex size-[32px] items-center justify-center rounded-[6px] bg-black/30 p-[4px] text-white transition-colors hover:bg-black/45"
                    >
                        <SquarePen size={24} strokeWidth={2} />
                    </Link>
                    <span className="flex size-[32px] items-center justify-center rounded-[6px] bg-black/30 p-[4px] text-white">
                        <AdminRowMenu compact items={menuItems(item)} />
                    </span>
                </div>

                <span className="absolute right-0 bottom-0 rounded-tl-[6px] bg-white px-[12px] py-[8px] text-[14px] font-medium text-black uppercase">
                    {item.price}
                </span>
            </div>

            <div className="flex flex-col justify-center gap-[10px] bg-white p-[16px]">
                <h3 className="line-clamp-2 text-[16px] leading-[22px] font-semibold text-black lg:text-[18px] lg:leading-[24px]">
                    {item.title}
                </h3>
                <p className="line-clamp-2 text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                    {item.description}
                </p>
                <p className="flex items-center gap-[10px] text-[12px] text-grey lg:text-[14px]">
                    {item.date}
                    <span aria-hidden className="size-[3px] rounded-full bg-grey" />
                    {item.city}
                </p>
                <div className="flex items-center gap-[10px]">
                    <AdminStatus tone={state.tone} solid className="min-w-0 flex-1">
                        {state.label}
                    </AdminStatus>
                    <Counters item={item} />
                </div>
            </div>
        </article>
    )
}

// Ro'yxat ko'rinishi (Figma «редактировать профиль» 338:17056 fonida).
function PublicationRow({ item, menuItems }) {
    const state = projectStatus(item.status)

    return (
        <article className="flex flex-col gap-[12px] rounded-[6px] bg-white p-[12px] lg:flex-row lg:items-center lg:gap-[16px] lg:p-[16px]">
            <span className="relative block h-[140px] w-full shrink-0 overflow-hidden rounded-[6px] bg-[#787878] lg:size-[80px]">
                <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
                <h3 className="text-[16px] font-semibold text-black lg:text-[18px]">{item.title}</h3>
                <p className="flex flex-wrap items-center gap-[10px] text-[12px] text-grey lg:text-[14px]">
                    {item.date}
                    <span aria-hidden className="size-[3px] rounded-full bg-grey" />
                    {item.city}
                    <span aria-hidden className="size-[3px] rounded-full bg-grey" />
                    {item.price}
                </p>
            </div>

            <div className="flex items-center gap-[12px] lg:gap-[16px]">
                <Counters item={item} />
                <AdminStatus tone={state.tone} className="lg:w-[133px]">
                    {state.label}
                </AdminStatus>
                <Link
                    href={item.editHref}
                    aria-label="Редактировать"
                    className="flex size-[32px] items-center justify-center rounded-[6px] ui-icon-btn p-[4px]"
                >
                    <SquarePen size={24} strokeWidth={2} />
                </Link>
                <span className="flex size-[32px] items-center justify-center rounded-[6px] ui-icon-btn p-[4px]">
                    <AdminRowMenu compact items={menuItems(item)} />
                </span>
            </div>
        </article>
    )
}

function Counters({ item }) {
    return (
        <span className="flex items-center gap-[16px] text-[12px] text-grey lg:text-[14px]">
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
