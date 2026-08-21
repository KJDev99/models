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
    AdminFormTabs,
    AdminInput,
    AdminTextarea,
} from '@/components/admin/ui/admin-form'
import { CreatedModal } from '@/components/admin/ui/admin-modals'
import { useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'

// ─────────────────────────────────────────────────────────────────────────────
// «Создать заказчика» — Figma'da alohida freym chizilmagan, «Создать
// исполнителя» (335:14800) qolipida, zakazchik maydonlari bilan.
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminClientForm() {
    const router = useRouter()
    const [done, setDone] = useState(false)
    const [savedId, setSavedId] = useState(null)
    const create = useAction(adminApi.createCustomer)
    const [form, setForm] = useState({
        type: 'person',
        name: '',
        surname: '',
        company: '',
        field: '',
        city: '',
        about: '',
        email: '',
        phone: '',
        site: '',
        password: '',
    })

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    const company = form.type === 'company'

    // POST /admin/customers (backend/admin.md).
    async function submit() {
        const res = await create.run({
            customer_type: company ? 'company' : 'individual',
            company_name: company ? form.company : undefined,
            first_name: company ? undefined : form.name,
            last_name: company ? undefined : form.surname,
            business_field: form.field || undefined,
            city: form.city || undefined,
            about: form.about || undefined,
            email: form.email,
            phone: form.phone || undefined,
            website: form.site || undefined,
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
                    { label: 'Заказчики', href: '/admin/clients' },
                    { label: 'Создать заказчика' },
                ]}
            />

            <AdminFormLayout
                aside={
                    <AdminFormSteps
                        title="Создание профиля"
                        steps={['Основная информация', 'Данные для входа']}
                        current={0}
                        onSubmit={submit}
                        submitLabel={create.loading ? 'Сохраняем…' : 'Сохранить'}
                    />
                }
            >
                <AdminFormHeader
                    title="Создать заказчика"
                    description="Заполните основную информацию о заказчике. После сохранения профиль появится в списке заказчиков."
                />

                <AdminFormSection step={1} title="Основная информация">
                    <AdminFormTabs
                        tabs={[
                            { value: 'person', label: 'Частное лицо' },
                            { value: 'company', label: 'Компания' },
                        ]}
                        value={form.type}
                        onChange={(v) => set('type', v)}
                    />

                    <AdminFieldGroup>
                        {company ? (
                            <AdminFieldRow>
                                <AdminField label="Название компании">
                                    <AdminInput
                                        value={form.company}
                                        onChange={(e) => set('company', e.target.value)}
                                        placeholder="LIME"
                                    />
                                </AdminField>
                                <AdminField label="Сфера деятельности">
                                    <AdminInput
                                        value={form.field}
                                        onChange={(e) => set('field', e.target.value)}
                                        placeholder="Российский бренд одежды"
                                    />
                                </AdminField>
                            </AdminFieldRow>
                        ) : (
                            <AdminFieldRow>
                                <AdminField label="Имя">
                                    <AdminInput
                                        value={form.name}
                                        onChange={(e) => set('name', e.target.value)}
                                        placeholder="Иван"
                                    />
                                </AdminField>
                                <AdminField label="Фамилия">
                                    <AdminInput
                                        value={form.surname}
                                        onChange={(e) => set('surname', e.target.value)}
                                        placeholder="Иванов"
                                    />
                                </AdminField>
                            </AdminFieldRow>
                        )}

                        <AdminField label="Город">
                            <AdminInput
                                value={form.city}
                                onChange={(e) => set('city', e.target.value)}
                                placeholder="Санкт-Петербург"
                            />
                        </AdminField>

                        <AdminField label={company ? 'О компании' : 'О заказчике'}>
                            <AdminTextarea
                                value={form.about}
                                onChange={(e) => set('about', e.target.value)}
                                placeholder="Расскажите о заказчике и его проектах."
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
                        {company && (
                            <AdminField label="Сайт">
                                <AdminInput
                                    value={form.site}
                                    onChange={(e) => set('site', e.target.value)}
                                    placeholder="lime.ru"
                                />
                            </AdminField>
                        )}
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
                    router.push('/admin/clients')
                }}
                viewHref={savedId ? `/admin/clients/${savedId}` : '/admin/clients'}
                listHref="/admin/clients"
            />
        </>
    )
}
