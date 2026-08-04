'use client'

import React from 'react'
import Card from '@/components/ui/card'
import ResourceList from '@/components/cabinet/resource-list'
import ProjectCard from '@/components/shared/project-card'

const TABS = [
        { label: 'Активные', value: 'active' },
        { label: 'Отклики', value: 'responses' },
        { label: 'Завершённые', value: 'completed' },
    ]

export default function ExecutorProjects() {
    return (
        <Card title="Мои проекты" padded={false} className="border-0 bg-transparent">
            <ResourceList
                endpoint="/projects/participating/"
                tabs={TABS}
                columns="grid-cols-1 md:grid-cols-2"
                emptyTitle="Проектов пока нет"
                emptyDescription="Откликайтесь на кастинги — принятые проекты появятся здесь."
                renderItem={(item) => <ProjectCard key={item.id} project={item} basePath="/projects" />}
            />
        </Card>
    )
}
