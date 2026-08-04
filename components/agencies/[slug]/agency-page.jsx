'use client'

import React from 'react'
import OrganizationDetail from '@/components/shared/organization-detail'

export default function AgencyPage({ slug }) {
    return <OrganizationDetail slug={slug} kind="agency" />
}
