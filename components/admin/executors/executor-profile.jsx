'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Calendar, ChevronDown, MapPin, Ruler, SquarePen, Weight } from 'lucide-react'
import { AdminBreadcrumb } from '@/components/admin/ui/admin-form'
import { AdminRowMenu, AdminStatus } from '@/components/admin/ui/admin-ui'
import { profileMenu } from '@/components/admin/ui/admin-menu-items'
import { RowActionModals } from '@/components/admin/ui/admin-modals'
import { USER_STATUS } from '@/components/admin/ui/admin-statuses'
import { EXECUTOR_PROFILE } from '@/components/admin/executors/executor-profile-data'

// ─────────────────────────────────────────────────────────────────────────────
// Ijrochi anketasi. Ikki joyda ishlatiladi:
//   /admin/executors/[id]      — Figma «Анкета» 334:14442
//   /admin/moderation/[id]     — Figma «Анкета» 344:14840 (tepasida qaror paneli)
// Mobil: Figma «Анкета 320» 446:15743.
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminExecutorProfile({ profile = EXECUTOR_PROFILE, decisionBar = null }) {
    const router = useRouter()
    const [action, setAction] = useState(null)
    const [status, setStatus] = useState(profile.status)
    const [shot, setShot] = useState(0)
    const [tab, setTab] = useState('all')
    const [shown, setShown] = useState(8)

    const state = USER_STATUS[status] || USER_STATUS.active

    return (
        <>
            <AdminBreadcrumb
                items={[
                    { label: 'Административная панель', href: '/admin/dashboard' },
                    { label: profile.name },
                ]}
            />

            {decisionBar}

            <div className="flex flex-col gap-[24px] lg:gap-[50px]">
                {/* ── Galereya va asosiy ma'lumot (Figma 344:15141) ────────── */}
                <div className="flex flex-col gap-[16px] lg:flex-row lg:items-stretch">
                    <div className="flex gap-[16px] lg:shrink-0">
                        <div className="relative hidden h-[600px] w-[113px] flex-col gap-[8px] overflow-hidden lg:flex">
                            {profile.gallery.map((src, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setShot(i)}
                                    className={`shrink-0 cursor-pointer rounded-[6px] p-[4px] ${
                                        i === shot ? 'border border-gold' : ''
                                    }`}
                                >
                                    <span className="relative block h-[114px] w-full overflow-hidden rounded-[6px] bg-[#d9d9d9]">
                                        <Image
                                            src={src}
                                            alt=""
                                            fill
                                            sizes="113px"
                                            className="object-cover"
                                        />
                                    </span>
                                </button>
                            ))}
                            <span
                                aria-hidden
                                className="pointer-events-none absolute inset-x-0 bottom-0 h-[211px] bg-gradient-to-b from-transparent to-light-white"
                            />
                            <span className="absolute bottom-0 left-1/2 flex size-[24px] -translate-x-1/2 items-center justify-center rounded-[6px] bg-black/20 text-white">
                                <ChevronDown size={24} strokeWidth={2} />
                            </span>
                        </div>

                        <div className="relative h-[280px] w-full overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:h-[600px] lg:w-[425px]">
                            <Image
                                src={profile.gallery[shot]}
                                alt={profile.name}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 425px"
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
                        <div className="flex flex-col gap-[16px]">
                            <div className="flex flex-wrap items-center justify-between gap-[12px]">
                                <h1 className="text-[20px] font-medium text-black lg:text-[32px]">
                                    {profile.name}
                                </h1>

                                <div className="flex items-center gap-[12px] lg:gap-[16px]">
                                    <AdminStatus tone={state.tone}>{state.label}</AdminStatus>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push(`/admin/executors/${profile.id}/edit`)
                                        }
                                        aria-label="Редактировать"
                                        className="flex size-[32px] cursor-pointer items-center justify-center rounded-[6px] bg-gold/25 p-[4px] text-black transition-colors hover:bg-gold/40"
                                    >
                                        <SquarePen size={24} strokeWidth={2} />
                                    </button>
                                    <span className="flex size-[32px] items-center justify-center rounded-[6px] bg-gold/25 p-[4px] text-black">
                                        <AdminRowMenu
                                            items={profileMenu({
                                                status,
                                                onSettings: () =>
                                                    router.push(
                                                        `/admin/executors/${profile.id}/edit`
                                                    ),
                                                onBlock: () =>
                                                    setAction({ type: 'block', row: profile }),
                                                onUnblock: () =>
                                                    setAction({ type: 'unblock', row: profile }),
                                                onDelete: () =>
                                                    setAction({ type: 'delete', row: profile }),
                                            })}
                                        />
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-[12px]">
                                <div className="flex flex-wrap items-center gap-[16px] text-[14px] font-medium text-grey lg:text-[16px]">
                                    <Meta icon={Calendar}>{profile.age}</Meta>
                                    <Meta icon={Ruler}>{profile.height}</Meta>
                                    <Meta icon={Weight}>{profile.weight}</Meta>
                                    <Meta icon={MapPin}>{profile.city}</Meta>
                                </div>

                                <div className="flex flex-wrap gap-[12px]">
                                    {profile.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-[6px] border border-[#d9d9d9] px-[12px] py-[8px] text-[14px] font-medium text-grey lg:text-[16px]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-[16px]">
                            <h2 className="text-[16px] font-bold text-black lg:text-[18px]">
                                {profile.aboutTitle}
                            </h2>
                            <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                                {profile.about}
                            </p>
                        </div>

                        <div className="flex flex-col gap-[16px]">
                            <h2 className="text-[16px] font-bold text-black lg:text-[18px]">
                                Опыт работы
                            </h2>
                            <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4 lg:gap-[16px]">
                                {profile.experience.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex flex-col gap-[12px] rounded-[6px] bg-light-white p-[16px] text-black lg:gap-[16px]"
                                    >
                                        <span className="font-display text-[24px] uppercase lg:text-[32px]">
                                            {item.value}
                                        </span>
                                        <span className="text-[12px] lg:text-[14px]">
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Параметры / Стоимость (Figma 344:15218) ───────────────── */}
                <div className="flex flex-col gap-[16px] lg:flex-row lg:items-stretch">
                    <ProfileCard title="Параметры">
                        {/* Figma'da ustunlar bo'ylab to'ldiriladi: chapda birinchi
                            oltita, o'ngda qolganlari (344:15223 / 344:15242). */}
                        <div className="grid gap-[16px] lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-6 lg:gap-x-[24px]">
                            {profile.params.map(([label, value]) => (
                                <ParamRow key={label} label={label} value={value} />
                            ))}
                        </div>
                    </ProfileCard>

                    <ProfileCard title="Стоимость">
                        <div className="flex flex-col gap-[16px]">
                            {profile.prices.map(([label, value]) => (
                                <div key={label} className="flex gap-[16px]">
                                    <span className="min-w-0 flex-1 text-[14px] font-medium text-grey lg:text-[16px]">
                                        {label}
                                    </span>
                                    <span className="min-w-0 flex-1 text-[14px] font-medium text-black lg:text-[16px]">
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </ProfileCard>
                </div>

                {/* ── Опыт участия в проектах (Figma 344:15271) ─────────────── */}
                <ProfileCard title="Опыт участия в проектах">
                    <div className="flex flex-col">
                        <div className="hidden gap-[16px] rounded-[6px] bg-light-white p-[16px] text-[18px] font-medium text-black lg:flex">
                            {['Год', 'Проект', 'Бренд / заказчик', 'Роль'].map((label) => (
                                <span key={label} className="min-w-0 flex-1">
                                    {label}
                                </span>
                            ))}
                        </div>
                        {profile.works.map((work, i) => (
                            <div
                                key={i}
                                className="flex flex-col gap-[8px] border-b border-[#e5e5e5] p-[12px] lg:flex-row lg:items-center lg:gap-[16px] lg:p-[16px]"
                            >
                                {work.map((cell, k) => (
                                    <div key={k} className="flex gap-[16px] lg:block lg:min-w-0 lg:flex-1">
                                        <span className="min-w-0 flex-1 text-[12px] font-medium text-black lg:hidden">
                                            {['Год', 'Проект', 'Бренд / заказчик', 'Роль'][k]}
                                        </span>
                                        <span className="min-w-0 flex-1 text-[12px] text-grey lg:text-[16px]">
                                            {cell}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </ProfileCard>

                {/* ── Портфолио (Figma 344:15300) ───────────────────────────── */}
                <div className="flex flex-col gap-[16px] lg:gap-[24px]">
                    <h2 className="font-display text-[24px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:tracking-[0.64px]">
                        Портфолио
                    </h2>

                    <div className="flex flex-wrap gap-[12px] lg:gap-[16px]">
                        {profile.portfolioTabs.map((item) => {
                            const on = item.key === tab
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => setTab(item.key)}
                                    className={`flex cursor-pointer items-center gap-[8px] rounded-[6px] px-[16px] py-[12px] text-[14px] font-medium transition-colors lg:gap-[12px] lg:p-[16px] lg:text-[16px] ${
                                        on
                                            ? 'bg-gold text-white'
                                            : 'border border-gold text-gold hover:bg-gold/10'
                                    }`}
                                >
                                    {item.label}
                                    <span>({item.count})</span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4 lg:gap-[16px]">
                        {profile.portfolio.slice(0, shown).map((src, i) => (
                            <span
                                key={i}
                                className="relative block h-[140px] overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:h-[250px]"
                            >
                                <Image
                                    src={src}
                                    alt=""
                                    fill
                                    sizes="(max-width: 1024px) 50vw, 323px"
                                    className="object-cover"
                                />
                            </span>
                        ))}
                    </div>

                    {shown < profile.portfolio.length && (
                        <button
                            type="button"
                            onClick={() => setShown(shown + 8)}
                            className="w-full cursor-pointer self-center rounded-[6px] border border-gold p-[16px] text-[14px] font-medium text-gold transition-colors hover:bg-gold/10 lg:w-[200px] lg:text-[16px]"
                        >
                            Показать еще
                        </button>
                    )}
                </div>

                {/* ── Отзывы (Figma 344:15355) ──────────────────────────────── */}
                <div className="flex flex-col gap-[16px] lg:gap-[24px]">
                    <h2 className="font-display text-[24px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:tracking-[0.64px]">
                        Отзывы
                    </h2>
                    {profile.reviews.length === 0 && (
                        <p className="text-[16px] font-semibold text-black lg:text-[20px]">
                            Отзывов пока нет
                        </p>
                    )}
                </div>
            </div>

            <RowActionModals
                action={action}
                onClose={() => setAction(null)}
                onBlock={() => setStatus('blocked')}
                onUnblock={() => setStatus('active')}
                onDelete={() => router.push('/admin/executors')}
            />
        </>
    )
}

function Meta({ icon: Icon, children }) {
    return (
        <span className="flex items-center gap-[8px]">
            <Icon size={20} strokeWidth={2} className="shrink-0" />
            {children}
        </span>
    )
}

// Oq kartochka, sarlavhasi 32px display uppercase (Figma 344:15221).
function ProfileCard({ title, children }) {
    return (
        <section className="flex min-w-0 flex-1 flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
            <h2 className="font-display text-[24px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:tracking-[0.64px]">
                {title}
            </h2>
            {children}
        </section>
    )
}

function ParamRow({ label, value }) {
    return (
        <div className="flex gap-[16px]">
            <span className="w-[120px] shrink-0 text-[14px] font-medium text-grey lg:w-[136px] lg:text-[16px]">
                {label}
            </span>
            <span className="min-w-0 flex-1 text-[14px] font-medium text-black lg:text-[16px]">
                {value}
            </span>
        </div>
    )
}
