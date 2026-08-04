'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import FormCard from '@/components/cabinet/form-card'
import Input from '@/components/ui/input'
import { useApiStore } from '@/store/useApiStore'

export default function ExecutorPhoneForm() {
    const router = useRouter()
    const getDataToken = useApiStore((s) => s.getDataToken)
    const postDataToken = useApiStore((s) => s.postDataToken)
    const loading = useApiStore((s) => s.loading)

    const [form, setForm] = useState({ phone: '', password: '' })

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    async function submit() {
        const res = await postDataToken('/auth/phone/change/', form)
        if (res.success) {
            toast.success('Сохранено')
        } else {
            toast.error('Не удалось сохранить')
        }
    }

    return (
        <FormCard
            title="Изменить телефон"
            description="Смена номера телефона"
            onSubmit={submit}
            submitText="Отправить код"
            submitVariant="gold"
            loading={loading}
        >
                <Input label="Новый телефон" type="tel" value={form.phone} onChange={set('phone')} />
                <Input label="Пароль" type="password" value={form.password} onChange={set('password')} required />
        </FormCard>
    )
}
