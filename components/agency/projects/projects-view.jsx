'use client'

import React from 'react'
import Card from '@/components/ui/card'
import ResourceList from '@/components/cabinet/resource-list'
import { toProjectCard, agencyProjects } from '@/components/cabinet/list-fetchers'
import ProjectCard from '@/components/shared/project-card'

const TABS = [
        { label: 'Активные', value: 'active' },
        { label: 'Отклики', value: 'responses' },
        { label: 'Завершённые', value: 'completed' },
    ]

export default function AgencyProjects() {
    return (
        <Card title="Проекты" padded={false} className="border-0 bg-transparent">
            <ResourceList
                fetcher={agencyProjects}
                adapt={toProjectCard}
                tabs={TABS}
                columns="grid-cols-1 md:grid-cols-2"
                emptyTitle="Проектов пока нет"
                emptyDescription="Откликайтесь на кастинги от имени агентства."
                renderItem={(item) => <ProjectCard key={item.id} project={item} basePath="/projects" />}
            />
        </Card>
    )
}
