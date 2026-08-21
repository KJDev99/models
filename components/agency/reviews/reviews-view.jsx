'use client'

import React from 'react'
import Card from '@/components/ui/card'
import ResourceList from '@/components/cabinet/resource-list'
import { toReviewCard, agencyReviews } from '@/components/cabinet/list-fetchers'
import ReviewCard from '@/components/shared/review-card'

const TABS = [
        { label: 'Обо мне', value: 'about_me' },
        { label: 'Мои отзывы', value: 'by_me' },
        { label: 'На модерации', value: 'moderation' },
    ]

export default function AgencyReviews() {
    return (
        <Card title="Отзывы" padded={false} className="border-0 bg-transparent">
            <ResourceList
                fetcher={agencyReviews}
                adapt={toReviewCard}
                tabs={TABS}
                columns="grid-cols-1"
                emptyTitle="Отзывов пока нет"
                emptyDescription="Отзывы появятся после завершённых проектов."
                renderItem={(item) => <ReviewCard key={item.id} review={item} />}
            />
        </Card>
    )
}
