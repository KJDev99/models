'use client'

import React from 'react'
import Card from '@/components/ui/card'
import ResourceList from '@/components/cabinet/resource-list'
import { toInviteCard, agencyInvites } from '@/components/cabinet/list-fetchers'
import ProjectCard from '@/components/shared/project-card'

const TABS = [
        { label: 'Новые', value: 'new' },
        { label: 'Принятые', value: 'accepted' },
        { label: 'Отклонённые', value: 'declined' },
    ]

export default function AgencyInvites() {
    return (
        <Card title="Приглашения" padded={false} className="border-0 bg-transparent">
            <ResourceList
                fetcher={agencyInvites}
                adapt={toInviteCard}
                tabs={TABS}
                columns="grid-cols-1 md:grid-cols-2"
                emptyTitle="Приглашений нет"
                emptyDescription="Здесь появятся приглашения заказчиков вашим исполнителям."
                renderItem={(item) => <ProjectCard key={item.id} project={item} basePath="/projects" />}
            />
        </Card>
    )
}
