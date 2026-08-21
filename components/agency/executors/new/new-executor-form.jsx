'use client'

import React, { useMemo } from 'react'
import ExecutorQuestionnaireForm from '@/components/executor/questionnaire/questionnaire-form'
import { agencyActions } from '@/components/executor/questionnaire/questionnaire-api'

// ─────────────────────────────────────────────────────────────────────────────
// «Добавить исполнителя» — Figma 270:21262, mobil 437:18035.
//
// Forma «Исполнитель» kabinetidagi anketa bilan aynan bir xil (turlar,
// bo'limlar, qadamlar), farqi faqat sarlavha, izoh va yo'lakcha.
// ─────────────────────────────────────────────────────────────────────────────
export default function AgencyNewExecutorForm({ mode = 'create' }) {
    const editing = mode === 'edit'
    const title = editing ? 'Редактировать исполнителя' : 'Добавить исполнителя'

    // Endpointlar to'plami bitta nusxada saqlanadi — yaratilgan anketa `id` si
    // qadamlar orasida shu yerda yashaydi.
    const actions = useMemo(() => agencyActions(), [])

    return (
        <ExecutorQuestionnaireForm
            actions={actions}
            contactFields
            doneHref="/agency/dashboard"
            doneLabel="Перейти в личный кабинет"
            title={title}
            description="Заполните основную информацию об исполнителе. После отправки анкета пройдет модерацию и станет доступна заказчикам в каталоге исполнителей."
            aboutPlaceholder="Расскажите об исполнителе, его опыте работы и направлениях деятельности."
            resultTitle="Анкета успешно отправлена на модерацию"
            resultText={
                'Мы проверим данные и портфолио.\n' +
                'После одобрения анкета появится в каталоге исполнителей.'
            }
            breadcrumb={[
                { label: 'Главная', href: '/' },
                { label: 'Личный кабинет', href: '/agency/dashboard' },
                { label: title },
            ]}
        />
    )
}
