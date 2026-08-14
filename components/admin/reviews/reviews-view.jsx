'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff, Star, Trash2 } from 'lucide-react'
import {
    AdminListCard,
    AdminPagination,
    AdminRowMenu,
    AdminSearch,
    AdminSelect,
    AdminStatus,
} from '@/components/admin/ui/admin-ui'
import { DeleteModal } from '@/components/admin/ui/admin-modals'
import {
    ADMIN_REVIEWS,
    RATING_FILTER,
    REVIEWS_PAGE_SIZE,
    REVIEW_STATUS,
    REVIEW_STATUS_FILTER,
} from '@/components/admin/reviews/reviews-data'

// Figma: Отзывы (343:12626 / 457:23859)
export default function AdminReviews() {
    const [list, setList] = useState(ADMIN_REVIEWS)
    const [query, setQuery] = useState('')
    const [rating, setRating] = useState('')
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(1)
    const [removing, setRemoving] = useState(null)

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return list.filter((row) => {
            if (status && row.status !== status) return false
            if (rating && String(row.rating) !== rating) return false
            if (!q) return true
            return `${row.author} ${row.target.name}`.toLowerCase().includes(q)
        })
    }, [list, query, rating, status])

    const pages = Math.max(1, Math.ceil(filtered.length / REVIEWS_PAGE_SIZE))
    const current = Math.min(page, pages)
    const rows = filtered.slice((current - 1) * REVIEWS_PAGE_SIZE, current * REVIEWS_PAGE_SIZE)

    function patch(row, changes) {
        setList((all) => all.map((item) => (item.id === row.id ? { ...item, ...changes } : item)))
    }

    return (
        <>
            <AdminListCard
                title="Отзывы"
                toolbar={
                    <>
                        <AdminSearch
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                                setPage(1)
                            }}
                            placeholder="Поиск по автору или получателю отзыва"
                        />
                        <AdminSelect
                            value={rating}
                            onChange={(e) => {
                                setRating(e.target.value)
                                setPage(1)
                            }}
                            options={RATING_FILTER}
                            className="lg:w-[180px] lg:shrink-0"
                        />
                        <AdminSelect
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value)
                                setPage(1)
                            }}
                            options={REVIEW_STATUS_FILTER}
                            className="lg:w-[180px] lg:shrink-0"
                        />
                    </>
                }
            >
                <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                    {rows.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            onToggle={() =>
                                patch(review, {
                                    status: review.status === 'hidden' ? 'published' : 'hidden',
                                })
                            }
                            onDelete={() => setRemoving(review)}
                        />
                    ))}
                </div>

                <AdminPagination page={current} pages={pages} onChange={setPage} />
            </AdminListCard>

            <DeleteModal
                open={Boolean(removing)}
                onClose={() => setRemoving(null)}
                name={removing?.author}
                onConfirm={() => setList((all) => all.filter((item) => item.id !== removing.id))}
            />
        </>
    )
}

// Bitta sharh (Figma 343:12659). «⋮» ichida ikki band: holatga qarab
// «Скрыть отзыв» / «Опубликовать» va «Удалить» (Figma 343:14250 / 343:14276).
function ReviewCard({ review, onToggle, onDelete }) {
    const hidden = review.status === 'hidden'
    const state = REVIEW_STATUS[review.status]

    return (
        <article className="flex flex-col gap-[12px] rounded-[6px] border border-black/8 p-[12px] lg:gap-[16px] lg:p-[16px]">
            <div className="flex flex-wrap items-center justify-between gap-[12px]">
                <div className="flex items-center gap-[12px]">
                    <span className="block size-[40px] shrink-0 rounded-full bg-[#d9d9d9]" />
                    <span className="text-[14px] font-medium text-black lg:text-[16px]">
                        {review.author}
                    </span>
                    <span className="rounded-[6px] bg-light-white px-[12px] py-[4px] text-[12px] text-grey lg:text-[14px]">
                        {review.authorType}
                    </span>
                </div>

                <div className="flex items-center gap-[12px] lg:gap-[16px]">
                    <AdminStatus tone={state.tone} className="lg:w-[133px]">
                        {state.label}
                    </AdminStatus>
                    <span className="flex size-[32px] items-center justify-center rounded-[6px] bg-gold/25 p-[4px] text-black">
                        <AdminRowMenu
                            items={[
                                hidden
                                    ? {
                                          key: 'show',
                                          label: 'Опубликовать',
                                          icon: Eye,
                                          onClick: onToggle,
                                      }
                                    : {
                                          key: 'hide',
                                          label: 'Скрыть отзыв',
                                          icon: EyeOff,
                                          onClick: onToggle,
                                      },
                                {
                                    key: 'delete',
                                    label: 'Удалить',
                                    icon: Trash2,
                                    onClick: onDelete,
                                    danger: true,
                                },
                            ]}
                        />
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-[12px]">
                <span className="flex items-center gap-[2px]">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            size={20}
                            strokeWidth={2}
                            className={
                                i < review.rating ? 'fill-gold text-gold' : 'fill-[#d9d9d9] text-[#d9d9d9]'
                            }
                        />
                    ))}
                </span>
                <span className="text-[12px] text-grey lg:text-[14px]">{review.date}</span>
            </div>

            <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                {review.text}
            </p>

            <div className="flex flex-col gap-[12px] rounded-[6px] bg-light-white p-[12px] sm:flex-row sm:items-center lg:p-[16px]">
                <span className="relative block size-[40px] shrink-0 overflow-hidden rounded-full bg-[#d9d9d9]">
                    <Image
                        src={review.target.image}
                        alt={review.target.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                    />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                    <span className="truncate text-[14px] font-medium text-black lg:text-[16px]">
                        {review.target.name}
                    </span>
                    <span className="truncate text-[12px] text-grey">{review.target.role}</span>
                </span>
                <Link
                    href={review.target.href}
                    className="flex items-center justify-center rounded-[6px] border border-black/15 px-[16px] py-[8px] text-[12px] font-medium whitespace-nowrap text-black transition-colors hover:border-gold hover:text-gold lg:px-[24px] lg:py-[12px] lg:text-[14px]"
                >
                    Открыть профиль
                </Link>
            </div>
        </article>
    )
}
