'use client'

import React, { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
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
    RATING_FILTER,
    REVIEWS_PAGE_SIZE,
    REVIEW_STATUS,
    REVIEW_STATUS_FILTER,
} from '@/components/admin/reviews/reviews-data'
import { useApi, useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'
import { adminReviewRow } from '@/lib/adapters'

// Figma: Отзывы (343:12626 / 457:23859)
export default function AdminReviews() {
    const [query, setQuery] = useState('')
    const [rating, setRating] = useState('')
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(1)
    const [removing, setRemoving] = useState(null)

    // GET /admin/reviews — qidiruv, reyting va holat filtri server tomonida.
    const fetcher = useCallback(
        () =>
            adminApi.reviews({
                q: query || undefined,
                rating: rating || undefined,
                status: status || undefined,
                page,
                page_size: REVIEWS_PAGE_SIZE,
            }),
        [query, rating, status, page],
    )
    const { data, loading, error, reload } = useApi(fetcher)

    const rows = useMemo(() => (data?.items || []).map(adminReviewRow), [data])
    const pages = data?.meta?.pages || 1
    const current = data?.meta?.page || page

    const setStatusOf = useAction(adminApi.setReviewStatus)
    const remove = useAction(adminApi.deleteReview)

    async function run(promise, message) {
        const res = await promise
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success(message)
        reload()
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
                    {(loading || error || rows.length === 0) && (
                        <p className="rounded-[6px] bg-light-white p-[24px] text-center text-[14px] text-grey lg:text-[16px]">
                            {loading ? 'Загружаем…' : error ? error.message : 'Отзывов нет'}
                        </p>
                    )}
                    {rows.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            onToggle={() =>
                                run(
                                    setStatusOf.run(
                                        review.id,
                                        review.status === 'hidden' ? 'published' : 'hidden',
                                    ),
                                    review.status === 'hidden' ? 'Отзыв опубликован' : 'Отзыв скрыт',
                                )
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
                onConfirm={() => run(remove.run(removing.id), 'Отзыв удалён')}
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
            <div className="flex flex-wrap items-start justify-between gap-[12px]">
                {/* Figma 343:13149: 65px avatar, o'ng ustunda ism qatori va
                    ostida yulduzlar + sana. */}
                <div className="flex items-center gap-[12px] lg:gap-[16px]">
                    <span className="block size-[40px] shrink-0 rounded-full bg-[#d9d9d9] lg:size-[65px]" />

                    <span className="flex flex-col gap-[6px] lg:gap-[8px]">
                        <span className="flex flex-wrap items-center gap-[12px]">
                            <span className="text-[14px] font-medium text-black lg:text-[16px]">
                                {review.author}
                            </span>
                            <span className="rounded-[6px] bg-light-white px-[12px] py-[4px] text-[12px] text-grey lg:text-[14px]">
                                {review.authorType}
                            </span>
                        </span>

                        <span className="flex items-center gap-[8px]">
                            <span className="flex items-center gap-[8px]">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                        key={i}
                                        size={24}
                                        strokeWidth={2}
                                        className={`size-[20px] lg:size-[24px] ${
                                            i < review.rating
                                                ? 'fill-gold text-gold'
                                                : 'fill-[#d9d9d9] text-[#d9d9d9]'
                                        }`}
                                    />
                                ))}
                            </span>
                            <span className="text-[12px] text-grey lg:text-[14px]">
                                {review.date}
                            </span>
                        </span>
                    </span>
                </div>

                <div className="flex items-center gap-[12px] lg:gap-[16px]">
                    <AdminStatus tone={state.tone} className="lg:w-[133px]">
                        {state.label}
                    </AdminStatus>
                    <span className="flex size-[32px] items-center justify-center rounded-[6px] ui-icon-btn p-[4px]">
                        <AdminRowMenu compact
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
