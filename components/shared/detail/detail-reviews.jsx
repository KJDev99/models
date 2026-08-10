'use client'

import React, { useState } from 'react'
import { Pencil, Star } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// «Отзывы» — Figma 343:13223 (Модели) / 320:8464 (Фотографы).
// Sarlavha yonida umumiy reyting va katta yulduz, o'ng chekkada «Оставить отзыв»
// (mobilda faqat qalam ikonkasi). Kartochkalar desktopda 3 ustun, mobilda 1.
// ─────────────────────────────────────────────────────────────────────────────

function Stars({ value, size = 24 }) {
    return (
        <div className="flex items-center gap-[8px]">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    size={size}
                    strokeWidth={2}
                    className={i <= value ? 'fill-gold text-gold' : 'fill-black/15 text-black/15'}
                />
            ))}
        </div>
    )
}

function ReviewCard({ review }) {
    return (
        <article className="flex flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:p-[16px]">
            <div className="flex items-start justify-between gap-[12px]">
                <div className="flex min-w-0 items-center gap-[12px] lg:gap-[16px]">
                    {/* Figma'da avatar 54×54, rasm yo'q — kulrang doira */}
                    <span className="size-[40px] shrink-0 rounded-full bg-black/15 lg:size-[54px]" />

                    <div className="flex min-w-0 flex-col gap-[8px]">
                        <p className="truncate text-[16px] leading-[22px] font-medium text-black lg:text-[18px]">
                            {review.author}
                        </p>
                        <Stars value={review.rating} size={20} />
                    </div>
                </div>

                <span className="shrink-0 text-[12px] leading-[22px] text-grey lg:text-[14px]">
                    {review.date}
                </span>
            </div>

            <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                {review.text}
            </p>
        </article>
    )
}

export default function DetailReviews({ rating, reviews, step, onLeaveReview }) {
    const [limit, setLimit] = useState(step)

    const visible = reviews.slice(0, limit)
    const hasMore = reviews.length > limit

    return (
        <section className="flex flex-col gap-[16px] lg:gap-[24px]">
            <div className="flex items-center justify-between gap-[16px]">
                <div className="flex items-center gap-[16px] lg:gap-[24px]">
                    <h2 className="font-display text-[24px] leading-[26px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:leading-none lg:tracking-[0.64px]">
                        Отзывы
                    </h2>
                    <span className="flex items-center gap-[8px] lg:gap-[12px]">
                        <span className="font-display text-[24px] leading-none text-black lg:text-[32px]">
                            {rating}
                        </span>
                        <Star
                            size={24}
                            strokeWidth={2}
                            className="size-[24px] fill-gold text-gold lg:size-[54px]"
                        />
                    </span>
                </div>

                {/* Desktopda matnli tugma, mobilda faqat ikonka (Figma 360:24036) */}
                <button
                    type="button"
                    onClick={onLeaveReview}
                    aria-label="Оставить отзыв"
                    className="hidden cursor-pointer items-center justify-center rounded-[6px] border border-gold px-[24px] py-[16px] text-[18px] font-medium whitespace-nowrap text-gold transition-colors hover:bg-gold hover:text-white lg:flex"
                >
                    Оставить отзыв
                </button>

                <button
                    type="button"
                    onClick={onLeaveReview}
                    aria-label="Оставить отзыв"
                    className="flex size-[40px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] border border-gold text-gold transition-colors hover:bg-gold hover:text-white lg:hidden"
                >
                    <Pencil size={20} strokeWidth={2} />
                </button>
            </div>

            <div className="grid grid-cols-1 gap-[12px] lg:grid-cols-3 lg:gap-[16px]">
                {visible.map((review) => (
                    <ReviewCard key={review.id} review={review} />
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
        </section>
    )
}
