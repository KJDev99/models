'use client'

import React from 'react'
import Card from '@/components/ui/card'
import ResourceList from '@/components/cabinet/resource-list'
import { toExecutorCard, catalogPerformers } from '@/components/cabinet/list-fetchers'
import ExecutorCard from '@/components/shared/executor-card'

// Figma: "Заказчик - модели" (208:3258) — kabinet ichidagi katalog.
const TABS = [
    { label: 'Модели', value: 'model' },
    { label: 'Фотографы', value: 'photographer' },
    { label: 'Видеографы', value: 'videographer' },
]

export default function ClientModels() {
    return (
        <Card title="Исполнители" padded={false} className="border-0 bg-transparent">
            <ResourceList
                fetcher={catalogPerformers}
                adapt={toExecutorCard}
                tabs={TABS}
                defaultTab="model"
                columns="grid-cols-2 lg:grid-cols-3"
                emptyTitle="Никого не нашлось"
                emptyDescription="Попробуйте другой раздел каталога."
                renderItem={(item) => (
                    <ExecutorCard key={item.id} executor={item} basePath="/client/models" />
                )}
            />
        </Card>
    )
}
