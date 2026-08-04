'use client'

import React from 'react'
import ExecutorDetail from '@/components/shared/executor-detail'

// Figma: анкета исполнителя. Umumiy ExecutorDetail komponenti ustidagi
// yupqa qatlam — faqat tur va breadcrumb farq qiladi.
export default function PhotographerDetail({ slug }) {
    return <ExecutorDetail slug={slug} type="photographer" basePath="/photographers" typeLabel="Фотографы" />
}
