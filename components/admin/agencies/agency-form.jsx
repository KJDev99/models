'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
    AdminBreadcrumb,
    AdminField,
    AdminFieldGroup,
    AdminFieldRow,
    AdminFormHeader,
    AdminFormLayout,
    AdminFormSection,
    AdminFormSteps,
    AdminInput,
    AdminTextarea,
} from '@/components/admin/ui/admin-form'
import { CreatedModal } from '@/components/admin/ui/admin-modals'
import { useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'

// Figma: Создать агентство (338:17831 / 452:16203)
export default function AdminAgencyForm() {
    const router = useRouter()
    const [done, setDone] = useState(false)
    const [savedId, setSavedId] = useState(null)
    const create = useAction(adminApi.createAgency)
    const [form, setForm] = useState({
        name: '',
        manager: '',
        field: '',
        city: '',
        about: '',
        email: '',
        phone: '',
        password: '',
    })

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    // POST /admin/agencies (backend/admin.md).
    async function submit() {
        const res = await create.run({
            agency_name: form.name,
            representative_name: form.manager || undefined,
            sphere_of_activity: form.field || undefined,
            city: form.city || undefined,
            about: form.about || undefined,
            email: form.email,
            phone: form.phone || undefined,
            password: form.password,
        })
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        setSavedId(res.data?.id || res.data?.user?.id || null)
        setDone(true)
    }

    return (
        <>
            <AdminBreadcrumb
                items={[
                    { label: 'Административная панель', href: '/admin/dashboard' },
                    { label: 'Агентства', href: '/admin/agencies' },
                    { label: 'Создать агентство' },
                ]}
            />

            <AdminFormLayout
                aside={
                    <AdminFormSteps
                        title="Создание агентства"
                        steps={['Основная информация', 'Данные для входа']}
                        current={0}
                        onSubmit={submit}
                        submitLabel={create.loading ? 'Сохраняем…' : 'Сохранить'}
                    />
                }
            >
                <AdminFormHeader
                    title="Создать агентство"
                    description="Заполните информацию об агентстве. После сохранения оно появится в каталоге агентств."
                />

                <AdminFormSection step={1} title="Основная информация">
                    <AdminFieldGroup>
                        <AdminFieldRow>
                            <AdminField label="Название агентства">
                                <AdminInput
                                    value={form.name}
                                    onChange={(e) => set('name', e.target.value)}
                                    placeholder="LUMEN AGENCY"
                                />
                            </AdminField>
                            <AdminField
                                label="Имя представителя"
                                hint="Видно только администрации и используется для связи с агентством."
                            >
                                <AdminInput
                                    value={form.manager}
                                    onChange={(e) => set('manager', e.target.value)}
                                    placeholder="Алексей"
                                />
                            </AdminField>
                        </AdminFieldRow>

                        <AdminFieldRow>
                            <AdminField label="Сфера деятельности">
                                <AdminInput
                                    value={form.field}
                                    onChange={(e) => set('field', e.target.value)}
                                    placeholder="Модельное и креативное агентство"
                                />
                            </AdminField>
                            <AdminField label="Город">
                                <AdminInput
                                    value={form.city}
                                    onChange={(e) => set('city', e.target.value)}
                                    placeholder="Санкт-Петербург"
                                />
                            </AdminField>
                        </AdminFieldRow>

                        <AdminField label="О компании">
                            <AdminTextarea
                                value={form.about}
                                onChange={(e) => set('about', e.target.value)}
                                max={600}
                                placeholder="Расскажите об агентстве, его специализации и опыте работы."
                            />
                        </AdminField>
                    </AdminFieldGroup>
                </AdminFormSection>

                <AdminFormSection step={2} title="Данные для входа">
                    <AdminFieldGroup>
                        <AdminField label="Электронная почта">
                            <AdminInput
                                type="email"
                                value={form.email}
                                onChange={(e) => set('email', e.target.value)}
                                placeholder="Введите почту"
                            />
                        </AdminField>
                        <AdminField label="Телефон">
                            <AdminInput
                                type="tel"
                                value={form.phone}
                                onChange={(e) => set('phone', e.target.value)}
                                placeholder="Введите номер телефона"
                            />
                        </AdminField>
                        <AdminField label="Пароль">
                            <AdminInput
                                type="password"
                                value={form.password}
                                onChange={(e) => set('password', e.target.value)}
                                placeholder="Введите пароль"
                            />
                        </AdminField>
                    </AdminFieldGroup>
                </AdminFormSection>
            </AdminFormLayout>

            <CreatedModal
                open={done}
                onClose={() => {
                    setDone(false)
                    router.push('/admin/agencies')
                }}
                viewHref={savedId ? `/admin/agencies/${savedId}` : '/admin/agencies'}
                listHref="/admin/agencies"
            />
        </>
    )
}
