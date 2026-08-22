'use client'

import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import SettingsNav from '@/components/cabinet/settings-nav'
import Card from '@/components/ui/card'
import Toggle from '@/components/ui/toggle'
import Spinner from '@/components/ui/spinner'
import { useApi, useAction } from '@/lib/use-api'
import * as performerApi from '@/lib/api/performer'

// ─────────────────────────────────────────────────────────────────────────────
// «Видимость профиля» — Figma 334:14236.
//
// Ma'lumot: GET /performer/settings → `is_hidden`, `show_phone`, `show_email`,
// `allow_invites`.
// Saqlash: PATCH /performer/settings/visibility — to'rtala bayroq bitta so'rovda.
//
// «Показывать анкету» teskari bayroq: yoqilgan bo'lsa `is_hidden: false`.
// ─────────────────────────────────────────────────────────────────────────────

const OPTIONS = [
    {
        key: 'visible',
        label: 'Показывать анкету в каталоге',
        description: 'Выключите, если временно не берёте заказы.',
    },
    {
        key: 'showPhone',
        label: 'Показывать телефон',
        description: 'Виден только заказчикам, с которыми есть переписка.',
    },
    {
        key: 'showEmail',
        label: 'Показывать почту',
        description: 'Видна только заказчикам, с которыми есть переписка.',
    },
    {
        key: 'allowInvites',
        label: 'Разрешить приглашения в проекты',
        description: 'Заказчики смогут приглашать вас напрямую.',
    },
]

export default function ExecutorVisibilityView() {
    const fetcher = useCallback(() => performerApi.settings(), [])
    const { data, loading, error, reload } = useApi(fetcher)

    return (
        <>
            <SettingsNav rolePrefix="executor" />
            <Card title="Видимость профиля">
                {loading || !data ? (
                    <div className="flex justify-center py-10">
                        {loading ? <Spinner /> : <p className="text-base text-grey">{error?.message}</p>}
                    </div>
                ) : (
                    <VisibilityForm data={data} onSaved={reload} />
                )}
            </Card>
        </>
    )
}

function VisibilityForm({ data, onSaved }) {
    const save = useAction(performerApi.setVisibility)

    // Forma javob kelgandan keyin mount bo'ladi — boshlang'ich qiymatlar
    // `useState` initsializatorida o'qiladi.
    const [state, setState] = useState(() => ({
        visible: data.is_hidden !== true,
        showPhone: data.show_phone !== false,
        showEmail: data.show_email !== false,
        allowInvites: data.allow_invites !== false,
    }))

    async function toggle(key, value) {
        const next = { ...state, [key]: value }
        // Optimistik yangilash — tugma darhol javob beradi.
        setState(next)

        const res = await save.run({
            isHidden: !next.visible,
            showPhone: next.showPhone,
            showEmail: next.showEmail,
            allowInvites: next.allowInvites,
        })
        if (!res.success) {
            toast.error(res.error.message)
            setState(state)
            return
        }
        toast.success('Настройки сохранены')
        onSaved?.()
    }

    return (
        <div className="flex flex-col gap-6">
            {OPTIONS.map((o) => (
                <Toggle
                    key={o.key}
                    label={o.label}
                    description={o.description}
                    checked={state[o.key]}
                    onChange={(v) => toggle(o.key, v)}
                />
            ))}
        </div>
    )
}
