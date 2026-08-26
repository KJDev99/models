'use client'

import React, { useCallback, useMemo } from 'react'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import Container from '@/components/ui/container'
import Breadcrumb from '@/components/ui/breadcrumb'
import { SOCIAL_ICONS, SOCIALS, normalizeSocial } from '@/components/contacts/contacts-data'
import { useApi } from '@/lib/use-api'
import * as site from '@/lib/api/site'
import { contactsInfo } from '@/lib/adapters'

// ─────────────────────────────────────────────────────────────────────────────
// Контакты sahifasi. Figma: desktop 164:14294, mobil 377:16389.
//
// Tuzilishi juda sodda: non ushlagich, sarlavha, to'rtta oq kartochka
// (Телефон · Email · Адрес · Социальные сети) va ostida xarita.
// Mobilda kartochkalar bir ustunga tushadi (377:16389).
// ─────────────────────────────────────────────────────────────────────────────

const BREADCRUMB = [{ name: 'Главная', href: '/' }, { name: 'Контакты' }]

// Kartochka — oq fon, radius 6, ichida 12px oraliq.
// Figma: desktop 164:14757 (323×103, p-16, yorliq 14px, qiymat 18/26),
// mobil 377:16702 (296×68, p-12, yorliq 12px, qiymat 14px).
function ContactCard({ label, children }) {
    return (
        <div className="flex flex-col gap-[12px] rounded-[6px] bg-white p-[12px] lg:p-[16px]">
            <p className="text-[12px] text-grey lg:text-[14px]">{label}</p>
            {children}
        </div>
    )
}

function ContactValue({ href, children }) {
    return (
        <a
            href={href}
            className="text-[14px] break-words text-black transition-colors hover:text-gold lg:text-[18px] lg:leading-[26px]"
        >
            {children}
        </a>
    )
}

export default function ContactsView() {
    // Kontaktlar adminkadan boshqariladi (GET /site/contacts, backend/site.md).
    const fetchContacts = useCallback(() => site.contacts(), [])

    const { data: raw } = useApi(fetchContacts)

    const contacts = useMemo(() => contactsInfo(raw), [raw])

    // Backend ijtimoiy tarmoqlarni `{ url, title }` ko'rinishida beradi;
    // ikonka esa lokal fayllardan sarlavha bo'yicha tanlanadi.
    const socials = (contacts?.socials?.length ? contacts.socials : SOCIALS).map((s) => ({
        ...s,
        icon: s.icon || SOCIAL_ICONS[normalizeSocial(s.label)] || SOCIAL_ICONS.default,
    }))

    return (
        <div className="flex flex-col gap-[16px] bg-light-white pt-[16px] lg:pt-[24px] pb-[40px] lg:gap-[24px] lg:pb-[100px]">
            <Container className="flex flex-col gap-[16px] lg:gap-[24px]">
                <Breadcrumb items={BREADCRUMB} />

                <h1 className="font-display text-[24px] leading-none tracking-[0.48px] text-black uppercase lg:text-[48px] lg:tracking-[0.96px]">
                    Контакты
                </h1>

                {/* To'rtta kartochka — Figma 164:14756 */}
                <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-4">
                    <ContactCard label="Телефон">
                        <ContactValue href={`tel:${(contacts?.phone || '').replace(/[^+\d]/g, '')}`}>
                            {contacts?.phone || '—'}
                        </ContactValue>
                    </ContactCard>

                    <ContactCard label="Email">
                        <ContactValue href={`mailto:${contacts?.email || ''}`}>
                            {contacts?.email || '—'}
                        </ContactValue>
                    </ContactCard>

                    <ContactCard label="Адрес">
                        <p className="text-[14px] text-black lg:text-[18px] lg:leading-[26px]">
                            {contacts?.address || '—'}
                        </p>
                    </ContactCard>

                    <ContactCard label="Социальные сети">
                        <div className="flex items-center gap-[9px] lg:gap-[12px]">
                            {socials.map((social) => (
                                <a
                                    key={social.key}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="relative flex size-[32px] shrink-0 items-center justify-center rounded-full border border-gold transition-colors hover:bg-gold/10 lg:size-[42px]"
                                >
                                    <Image
                                        src={social.icon}
                                        alt=""
                                        width={40}
                                        height={40}
                                        className="size-[30px] shrink-0 lg:size-[40px]"
                                    />
                                </a>
                            ))}
                        </div>
                    </ContactCard>
                </div>
            </Container>

            {/* Xarita — Figma 164:14784 (1340×500, radius 6).
                Figma'da bu joyda xarita skrinshoti turibdi; backend ulanganda
                shu konteynerga haqiqiy xarita joylashtiriladi. */}
            <Container>
                <div className="relative flex h-[200px] items-center justify-center overflow-hidden rounded-[6px] bg-white lg:h-[500px]">
                    <span className="flex flex-col items-center gap-[8px] text-center">
                        <MapPin size={32} strokeWidth={2} className="text-gold" />
                        <span className="px-[16px] text-[12px] leading-[16px] text-grey lg:text-[14px]">
                            {contacts?.address || '—'}
                        </span>
                    </span>
                </div>
            </Container>
        </div>
    )
}
