'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Container from '@/components/ui/container'
import PageHeader from '@/components/ui/page-header'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { useApiStore } from '@/store/useApiStore'

// Figma: Контакты (164:14294).
const CONTACTS = [
    { label: 'Почта', value: 'hello@basemodels.ru', href: 'mailto:hello@basemodels.ru' },
    { label: 'Телефон', value: '+7 (999) 000-00-00', href: 'tel:+79990000000' },
    { label: 'Telegram', value: '@basemodels', href: 'https://t.me/basemodels' },
]

export default function ContactsView() {
    const postData = useApiStore((s) => s.postData)
    const [form, setForm] = useState({ name: '', contact: '', message: '' })
    const [sending, setSending] = useState(false)

    function set(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    }

    async function submit(e) {
        e.preventDefault()
        if (!form.name || !form.contact || !form.message) {
            toast.error('Заполните все поля')
            return
        }
        setSending(true)
        const res = await postData('/feedback/', form)
        setSending(false)
        if (res.success) {
            toast.success('Сообщение отправлено')
            setForm({ name: '', contact: '', message: '' })
        } else {
            toast.error('Не удалось отправить сообщение')
        }
    }

    return (
        <Container className="my-8 lg:my-12">
            <PageHeader
                breadcrumb={[{ name: 'Главная', href: '/' }, { name: 'Контакты' }]}
                title="Контакты"
                description="Ответим на вопросы о работе платформы, модерации и сотрудничестве."
            />

            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                <Card title="Связаться с нами">
                    <ul className="flex flex-col gap-4">
                        {CONTACTS.map((c) => (
                            <li key={c.label} className="flex items-center justify-between gap-4">
                                <span className="text-sm text-grey">{c.label}</span>
                                <a
                                    href={c.href}
                                    className="text-base text-black transition-colors hover:text-gold"
                                >
                                    {c.value}
                                </a>
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card title="Написать нам">
                    <form onSubmit={submit} className="flex flex-col gap-5">
                        <Input label="Имя" value={form.name} onChange={set('name')} required />
                        <Input
                            label="Почта или телефон"
                            value={form.contact}
                            onChange={set('contact')}
                            required
                        />
                        <Textarea
                            label="Сообщение"
                            value={form.message}
                            maxLength={1000}
                            onChange={set('message')}
                            required
                        />
                        <Button type="submit" loading={sending} full>
                            Отправить
                        </Button>
                    </form>
                </Card>
            </div>
        </Container>
    )
}
