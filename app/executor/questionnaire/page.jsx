'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ExecutorQuestionnaireLoader from '@/components/executor/questionnaire/questionnaire-loader'

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
    // `?step=0..3` — qadamni to'g'ridan-to'g'ri ochish uchun. Ijrochi turi
    // backenddagi anketadan olinadi.
    return <ExecutorQuestionnaireLoader initialStep={Number(params.get('step')) || 0} />
}
