'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AuthCard from '@/components/auth/auth-card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { ROLES, homeForRole } from '@/lib/roles'
import { useApiStore } from '@/store/useApiStore'

// Figma: "Регистрация - агенство" (85:5303).
export default function AgencyForm() {
    const router = useRouter()
    const postDataToken = useApiStore((s) => s.postDataToken)
    const [form, setForm] = useState({ name: '', inn: '', city: '', site: '', about: '' })
    const [loading, setLoading] = useState(false)

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    async function submit(e) {
        e.preventDefault()
        if (!form.name) {
            toast.error('Укажите название агентства')
            return
        }
        setLoading(true)
        const res = await postDataToken('/agencies/', form)
        setLoading(false)
        if (res.success) {
            router.push(homeForRole(ROLES.AGENCY))
        } else {
            toast.error('Не удалось сохранить данные агентства')
        }
    }

    return (
        <AuthCard
            title="Данные агентства"
            description="Заполните профиль — после модерации агентство появится в каталоге."
            back="/auth/register/role"
        >
            <form onSubmit={submit} className="flex flex-col gap-5">
                <Input label="Название агентства" value={form.name} onChange={set('name')} required />
                <Input label="ИНН" value={form.inn} onChange={set('inn')} />
                <Input label="Город" value={form.city} onChange={set('city')} />
                <Input label="Сайт" placeholder="https://" value={form.site} onChange={set('site')} />
                <Textarea
                    label="О агентстве"
                    value={form.about}
                    maxLength={1000}
                    onChange={set('about')}
                />
                <Button type="submit" loading={loading} full>
                    Отправить на модерацию
                </Button>
            </form>
        </AuthCard>
    )
}
