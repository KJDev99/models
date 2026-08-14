'use client'

import React, { useState } from 'react'
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

// Figma: Создать агентство (338:17831 / 452:16203)
export default function AdminAgencyForm() {
    const [done, setDone] = useState(false)
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
                        onSubmit={() => setDone(true)}
                        submitLabel="Сохранить"
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
                onClose={() => setDone(false)}
                viewHref="/admin/agencies/a-1"
                listHref="/admin/agencies"
            />
        </>
    )
}
