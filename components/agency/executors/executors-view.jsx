'use client'

import React from 'react'
import Card from '@/components/ui/card'
import ResourceList from '@/components/cabinet/resource-list'
import ExecutorCard from '@/components/shared/executor-card'

const TABS = [
        { label: 'Активные', value: 'active' },
        { label: 'На модерации', value: 'moderation' },
        { label: 'Отклонённые', value: 'rejected' },
        { label: 'Скрытые', value: 'hidden' },
    ]

export default function AgencyExecutors() {
    return (
        <Card title="Исполнители агентства" padded={false} className="border-0 bg-transparent">
            <ResourceList
                endpoint="/agencies/mine/executors/"
                tabs={TABS}
            createText="Добавить исполнителя"
            createHref="/agency/executors/new"
                columns="grid-cols-2 lg:grid-cols-3"
                emptyTitle="Исполнителей пока нет"
                emptyDescription="Добавьте моделей и фотографов — они появятся в каталоге под брендом агентства."
                renderItem={(item) => <ExecutorCard key={item.id} executor={item} basePath="/agency/executors" />}
            />
        </Card>
    )
}
