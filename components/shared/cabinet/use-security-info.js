'use client'

import { useCallback } from 'react'
import { useApi } from '@/lib/use-api'
import { securityApi } from '@/components/shared/cabinet/security-actions'
import { formatDate } from '@/lib/format'

// ─────────────────────────────────────────────────────────────────────────────
// «Безопасность» bo'limidagi uchta qator uchun izoh matni.
//
//   GET /customer/settings  ·  GET /performer/settings
//   → { email_masked, phone_masked, password_changed_at }
//
// Pochta va telefon niqoblangan holda keladi («c*****r@mail.ru»,
// «+7 (900)-***-**-33») — Figma 260:6989 da ham shunday. Agentlikda bunday
// ruchka yo'q (`securityApi` → `settings: null`), shunda so'rov ketmaydi va
// profildagi ochiq qiymatlar ishlatiladi.
// ─────────────────────────────────────────────────────────────────────────────
export function useSecurityNote(role, profile) {
    const load = securityApi(role).settings
    const fetcher = useCallback(() => load(), [load])
    const { data } = useApi(fetcher, { enabled: Boolean(load) })

    return useCallback(
        (key) => {
            if (key === 'password') {
                const changedAt = data?.password_changed_at || profile?.passwordChangedAt
                return changedAt
                    ? `Последнее изменение ${formatDate(changedAt)}`
                    : 'Смените пароль, если давно этого не делали'
            }
            if (key === 'email') {
                return data?.email_masked || data?.email || profile?.email || 'Не указана'
            }
            return (
                data?.phone_masked || data?.phone_display || profile?.phone || 'Не указан'
            )
        },
        [data, profile],
    )
}
