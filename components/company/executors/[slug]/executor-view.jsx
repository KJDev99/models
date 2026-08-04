'use client'

import React from 'react'
import ExecutorDetail from '@/components/shared/executor-detail'

export default function CompanyExecutorView({ slug }) {
    return (
        <ExecutorDetail
            slug={slug}
            type="model"
            basePath="/company/executors"
            typeLabel="Исполнители"
        />
    )
}
