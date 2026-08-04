import React from 'react'
import { formatDate } from '@/lib/format'
import Avatar from '@/components/ui/avatar'
import Rating from '@/components/ui/rating'

// Отзыв (Figma: Отзывы 343:12626).
export default function ReviewCard({ review, action }) {
    if (!review) return null
    const { author, rating, text, createdAt, projectTitle } = review

    return (
        <article className="rounded-[16px] border border-black/8 bg-white p-5 lg:p-6">
            <header className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Avatar src={author?.avatar} name={author?.name} />
                    <div>
                        <p className="text-base text-black">{author?.name || 'Пользователь'}</p>
                        <p className="text-sm text-grey">{formatDate(createdAt)}</p>
                    </div>
                </div>
                <Rating value={rating} />
            </header>

            {projectTitle && (
                <p className="mt-4 text-sm text-grey">Проект: {projectTitle}</p>
            )}

            <p className="mt-3 text-base whitespace-pre-line text-black">{text}</p>

            {action && <div className="mt-4">{action}</div>}
        </article>
    )
}
