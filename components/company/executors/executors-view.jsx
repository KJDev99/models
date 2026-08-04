'use client'

import React from 'react'
import Card from '@/components/ui/card'
import ResourceList from '@/components/cabinet/resource-list'
import ExecutorCard from '@/components/shared/executor-card'

const TABS = [
    { label: 'Модели', value: 'model' },
    { label: 'Фотографы', value: 'photographer' },
    { label: 'Видеографы', value: 'videographer' },
]

export default function CompanyExecutors() {
    return (
        <Card title="Исполнители" padded={false} className="border-0 bg-transparent">
            <ResourceList
                endpoint="/executors/"
                tabs={TABS}
                defaultTab="model"
                columns="grid-cols-2 lg:grid-cols-3"
                emptyTitle="Никого не нашлось"
                emptyDescription="Попробуйте другой раздел каталога."
                renderItem={(item) => (
                    <ExecutorCard key={item.id} executor={item} basePath="/company/executors" />
                )}
            />
        </Card>
    )
}
