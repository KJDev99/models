'use client'

import React from 'react'
import CatalogPage from '@/components/shared/catalog-page'
import ExecutorCard from '@/components/shared/executor-card'
import ExecutorTypeTabs from '@/components/shared/executor-type-tabs'

// Figma: Фотографы katalogi.
export default function PhotographersView() {
    return (
        <CatalogPage
            resource="photographers"
            title="Фотографы"
            description="Фотографы с портфолио, жанрами съёмки и стоимостью смены."
            breadcrumb={[{ name: 'Главная', href: '/' }, { name: 'Фотографы' }]}
            columns={'grid-cols-2 lg:grid-cols-4'}
            filterFields={['city', 'price', 'categories']}
            tabs={<ExecutorTypeTabs />}
            renderItem={(item) => <ExecutorCard key={item.id} executor={item} basePath="/photographers" />}
        />
    )
}
