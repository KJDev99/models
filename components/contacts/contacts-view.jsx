'use client'

import React from 'react'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import Container from '@/components/ui/container'
import Breadcrumb from '@/components/ui/breadcrumb'
import { CONTACTS, SOCIALS } from '@/components/contacts/contacts-data'

// ─────────────────────────────────────────────────────────────────────────────
// Контакты sahifasi. Figma: desktop 164:14294, mobil 377:16389.
//
// Tuzilishi juda sodda: non ushlagich, sarlavha, to'rtta oq kartochka
// (Телефон · Email · Адрес · Социальные сети) va ostida xarita.
// Mobilda kartochkalar bir ustunga tushadi (377:16389).
// ─────────────────────────────────────────────────────────────────────────────

const BREADCRUMB = [{ name: 'Главная', href: '/' }, { name: 'Контакты' }]

// Kartochka — oq fon, radius 6, p-16, ichida 12px oraliq (Figma 164:14757).
function ContactCard({ label, children }) {
    return (
        <div className="flex flex-col gap-[12px] rounded-[6px] bg-white p-[16px]">
            <p className="text-[14px] text-grey">{label}</p>
            {children}
        </div>
    )
}

function ContactValue({ href, children }) {
    return (
        <a
            href={href}
            className="text-[16px] leading-[26px] break-words text-black transition-colors hover:text-gold lg:text-[18px]"
        >
            {children}
        </a>
    )
}

export default function ContactsView() {
    return (
        <div className="flex flex-col gap-[16px] bg-light-white pt-[24px] pb-[40px] lg:gap-[24px] lg:pb-[100px]">
            <Container className="flex flex-col gap-[16px] lg:gap-[24px]">
                <Breadcrumb items={BREADCRUMB} />

                <h1 className="font-display text-[30px] leading-none tracking-[0.6px] text-black uppercase lg:text-[48px] lg:tracking-[0.96px]">
                    Контакты
                </h1>

                {/* To'rtta kartochka — Figma 164:14756 */}
                <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-[16px]">
                    <ContactCard label="Телефон">
                        <ContactValue href={`tel:${CONTACTS.phone.replace(/[^+\d]/g, '')}`}>
                            {CONTACTS.phone}
                        </ContactValue>
                    </ContactCard>

                    <ContactCard label="Email">
                        <ContactValue href={`mailto:${CONTACTS.email}`}>
                            {CONTACTS.email}
                        </ContactValue>
                    </ContactCard>

                    <ContactCard label="Адрес">
                        <p className="text-[16px] leading-[26px] text-black lg:text-[18px]">
                            {CONTACTS.address}
                        </p>
                    </ContactCard>

                    <ContactCard label="Социальные сети">
                        <div className="flex items-center gap-[12px]">
                            {SOCIALS.map((social) => (
                                <a
                                    key={social.key}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="relative flex size-[42px] shrink-0 items-center justify-center rounded-full border border-gold transition-colors hover:bg-gold/10"
                                >
                                    <Image
                                        src={social.icon}
                                        alt=""
                                        width={40}
                                        height={40}
                                        className="size-[40px] shrink-0"
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
                            {CONTACTS.address}
                        </span>
                    </span>
                </div>
            </Container>
        </div>
    )
}
