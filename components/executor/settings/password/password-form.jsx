'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import FormCard from '@/components/cabinet/form-card'
import Input from '@/components/ui/input'
import { useApiStore } from '@/store/useApiStore'

export default function ExecutorPasswordForm() {
    const router = useRouter()
    const getDataToken = useApiStore((s) => s.getDataToken)
    const postDataToken = useApiStore((s) => s.postDataToken)
    const loading = useApiStore((s) => s.loading)

    const [form, setForm] = useState({ oldPassword: '', newPassword: '', repeatPassword: '' })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    async function submit() {
        const res = await postDataToken('/auth/password/change/', form)
        if (res.success) {
            toast.success('Сохранено')
        } else {
            toast.error('Не удалось сохранить')
        }
    }

    return (
        <FormCard
            title="Изменить пароль"
            description="Смена пароля"
            onSubmit={submit}
            submitText="Сохранить пароль"
            submitVariant="gold"
            loading={loading}
        >
                <Input label="Текущий пароль" type="password" value={form.oldPassword} onChange={set('oldPassword')} required />
                <Input label="Новый пароль" type="password" value={form.newPassword} onChange={set('newPassword')} required />
                <Input label="Повторите пароль" type="password" value={form.repeatPassword} onChange={set('repeatPassword')} required />
        </FormCard>
    )
}
