'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Banknote, Calendar, Eye, MapPin, MessageCircle, SquarePen, User } from 'lucide-react'
import { AdminRowMenu, AdminStatus } from '@/components/admin/ui/admin-ui'
import { PROJECT_STATUS } from '@/components/admin/ui/admin-statuses'

// ─────────────────────────────────────────────────────────────────────────────
// Adminkadagi loyiha qatori — Figma «Проекты» 338:19284.
// Ochiq saytdagi qator kartochkasining o'zi, lekin «Подать заявку» va yurakcha
// o'rniga: ko'rish/izoh hisoblagichlari, holat yorlig'i, tahrirlash va «⋮».
// ─────────────────────────────────────────────────────────────────────────────

const VISIBLE_REQUIREMENTS = 5

function Meta({ icon: Icon, children }) {
    return (
        <span className="flex items-center gap-[8px] text-[12px] whitespace-nowrap text-black lg:text-[14px]">
            <Icon size={17} strokeWidth={1.75} className="shrink-0 text-gold" />
            {children}
        </span>
    )
}

export default function AdminProjectRow({ project, menuItems }) {
    const href = `/admin/projects/${project.id}`
    const shown = project.requirements.slice(0, VISIBLE_REQUIREMENTS)
    const rest = project.requirements.length - shown.length
    const state = PROJECT_STATUS[project.status]

    return (
        <article className="flex flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:p-[24px]">
            <div className="flex flex-col gap-[12px] lg:flex-row lg:items-start lg:gap-[16px]">
                <Link
                    href={href}
                    className="relative block size-[40px] shrink-0 overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:size-[49px]"
                >
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="49px"
                        className="object-cover"
                    />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
                    <Link
                        href={href}
                        className="text-[16px] font-medium text-black transition-colors hover:text-gold"
                    >
                        {project.title}
                    </Link>

                    <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px]">
                        <Meta icon={Calendar}>{project.date}</Meta>
                        <Meta icon={MapPin}>{project.city}</Meta>
                        <Meta icon={User}>{project.need}</Meta>
                        <Meta icon={Banknote}>{project.price}</Meta>
                    </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-[12px] lg:gap-[16px]">
                    <span className="flex items-center gap-[16px] text-[12px] text-grey lg:text-[14px]">
                        <span className="flex items-center gap-[8px]">
                            <MessageCircle size={20} strokeWidth={2} />
                            {project.comments}
                        </span>
                        <span className="flex items-center gap-[8px]">
                            <Eye size={20} strokeWidth={2} />
                            {project.views}
                        </span>
                    </span>

                    <AdminStatus tone={state.tone} className="lg:w-[133px]">
                        {state.label}
                    </AdminStatus>

                    <Link
                        href={`${href}/edit`}
                        aria-label="Редактировать"
                        className="flex size-[32px] items-center justify-center rounded-[6px] bg-gold/25 p-[4px] text-black transition-colors hover:bg-gold/40"
                    >
                        <SquarePen size={24} strokeWidth={2} />
                    </Link>
                    <span className="flex size-[32px] items-center justify-center rounded-[6px] bg-gold/25 p-[4px] text-black">
                        <AdminRowMenu items={menuItems(project)} />
                    </span>
                </div>
            </div>

            <p className="line-clamp-3 text-[14px] leading-[20px] text-grey lg:line-clamp-2 lg:text-[16px] lg:leading-[22px]">
                {project.about}
            </p>

            <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                <p className="text-[14px] font-bold text-black lg:text-[16px]">Кого ищем</p>
                <div className="flex flex-wrap gap-[8px] lg:gap-[16px]">
                    {shown.map((item) => (
                        <span
                            key={item}
                            className="flex items-center justify-center rounded-[6px] bg-light-white px-[12px] py-[8px] text-[12px] font-medium whitespace-nowrap text-grey lg:text-[16px]"
                        >
                            {item}
                        </span>
                    ))}
                    {rest > 0 && (
                        <span className="flex items-center justify-center rounded-[6px] bg-light-white px-[12px] py-[8px] text-[12px] font-medium whitespace-nowrap text-grey lg:text-[16px]">
                            +{rest}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-[12px] rounded-[6px] bg-light-white p-[12px] lg:p-[16px]">
                <span className="relative block size-[32px] shrink-0 overflow-hidden rounded-full bg-white lg:size-[39px]">
                    <Image
                        src={project.company.logo}
                        alt={project.company.name}
                        fill
                        sizes="39px"
                        className="object-contain"
                    />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                    <span className="truncate text-[14px] leading-[20px] font-medium text-black lg:text-[16px]">
                        {project.company.name}
                    </span>
                    <span className="truncate text-[12px] leading-[15px] text-grey">
                        {project.company.note}
                    </span>
                </span>
                <span className="hidden shrink-0 text-[12px] whitespace-nowrap text-grey lg:block">
                    {project.company.projects}
                </span>
            </div>
        </article>
    )
}
