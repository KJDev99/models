'use client'

import React from 'react'
import CatalogPage from '@/components/shared/catalog-page'
import ExecutorCard from '@/components/shared/executor-card'
import ExecutorTypeTabs from '@/components/shared/executor-type-tabs'

// Figma: Модели katalogi.
export default function ModelsView() {
    return (
        <CatalogPage
            resource="models"
            title="Модели"
            description="Анкеты моделей с параметрами, портфолио и опытом. Приглашайте в проект напрямую."
            breadcrumb={[{ name: 'Главная', href: '/' }, { name: 'Модели' }]}
            columns={'grid-cols-2 lg:grid-cols-4'}
            filterFields={['city', 'gender', 'age', 'height', 'price', 'categories']}
            tabs={<ExecutorTypeTabs />}
            renderItem={(item) => <ExecutorCard key={item.id} executor={item} basePath="/models" />}
        />
    )
}
