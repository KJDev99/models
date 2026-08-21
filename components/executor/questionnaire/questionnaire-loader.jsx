'use client'

import React, { useCallback } from 'react'
import Container from '@/components/ui/container'
import ExecutorQuestionnaireForm from '@/components/executor/questionnaire/questionnaire-form'
import { toFormValues } from '@/components/executor/questionnaire/questionnaire-api'
import { useApi } from '@/lib/use-api'
import * as performerApi from '@/lib/api/performer'

// ─────────────────────────────────────────────────────────────────────────────
// Anketani ochishdan oldin joriy ma'lumot backenddan olinadi
// (GET /performer/cabinet), so'ng forma to'ldirilgan holda ochiladi.
//
// Forma boshlang'ich qiymatlarni mount paytida oladi, shuning uchun u
// ma'lumot kelgandan keyingina chiziladi.
// ─────────────────────────────────────────────────────────────────────────────
export default function ExecutorQuestionnaireLoader({ initialStep = 0, initialType = 'model' }) {
    const fetcher = useCallback(() => performerApi.cabinet(), [])
    const { data, loading } = useApi(fetcher)

    if (loading) {
        return (
            <Container>
                <div className="my-[16px] h-[600px] animate-pulse rounded-[6px] bg-black/5 lg:my-[24px]" />
            </Container>
        )
    }

    const values = toFormValues(data)

    return (
        <ExecutorQuestionnaireForm
            initialStep={initialStep}
            initialType={values?.type || initialType}
            initialValues={values}
        />
    )
}
