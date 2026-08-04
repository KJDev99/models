'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import ResourceList from '@/components/cabinet/resource-list'
import ReviewCard from '@/components/shared/review-card'
import { useApiStore } from '@/store/useApiStore'

// Figma: Отзывы (343:12626) + "Если опубликован" / "Если скрыт отзыв" holatlari.
const TABS = [
    { label: 'На модерации', value: 'moderation' },
    { label: 'Опубликованные', value: 'active' },
    { label: 'Скрытые', value: 'hidden' },
]

export default function AdminReviews() {
    const postDataToken = useApiStore((s) => s.postDataToken)
    const [busy, setBusy] = useState(null)

    async function act(id, action, reload) {
        setBusy(id)
        const res = await postDataToken(`/admin/reviews/${id}/${action}/`, {})
        setBusy(null)
        if (res.success) {
            toast.success('Готово')
            reload()
        } else {
            toast.error('Не удалось выполнить действие')
        }
    }

    return (
        <Card title="Отзывы" padded={false} className="border-0 bg-transparent">
            <ResourceList
                endpoint="/admin/reviews/"
                tabs={TABS}
                defaultTab="moderation"
                columns="grid-cols-1"
                limit={20}
                emptyTitle="Отзывов нет"
                emptyDescription="Здесь появятся отзывы, ожидающие модерации."
                renderItem={(review, reload) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        action={
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    size="sm"
                                    loading={busy === review.id}
                                    onClick={() => act(review.id, 'publish', reload)}
                                >
                                    Опубликовать
                                </Button>
                                <Button
                                    variant="whiteStroke"
                                    size="sm"
                                    onClick={() => act(review.id, 'hide', reload)}
                                >
                                    Скрыть
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => act(review.id, 'delete', reload)}
                                >
                                    Удалить
                                </Button>
                            </div>
                        }
                    />
                )}
            />
        </Card>
    )
}
