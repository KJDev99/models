'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import FormCard from '@/components/cabinet/form-card'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import Toggle from '@/components/ui/toggle'
import Card from '@/components/ui/card'
import { useApiStore } from '@/store/useApiStore'

// Platforma sozlamalari: moderatsiya rejimi, kontaktlar, matnlar.
const FLAGS = [
    {
        key: 'autoModeration',
        label: 'Автомодерация анкет',
        description: 'Анкеты публикуются сразу, без ручной проверки.',
    },
    {
        key: 'registrationOpen',
        label: 'Открытая регистрация',
        description: 'Выключите, чтобы временно закрыть приём новых пользователей.',
    },
    {
        key: 'reviewsModeration',
        label: 'Модерация отзывов',
        description: 'Отзывы публикуются только после проверки модератором.',
    },
]

export default function AdminSettings() {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const patchDataToken = useApiStore((s) => s.patchDataToken)
    const loading = useApiStore((s) => s.loading)

    const [form, setForm] = useState({ supportEmail: '', supportPhone: '', announcement: '' })
    const [flags, setFlags] = useState({})

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    useEffect(() => {
        let alive = true
        getDataToken('/admin/settings/').then((res) => {
            if (!alive || !res.success || !res.data) return
            setForm((f) => {
                const next = { ...f }
                Object.keys(f).forEach((k) => {
                    if (res.data[k] != null) next[k] = res.data[k]
                })
                return next
            })
            setFlags(res.data.flags || {})
        })
        return () => {
            alive = false
        }
    }, [getDataToken])

    async function submit() {
        const res = await patchDataToken('/admin/settings/', { ...form, flags })
        if (res.success) toast.success('Настройки сохранены')
        else toast.error('Не удалось сохранить')
    }

    async function toggleFlag(key, value) {
        const next = { ...flags, [key]: value }
        setFlags(next)
        const res = await patchDataToken('/admin/settings/', { flags: next })
        if (!res.success) {
            toast.error('Не удалось сохранить')
            setFlags(flags)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <Card title="Режимы работы">
                <div className="flex flex-col gap-6">
                    {FLAGS.map((f) => (
                        <Toggle
                            key={f.key}
                            label={f.label}
                            description={f.description}
                            checked={Boolean(flags[f.key])}
                            onChange={(v) => toggleFlag(f.key, v)}
                        />
                    ))}
                </div>
            </Card>

            <FormCard
                title="Контакты и объявления"
                description="Эти данные показываются на странице контактов и в шапке сайта."
                onSubmit={submit}
                loading={loading}
            >
                <Input label="Почта поддержки" type="email" value={form.supportEmail} onChange={set('supportEmail')} />
                <Input label="Телефон поддержки" type="tel" value={form.supportPhone} onChange={set('supportPhone')} />
                <Textarea
                    label="Объявление для пользователей"
                    value={form.announcement}
                    maxLength={500}
                    onChange={set('announcement')}
                />
            </FormCard>
        </div>
    )
}
