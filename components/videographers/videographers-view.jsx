'use client'

import React from 'react'
import CatalogPage from '@/components/shared/catalog-page'
import ExecutorCard from '@/components/shared/executor-card'
import ExecutorTypeTabs from '@/components/shared/executor-type-tabs'

// Figma: Видеографы katalogi.
export default function VideographersView() {
    return (
        <CatalogPage
            resource="videographers"
            title="Видеографы"
            description="Видеографы и операторы: шоурилы, оборудование, стоимость съёмочного дня."
            breadcrumb={[{ name: 'Главная', href: '/' }, { name: 'Видеографы' }]}
            columns={'grid-cols-2 lg:grid-cols-4'}
            filterFields={['city', 'price', 'categories']}
            tabs={<ExecutorTypeTabs />}
            renderItem={(item) => <ExecutorCard key={item.id} executor={item} basePath="/videographers" />}
        />
    )
}
