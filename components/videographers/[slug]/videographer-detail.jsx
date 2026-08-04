'use client'

import React from 'react'
import ExecutorDetail from '@/components/shared/executor-detail'

// Figma: анкета исполнителя. Umumiy ExecutorDetail komponenti ustidagi
// yupqa qatlam — faqat tur va breadcrumb farq qiladi.
export default function VideographerDetail({ slug }) {
    return <ExecutorDetail slug={slug} type="videographer" basePath="/videographers" typeLabel="Видеографы" />
}
