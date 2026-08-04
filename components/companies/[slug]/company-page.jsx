'use client'

import React from 'react'
import OrganizationDetail from '@/components/shared/organization-detail'

// Figma: Профиль компании (171:2745) — заказчик-юрлицо ochiq profili.
export default function CompanyPage({ slug }) {
    return <OrganizationDetail slug={slug} kind="company" />
}
