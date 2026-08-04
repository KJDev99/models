'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import SettingsNav from '@/components/cabinet/settings-nav'
import Card from '@/components/ui/card'
import Toggle from '@/components/ui/toggle'
import Spinner from '@/components/ui/spinner'
import { useApiStore } from '@/store/useApiStore'

// Figma: "Видимость профиля" (334:14236).
const OPTIONS = [
    {
        key: 'isPublic',
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
        description: 'Виден только заказчикам, с которыми есть переписка.',
    },
    {
        key: 'allowInvites',
        label: 'Разрешить приглашения в проекты',
        description: 'Заказчики смогут приглашать вас напрямую.',
    },
]

export default function ExecutorVisibilityView() {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const patchDataToken = useApiStore((s) => s.patchDataToken)

    const [settings, setSettings] = useState(null)

    useEffect(() => {
        let alive = true
        getDataToken('/executors/mine/visibility/').then((res) => {
            if (!alive) return
            setSettings(res.success && res.data ? res.data : {
                isPublic: true,
                showPhone: false,
                showEmail: false,
                allowInvites: true,
            })
        })
        return () => {
            alive = false
        }
    }, [getDataToken])

    async function toggle(key, value) {
        const next = { ...settings, [key]: value }
        setSettings(next)
        const res = await patchDataToken('/executors/mine/visibility/', { [key]: value })
        if (!res.success) {
            toast.error('Не удалось сохранить')
            setSettings(settings)
        }
    }

    return (
        <>
            <SettingsNav rolePrefix="executor" />
            <Card title="Видимость профиля">
                {!settings ? (
                    <div className="flex justify-center py-10">
                        <Spinner />
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {OPTIONS.map((o) => (
                            <Toggle
                                key={o.key}
                                label={o.label}
                                description={o.description}
                                checked={settings[o.key]}
                                onChange={(v) => toggle(o.key, v)}
                            />
                        ))}
                    </div>
                )}
            </Card>
        </>
    )
}
