'use client'

import React from 'react'
import ExecutorDetail from '@/components/shared/executor-detail'

// Figma: "Модели - Катерина Журавлева" (216:4690) — заказчик kabinetidan
// ochilgan anketa. Bir xil komponent, boshqa breadcrumb.
export default function ClientExecutorView({ slug }) {
    return (
        <ExecutorDetail
            slug={slug}
            type="model"
            basePath="/client/models"
            typeLabel="Исполнители"
        />
    )
}
