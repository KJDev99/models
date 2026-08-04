'use client'

import React, { useEffect, useState } from 'react'
import Card from '@/components/ui/card'
import Tabs from '@/components/ui/tabs'
import Button from '@/components/ui/button'
import EmptyState from '@/components/ui/empty-state'
import ExecutorCard from '@/components/shared/executor-card'
import VenueCard from '@/components/shared/venue-card'
import ProjectCard from '@/components/shared/project-card'
import AgencyCard from '@/components/shared/agency-card'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'

const TABS = [
    { label: 'Исполнители', value: FAVORITE_TYPES.EXECUTOR },
    { label: 'Площадки', value: FAVORITE_TYPES.VENUE },
    { label: 'Проекты', value: FAVORITE_TYPES.PROJECT },
    { label: 'Агентства', value: FAVORITE_TYPES.AGENCY },
]

export default function ExecutorFavorites() {
    const items = useFavoritesStore((s) => s.items)
    const sync = useFavoritesStore((s) => s.sync)
    const clear = useFavoritesStore((s) => s.clear)
    const [tab, setTab] = useState(FAVORITE_TYPES.EXECUTOR)

    useEffect(() => {
        sync()
    }, [sync])

    const filtered = items.filter((i) => i.type === tab)

    function renderItem(item) {
        const data = item.data || {
            id: item.id,
            slug: item.slug,
            name: item.title,
            title: item.title,
            cover: item.image,
        }
        if (item.type === FAVORITE_TYPES.VENUE) return <VenueCard key={item.id} venue={data} />
        if (item.type === FAVORITE_TYPES.PROJECT) return <ProjectCard key={item.id} project={data} />
        if (item.type === FAVORITE_TYPES.AGENCY) return <AgencyCard key={item.id} agency={data} />
        return <ExecutorCard key={item.id} executor={data} />
    }

    return (
        <Card
            title="Избранное"
            padded={false}
            className="border-0 bg-transparent"
            action={
                items.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clear}>
                        Очистить
                    </Button>
                )
            }
        >
            <Tabs
                items={TABS.map((t) => ({ ...t, count: items.filter((i) => i.type === t.value).length }))}
                value={tab}
                onChange={setTab}
                className="mb-6"
            />

            {filtered.length === 0 ? (
                <EmptyState
                    title="Здесь пока пусто"
                    description="Нажимайте на сердечко в карточках каталога."
                    actionText="В каталог"
                    actionHref="/models"
                />
            ) : (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
                    {filtered.map(renderItem)}
                </div>
            )}
        </Card>
    )
}
