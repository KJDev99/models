'use client'

import React, { useCallback, useMemo } from 'react'
import Container from '@/components/ui/container'
import ExecutorQuestionnaireForm from '@/components/executor/questionnaire/questionnaire-form'
import { toFormValues } from '@/components/executor/questionnaire/questionnaire-api'
import { useApi } from '@/lib/use-api'
import * as agencyApi from '@/lib/api/agency'
import * as site from '@/lib/api/site'

// ─────────────────────────────────────────────────────────────────────────────
// «Агентство» kabinetidagi anketani tahrirlash — Figma 345:19306.
// Forma «Добавить исполнителя» bilan aynan bir xil, faqat to'ldirilgan holda
// ochiladi va endpointlar mavjud yozuvga ishlaydi (backend/agency.md).
// ─────────────────────────────────────────────────────────────────────────────
export default function AgencyEditExecutor({ id }) {
    const fetcher = useCallback(() => agencyApi.performer(id), [id])
    const { data, loading, error } = useApi(fetcher, { enabled: Boolean(id) })

    // Mavjud yozuv uchun endpoint to'plami.
    const actions = useMemo(
        () => ({
            load: async () => null,
            saveProfile: (body) => agencyApi.updatePerformer(id, body),
            saveExperience: (items) => agencyApi.updatePerformer(id, { experience: items }),
            setPhoto: (url) => agencyApi.addPerformerPhoto(id, { url }),
            addPhoto: (url, album) => agencyApi.addPerformerPhoto(id, { url, album }),
            submit: async () => null,
            upload: (file) => site.upload(file),
        }),
        [id],
    )

    if (loading || error || !data) {
        return (
            <Container>
                <div className="my-[16px] lg:my-[24px]">
                    {loading ? (
                        <div className="h-[600px] animate-pulse rounded-[6px] bg-black/5" />
                    ) : (
                        <p className="rounded-[6px] bg-white p-[40px] text-center text-[14px] text-grey lg:text-[16px]">
                            {error?.message || 'Анкета не найдена'}
                        </p>
                    )}
                </div>
            </Container>
        )
    }

    const values = toFormValues(data)
    const title = 'Редактировать исполнителя'

    return (
        <ExecutorQuestionnaireForm
            actions={actions}
            contactFields
            initialType={values?.type || 'model'}
            initialValues={values}
            doneHref={`/agency/executors/${id}`}
            doneLabel="Перейти к анкете"
            title={title}
            description="Измените информацию об исполнителе. После сохранения анкета снова пройдет модерацию."
            aboutPlaceholder="Расскажите об исполнителе, его опыте работы и направлениях деятельности."
            resultTitle="Изменения сохранены"
            resultText={'Мы проверим данные и портфолио.\nПосле одобрения анкета появится в каталоге.'}
            breadcrumb={[
                { label: 'Главная', href: '/' },
                { label: 'Личный кабинет', href: '/agency/dashboard' },
                { label: title },
            ]}
        />
    )
}
