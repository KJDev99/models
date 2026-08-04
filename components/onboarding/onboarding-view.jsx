'use client'

import React from 'react'
import Container from '@/components/ui/container'
import PageHeader from '@/components/ui/page-header'
import Button from '@/components/ui/button'
import { SELECTABLE_ROLES, ROLE_META } from '@/lib/roles'

// Figma: onboarding ekranlari 2 / 3 / 4 (52:1338, 52:1400, 52:1463).
const STEPS = [
    {
        title: 'Зарегистрируйтесь и выберите роль',
        text: 'Заказчик, компания, исполнитель или агентство — кабинет подстроится под задачу.',
    },
    {
        title: 'Заполните профиль',
        text: 'Исполнители заполняют анкету и портфолио, заказчики — данные компании и проекты.',
    },
    {
        title: 'Пройдите модерацию',
        text: 'Проверка занимает до 24 часов. После неё профиль появится в каталоге.',
    },
    {
        title: 'Работайте напрямую',
        text: 'Приглашения, отклики, бронирование площадок и переписка — внутри платформы.',
    },
]

export default function OnboardingView() {
    return (
        <Container className="my-8 lg:my-12">
            <PageHeader
                breadcrumb={[{ name: 'Главная', href: '/' }, { name: 'Как это работает' }]}
                title="Как это работает"
                description="Четыре шага от регистрации до первой съёмки."
            />

            <ol className="flex flex-col gap-4 lg:gap-6">
                {STEPS.map((step, i) => (
                    <li
                        key={step.title}
                        className="flex flex-col gap-4 rounded-[16px] border border-black/8 bg-white p-6 sm:flex-row sm:items-center lg:p-8"
                    >
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-lg text-white">
                            {i + 1}
                        </span>
                        <div>
                            <h2 className="text-xl text-black lg:text-2xl">{step.title}</h2>
                            <p className="mt-2 text-base text-grey">{step.text}</p>
                        </div>
                    </li>
                ))}
            </ol>

            <section className="mt-12">
                <h2 className="text-[24px] font-medium text-black lg:text-[32px]">Роли на платформе</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                    {SELECTABLE_ROLES.map((role) => (
                        <div key={role} className="rounded-[16px] border border-black/8 bg-white p-6">
                            <p className="text-lg text-black">{ROLE_META[role].label}</p>
                            <p className="mt-1 text-sm text-grey">{ROLE_META[role].sublabel}</p>
                            <p className="mt-3 text-base text-grey">{ROLE_META[role].description}</p>
                        </div>
                    ))}
                </div>

                <Button href="/auth/register" size="lg" className="mt-8">
                    Начать
                </Button>
            </section>
        </Container>
    )
}
