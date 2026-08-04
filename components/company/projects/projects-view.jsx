'use client'

import React from 'react'
import Card from '@/components/ui/card'
import ResourceList from '@/components/cabinet/resource-list'
import ProjectCard from '@/components/shared/project-card'

const TABS = [
        { label: 'Активные', value: 'active' },
        { label: 'На модерации', value: 'moderation' },
        { label: 'Отклонённые', value: 'rejected' },
        { label: 'Завершённые', value: 'completed' },
    ]

export default function CompanyProjects() {
    return (
        <Card title="Проекты" padded={false} className="border-0 bg-transparent">
            <ResourceList
                endpoint="/projects/mine/"
                tabs={TABS}
            createText="Создать проект"
            createHref="/company/projects/new"
                columns="grid-cols-1 md:grid-cols-2"
                emptyTitle="Проектов пока нет"
                emptyDescription="Опубликуйте проект — исполнители смогут откликнуться."
                renderItem={(item) => <ProjectCard key={item.id} project={item} basePath="/company/projects" />}
            />
        </Card>
    )
}
