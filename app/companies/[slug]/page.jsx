'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import CompanyPage from '@/components/companies/[slug]/company-page'

export default function CompanyDetailPage() {
    const { slug } = useParams()
    return <CompanyPage slug={slug} />
}
