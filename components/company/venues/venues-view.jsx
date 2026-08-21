'use client'

import React from 'react'
import Card from '@/components/ui/card'
import ResourceList from '@/components/cabinet/resource-list'
import { toVenueCard, customerVenues } from '@/components/cabinet/list-fetchers'
import VenueCard from '@/components/shared/venue-card'

const TABS = [
        { label: 'Активные', value: 'active' },
        { label: 'На модерации', value: 'moderation' },
        { label: 'Отклонённые', value: 'rejected' },
        { label: 'Скрытые', value: 'hidden' },
    ]

export default function CompanyVenues() {
    return (
        <Card title="Площадки" padded={false} className="border-0 bg-transparent">
            <ResourceList
                fetcher={customerVenues}
                adapt={toVenueCard}
                tabs={TABS}
            createText="Добавить площадку"
            createHref="/company/venues/new"
                columns="grid-cols-1 md:grid-cols-2"
                emptyTitle="Площадок пока нет"
                emptyDescription="Разместите студию или локацию — её смогут забронировать."
                renderItem={(item) => <VenueCard key={item.id} venue={item} basePath="/company/venues" />}
            />
        </Card>
    )
}
