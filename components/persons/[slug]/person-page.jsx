'use client'

import React from 'react'
import OrganizationDetail from '@/components/shared/organization-detail'

// Figma: Профиль частное лицо (173:3550).
export default function PersonPage({ slug }) {
    return <OrganizationDetail slug={slug} kind="person" />
}
