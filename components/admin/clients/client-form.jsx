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
    AdminFormTabs,
    AdminInput,
    AdminTextarea,
} from '@/components/admin/ui/admin-form'
import { CreatedModal } from '@/components/admin/ui/admin-modals'

// ─────────────────────────────────────────────────────────────────────────────
// «Создать заказчика» — Figma'da alohida freym chizilmagan, «Создать
// исполнителя» (335:14800) qolipida, zakazchik maydonlari bilan.
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminClientForm() {
    const [done, setDone] = useState(false)
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
                        onSubmit={() => setDone(true)}
                        submitLabel="Сохранить"
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
                onClose={() => setDone(false)}
                viewHref="/admin/clients/c-2"
                listHref="/admin/clients"
            />
        </>
    )
}
