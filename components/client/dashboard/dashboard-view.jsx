'use client'

import React, { useEffect, useState } from 'react'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Avatar from '@/components/ui/avatar'
import EmptyState from '@/components/ui/empty-state'
import Spinner from '@/components/ui/spinner'
import { formatPhone } from '@/lib/format'
import { useApiStore } from '@/store/useApiStore'

// Figma: "Пустой профиль" (260:12521) va заказчик личные данные.
export default function ClientDashboard() {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let alive = true
        getDataToken('/profile/').then((res) => {
            if (!alive) return
            setProfile(res.success ? res.data : null)
            setLoading(false)
        })
        return () => {
            alive = false
        }
    }, [getDataToken])

    if (loading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Spinner size={32} />
            </div>
        )
    }

    if (!profile) {
        return (
            <EmptyState
                title="Профиль не заполнен"
                description="Добавьте имя, город и контакты — исполнители будут охотнее откликаться."
                actionText="Заполнить профиль"
                actionHref="/client/settings"
            />
        )
    }

    const rows = [
        { label: 'Имя', value: profile.name },
        { label: 'Город', value: profile.city },
        { label: 'Телефон', value: formatPhone(profile.phone) },
        { label: 'Почта', value: profile.email },
    ].filter((r) => r.value)

    return (
        <div className="flex flex-col gap-6">
            <Card
                title="Личные данные"
                action={
                    <Button href="/client/settings" variant="whiteStroke" size="sm">
                        Редактировать
                    </Button>
                }
            >
                <div className="flex flex-wrap items-center gap-5">
                    <Avatar src={profile.avatar} name={profile.name} size="xl" />
                    <dl className="flex min-w-[240px] flex-1 flex-col gap-3">
                        {rows.map((r) => (
                            <div key={r.label} className="flex items-center justify-between gap-4">
                                <dt className="text-sm text-grey">{r.label}</dt>
                                <dd className="text-base text-black">{r.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <p className="text-sm text-grey">Активных проектов</p>
                    <p className="mt-2 text-[28px] leading-none text-black">{profile.activeProjects ?? 0}</p>
                </Card>
                <Card>
                    <p className="text-sm text-grey">Приглашений</p>
                    <p className="mt-2 text-[28px] leading-none text-black">{profile.invitesCount ?? 0}</p>
                </Card>
                <Card>
                    <p className="text-sm text-grey">В избранном</p>
                    <p className="mt-2 text-[28px] leading-none text-black">{profile.favoritesCount ?? 0}</p>
                </Card>
            </div>
        </div>
    )
}
