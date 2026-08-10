'use client'

import React from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Anketa sahifasidagi ma'lumot kartochkalari — barcha ijrochilar uchun umumiy.
//   · «Параметры» / «Информация» + «Стоимость» — Figma 129:6281 / 129:7131
//   · «Опыт участия в проектах» / «Опыт в проектах» — Figma 129:6999 / 129:7181
//
// Hammasi oq kartochka, radius 6, p-24 (mobilda 12).
// Sarlavhalar — Helvetica Neue 24px uppercase.
// ─────────────────────────────────────────────────────────────────────────────

function CardTitle({ children }) {
    return (
        <h2 className="font-display text-[18px] leading-none tracking-[0.36px] text-black uppercase lg:text-[24px] lg:tracking-[0.48px]">
            {children}
        </h2>
    )
}

// Chapda nom, o'ngda qiymat — ikkalasi ham teng ustunda (Figma 129:6109).
function Row({ label, value }) {
    return (
        <div className="grid grid-cols-2 items-start gap-[16px]">
            <span className="text-[14px] leading-[20px] text-grey lg:text-[16px]">{label}</span>
            <span className="text-[14px] leading-[20px] text-black lg:text-[16px]">{value}</span>
        </div>
    )
}

// Bitta kartochka. `columns` — ustunlar massivi, har biri [nom, qiymat] juftliklari.
// Bitta ustun berilsa qatorlar bir ustunda joylashadi (Стоимость), ikkitasi
// berilsa desktopda yonma-yon bo'linadi (Параметры / Информация).
export function DetailInfoCard({ title, columns }) {
    return (
        <section className="flex min-w-0 flex-1 flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
            <CardTitle>{title}</CardTitle>

            <div className="flex flex-col gap-[16px] lg:flex-row lg:gap-[24px]">
                {columns.map((column, ci) => (
                    <div key={ci} className="flex min-w-0 flex-1 flex-col gap-[16px]">
                        {column.map(([label, value]) => (
                            <Row key={label} label={label} value={value} />
                        ))}
                    </div>
                ))}
            </div>
        </section>
    )
}

// Ikkita kartochka yonma-yon (mobilda ustma-ust).
export function DetailInfoCards({ children }) {
    return <div className="flex flex-col gap-[16px] lg:flex-row lg:gap-[16px]">{children}</div>
}

// Loyihalar jadvali. Desktopda 4 ustun, mobilda har bir loyiha alohida blok.
export function DetailProjects({ title, projects }) {
    const columns = ['Год', 'Проект', 'Бренд / заказчик', 'Роль']

    return (
        <section className="flex flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
            <CardTitle>{title}</CardTitle>

            {/* Desktop — jadval */}
            <div className="hidden lg:block">
                <div className="grid grid-cols-4 rounded-[6px] bg-light-white">
                    {columns.map((c) => (
                        <span
                            key={c}
                            className="px-[16px] py-[16px] text-[16px] leading-[22px] font-medium text-black"
                        >
                            {c}
                        </span>
                    ))}
                </div>

                {projects.map((p, i) => (
                    <div
                        key={`${p.year}-${p.project}`}
                        className={`grid grid-cols-4 items-start ${
                            i > 0 ? 'border-t border-black/8' : ''
                        }`}
                    >
                        <span className="px-[16px] py-[16px] text-[16px] leading-[20px] text-grey">
                            {p.year}
                        </span>
                        <span className="px-[16px] py-[16px] text-[16px] leading-[20px] text-black">
                            {p.project}
                        </span>
                        <span className="px-[16px] py-[16px] text-[16px] leading-[20px] text-grey">
                            {p.brand}
                        </span>
                        <span className="px-[16px] py-[16px] text-[16px] leading-[20px] text-grey">
                            {p.role}
                        </span>
                    </div>
                ))}
            </div>

            {/* Mobil — har bir loyiha nom/qiymat juftliklari ko'rinishida */}
            <div className="flex flex-col gap-[16px] lg:hidden">
                {projects.map((p, i) => (
                    <div
                        key={`${p.year}-${p.project}`}
                        className={`flex flex-col gap-[8px] ${
                            i > 0 ? 'border-t border-black/8 pt-[16px]' : ''
                        }`}
                    >
                        <Row label="Год" value={p.year} />
                        <Row label="Проект" value={p.project} />
                        <Row label="Бренд / заказчик" value={p.brand} />
                        <Row label="Роль" value={p.role} />
                    </div>
                ))}
            </div>
        </section>
    )
}
