'use client'

import React, { useEffect, useState } from 'react'
import Container from '@/components/ui/container'
import PageHeader from '@/components/ui/page-header'
import Tabs from '@/components/ui/tabs'
import Button from '@/components/ui/button'
import EmptyState from '@/components/ui/empty-state'
import ExecutorCard from '@/components/shared/executor-card'
import VenueCard from '@/components/shared/venue-card'
import ProjectCard from '@/components/shared/project-card'
import AgencyCard from '@/components/shared/agency-card'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'

// Figma: Избранное (173:4067).
const TABS = [
    { label: 'Исполнители', value: FAVORITE_TYPES.EXECUTOR },
    { label: 'Площадки', value: FAVORITE_TYPES.VENUE },
    { label: 'Проекты', value: FAVORITE_TYPES.PROJECT },
    { label: 'Агентства', value: FAVORITE_TYPES.AGENCY },
]

export default function FavoritesView() {
    const items = useFavoritesStore((s) => s.items)
    const sync = useFavoritesStore((s) => s.sync)
    const clear = useFavoritesStore((s) => s.clear)
    const [tab, setTab] = useState(FAVORITE_TYPES.EXECUTOR)

    useEffect(() => {
        sync()
    }, [sync])

    const filtered = items.filter((i) => i.type === tab)

    const tabsWithCount = TABS.map((t) => ({
        ...t,
        count: items.filter((i) => i.type === t.value).length,
    }))

    function renderItem(item) {
        const data = item.data || {
            id: item.id,
            slug: item.slug,
            name: item.title,
            title: item.title,
            cover: item.image,
        }
        switch (item.type) {
            case FAVORITE_TYPES.VENUE:
                return <VenueCard key={item.id} venue={data} />
            case FAVORITE_TYPES.PROJECT:
                return <ProjectCard key={item.id} project={data} />
            case FAVORITE_TYPES.AGENCY:
                return <AgencyCard key={item.id} agency={data} />
            default:
                return <ExecutorCard key={item.id} executor={data} />
        }
    }

    return (
        <Container className="my-8 lg:my-12">
            <PageHeader
                breadcrumb={[{ name: 'Главная', href: '/' }, { name: 'Избранное' }]}
                title="Избранное"
                action={
                    items.length > 0 && (
                        <Button variant="ghost" onClick={clear}>
                            Очистить всё
                        </Button>
                    )
                }
            />

            <Tabs items={tabsWithCount} value={tab} onChange={setTab} className="mb-6" />

            {filtered.length === 0 ? (
                <EmptyState
                    title="Здесь пока пусто"
                    description="Нажимайте на сердечко в карточках — они появятся в этом списке."
                    actionText="В каталог"
                    actionHref="/models"
                />
            ) : (
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
                    {filtered.map(renderItem)}
                </div>
            )}
        </Container>
    )
}
