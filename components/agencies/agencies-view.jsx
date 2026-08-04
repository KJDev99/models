'use client'

import React from 'react'
import CatalogPage from '@/components/shared/catalog-page'
import AgencyCard from '@/components/shared/agency-card'

// Figma: Агентства katalogi.
export default function AgenciesView() {
    return (
        <CatalogPage
            resource="agencies"
            title="Агентства"
            description="Модельные агентства с проверенными исполнителями и портфолио."
            breadcrumb={[{ name: 'Главная', href: '/' }, { name: 'Агентства' }]}
            columns={'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}
            filterFields={['city', 'categories']}
            renderItem={(item) => <AgencyCard key={item.id} agency={item} />}
        />
    )
}
