'use client'

import React from 'react'
import CatalogPage from '@/components/shared/catalog-page'
import VenueCard from '@/components/shared/venue-card'

// Figma: Площадки katalogi.
export default function VenuesView() {
    return (
        <CatalogPage
            resource="venues"
            title="Площадки"
            description="Фотостудии, лофты и локации для съёмок с почасовой арендой."
            breadcrumb={[{ name: 'Главная', href: '/' }, { name: 'Площадки' }]}
            columns={'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}
            filterFields={['city', 'price', 'categories']}
            renderItem={(item) => <VenueCard key={item.id} venue={item} />}
        />
    )
}
