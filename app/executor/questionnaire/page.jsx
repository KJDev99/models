'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ExecutorQuestionnaireForm from '@/components/executor/questionnaire/questionnaire-form'

// `useSearchParams` statik prerender'da Suspense ichida bo'lishi shart
// (Next.js 16 — missing-suspense-with-csr-bailout).
export default function ExecutorQuestionnairePage() {
    return (
        <Suspense fallback={null}>
            <QuestionnaireWithParams />
        </Suspense>
    )
}

function QuestionnaireWithParams() {
    const params = useSearchParams()
    // `?step=0..3` va `?type=model | photographer | videographer` —
    // Figma'dagi qadamlar va ijrochi turlarini to'g'ridan-to'g'ri ochish uchun.
    return (
        <ExecutorQuestionnaireForm
            initialStep={Number(params.get('step')) || 0}
            initialType={params.get('type') || 'model'}
        />
    )
}
