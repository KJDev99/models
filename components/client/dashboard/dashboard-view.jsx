'use client'

import React, { useCallback, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Globe, ImageIcon, Mail, Phone, SquarePen } from 'lucide-react'
import Button from '@/components/ui/button'
import Container from '@/components/ui/container'
import { ClientPage, ClientTitle } from '@/components/client/ui/client-ui'
// «Мои публикации» bloki adminkadagi «Профиль компании» bilan bitta Figma
// komponenti (338:16522 ↔ 208:4792), shuning uchun u qayta ishlatiladi.
import AdminPublications from '@/components/admin/ui/admin-publications'
import ClientProfileModal from '@/components/client/dashboard/profile-modal'
import { publicationMenu } from '@/components/admin/ui/admin-menu-items'
import { useApi } from '@/lib/use-api'
import * as customerApi from '@/lib/api/customer'
import { customerProfile, publicationsFrom } from '@/lib/adapters'

// ─────────────────────────────────────────────────────────────────────────────
// «Личный кабинет» — Figma «Пустой профиль» 260:12521 va
// «Профиль компании - проекты» 208:4733 / mobil 393:16511 · 393:16938.
//
// Chapda 554px rasm, o'ngda oq kartochka (nomi, shahri, tavsifi, kontaktlari,
// 4 ta hisoblagich va ikkita tugma). Ostida «Мои публикации».
// ─────────────────────────────────────────────────────────────────────────────
export default function ClientDashboard({ openSettings = false }) {
    const [editing, setEditing] = useState(openSettings)

    // GET /customer/cabinet — profil, hisoblagichlar va publikatsiyalar
    // bitta so'rovda keladi (backend/customer.md).
    const fetcher = useCallback(() => customerApi.cabinet(), [])
    const { data, loading, reload } = useApi(fetcher)

    const profile = useMemo(() => customerProfile(data), [data])
    const publications = useMemo(() => publicationsFrom(data, { base: '/client' }), [data])
    const items = publications.items

    if (loading || !profile) {
        return (
            <Container>
                <div className="my-[24px] flex flex-col gap-[16px] lg:my-[40px] lg:gap-[24px]">
                    <div className="h-[240px] animate-pulse rounded-[6px] bg-black/5 lg:h-[600px]" />
                </div>
            </Container>
        )
    }

    return (
        <Container>
            <ClientPage breadcrumb={[{ label: 'Главная', href: '/' }, { label: 'Личный кабинет' }]}>
                <div className="flex flex-col gap-[12px] lg:flex-row lg:gap-[16px]">
                    <ProfileImage logo={profile.logo} name={profile.name} />

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
                        <div className="flex flex-col gap-[16px] lg:gap-[24px]">
                            <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                                <div className="flex items-center justify-between gap-[12px]">
                                    <h1 className="text-[24px] font-medium text-black lg:text-[32px]">
                                        {profile.name}
                                    </h1>
                                    <button
                                        type="button"
                                        onClick={() => setEditing(true)}
                                        aria-label="Редактировать профиль"
                                        className="ui-icon-btn flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] p-[4px]"
                                    >
                                        <SquarePen size={24} strokeWidth={2} />
                                    </button>
                                </div>

                                <p className="flex flex-wrap items-center gap-x-[12px] gap-y-[10px] text-[14px] font-medium text-grey lg:text-[16px]">
                                    {profile.note && (
                                        <>
                                            <span>{profile.note}</span>
                                            <span aria-hidden className="text-grey">
                                                ·
                                            </span>
                                        </>
                                    )}
                                    <span>{profile.city}</span>
                                </p>
                            </div>

                            <ProfileSection title="О компании">
                                <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                                    {profile.about}
                                </p>
                            </ProfileSection>

                            <ProfileSection title="Контакты">
                                {profile.phone || profile.email || profile.site ? (
                                    <div className="flex flex-col gap-[12px] lg:flex-row lg:flex-wrap lg:items-center lg:gap-[24px]">
                                        {/* Backend to'ldirilmagan maydonni bo'sh qaytaradi —
                                            bunday qatorni umuman chizmaymiz. */}
                                        {profile.phone && (
                                            <Contact icon={Phone} href={`tel:${profile.phone}`}>
                                                {profile.phone}
                                            </Contact>
                                        )}
                                        {profile.email && (
                                            <Contact icon={Mail} href={`mailto:${profile.email}`}>
                                                {profile.email}
                                            </Contact>
                                        )}
                                        {profile.site && (
                                            <Contact icon={Globe} href={`https://${profile.site}`}>
                                                {profile.site}
                                            </Contact>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-[14px] text-grey lg:text-[16px]">
                                        Контакты не добавлены
                                    </p>
                                )}
                            </ProfileSection>

                            <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4 lg:gap-[16px]">
                                {profile.stats.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="flex flex-col gap-[12px] rounded-[6px] bg-light-white p-[16px] text-black lg:gap-[16px]"
                                    >
                                        <span className="font-display text-[24px] leading-none uppercase lg:text-[32px]">
                                            {stat.value}
                                        </span>
                                        <span className="text-[12px] lg:text-[14px]">
                                            {stat.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-[12px] lg:flex-row lg:gap-[16px]">
                            {/* Figma 260:12574: gold tugma 353px, ikkinchisi qolgan joyni oladi. */}
                            <Button
                                href="/client/projects/new"
                                variant="gold"
                                full
                                className="lg:w-[353px] lg:shrink-0"
                            >
                                Разместить проект
                            </Button>
                            <Button
                                href="/client/venues/new"
                                variant="goldStroke"
                                full
                                className="lg:min-w-0 lg:flex-1"
                            >
                                Добавить площадку
                            </Button>
                        </div>
                    </div>
                </div>

                {items.length === 0 ? (
                    <section className="flex flex-col gap-[16px] lg:gap-[24px]">
                        <ClientTitle>Мои публикации</ClientTitle>
                        <div className="flex flex-col gap-[12px]">
                            <p className="text-[16px] font-semibold text-black lg:text-[18px]">
                                Пока нет публикаций
                            </p>
                            <p className="text-[14px] text-grey lg:text-[16px]">
                                Разместите первый проект или добавьте площадку — после публикации
                                они появятся здесь.
                            </p>
                        </div>
                    </section>
                ) : (
                    <AdminPublications
                        tabs={publications.tabs}
                        items={items}
                        menuItems={publicationMenu}
                    />
                )}
            </ClientPage>

            {/* Oyna faqat ochilganda mount bo'ladi — shunda forma har safar
                joriy profil bilan boshlanadi. */}
            {editing && (
                <ClientProfileModal
                    open
                    onClose={() => setEditing(false)}
                    profile={profile}
                    onSaved={reload}
                />
            )}
        </Container>
    )
}

// Chapdagi rasm bloki (Figma 260:12948 — 554×600, bo'sh holatda joy egallovchi).
function ProfileImage({ logo, name }) {
    return (
        <div className="relative flex h-[240px] shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:h-[600px] lg:w-[554px]">
            {logo ? (
                <span className="absolute inset-0 flex items-center justify-center bg-white">
                    <Image
                        src={logo}
                        alt={name}
                        width={360}
                        height={160}
                        className="h-auto w-[60%] max-w-[360px] object-contain"
                    />
                </span>
            ) : (
                <ImageIcon
                    size={200}
                    strokeWidth={1}
                    aria-hidden
                    className="size-[120px] text-[#b3b3b3] lg:size-[200px]"
                />
            )}
        </div>
    )
}

function ProfileSection({ title, children }) {
    return (
        <div className="flex flex-col gap-[12px] lg:gap-[16px]">
            <h2 className="text-[16px] font-bold text-black lg:text-[18px]">{title}</h2>
            {children}
        </div>
    )
}

function Contact({ icon: Icon, href, children }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-[8px] text-[14px] text-grey transition-colors hover:text-black lg:text-[16px]"
        >
            <Icon size={24} strokeWidth={2} className="size-[20px] shrink-0 text-gold lg:size-[24px]" />
            {children}
        </Link>
    )
}
