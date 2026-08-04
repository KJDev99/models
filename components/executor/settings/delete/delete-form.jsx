'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import FormCard from '@/components/cabinet/form-card'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { useApiStore } from '@/store/useApiStore'

export default function ExecutorDeleteForm() {
    const router = useRouter()
    const getDataToken = useApiStore((s) => s.getDataToken)
    const postDataToken = useApiStore((s) => s.postDataToken)
    const loading = useApiStore((s) => s.loading)

    const [form, setForm] = useState({ password: '', reason: '' })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    async function submit() {
        const res = await postDataToken('/auth/account/delete/', form)
        if (res.success) {
            toast.success('Сохранено')
        } else {
            toast.error('Не удалось сохранить')
        }
    }

    return (
        <FormCard
            title="Удалить аккаунт"
            description="Удаление аккаунта без возможности восстановления"
            onSubmit={submit}
            submitText="Удалить аккаунт"
            submitVariant="danger"
            loading={loading}
        >
                <Input label="Пароль" type="password" value={form.password} onChange={set('password')} required />
                <Textarea label="Причина удаления" value={form.reason} maxLength={2000} onChange={set('reason')} />
        </FormCard>
    )
}
