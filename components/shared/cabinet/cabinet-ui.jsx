'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// Kabinetlarning umumiy elementlari. «Заказчик» (206:3248) va «Исполнитель»
// (260:10428) bandlarida bir xil: kabinet ochiq saytning heder/futeri ichida
// turadi, sahifa tepasida yo'lakcha, ostida oq kartochkalar.
// ─────────────────────────────────────────────────────────────────────────────

// «Главная > Личный кабинет» (Figma 260:12526 / 260:11722) — 16px, grey.
export function CabinetBreadcrumb({ items }) {
    return (
        <nav
            aria-label="Хлебные крошки"
            className="flex flex-wrap items-center gap-[12px] text-[12px] text-grey lg:text-[16px]"
        >
            {items.map((item, i) => {
                const last = i === items.length - 1
                return (
                    <React.Fragment key={item.label}>
                        {i > 0 && <span aria-hidden>&gt;</span>}
                        {last || !item.href ? (
                            <span>{item.label}</span>
                        ) : (
                            <Link href={item.href} className="transition-colors hover:text-black">
                                {item.label}
                            </Link>
                        )}
                    </React.Fragment>
                )
            })}
        </nav>
    )
}

// Kabinet sahifasining karkasi: yo'lakcha + kontent (Figma 260:12522).
export function CabinetPage({ breadcrumb, children }) {
    return (
        <div className="flex flex-col gap-[16px] py-[16px] lg:gap-[24px] lg:py-[24px]">
            {breadcrumb && <CabinetBreadcrumb items={breadcrumb} />}
            {children}
        </div>
    )
}

// Bo'lim sarlavhasi — Helvetica Neue, uppercase (Figma 208:4791 / 260:11882).
export function CabinetTitle({ children, className = '' }) {
    return (
        <h2
            className={`font-display text-[24px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:tracking-[0.64px] ${className}`}
        >
            {children}
        </h2>
    )
}

// Yuborilgandan keyingi natija kartochkasi — Figma «Новый проект - На модерации»
// 216:4356, «Новая площадка» 230:6837, «Анкета отправлена» 265:14317.
export function CabinetResult({ title, text, image = '/img/client/projects/moderation.png' }) {
    return (
        <div className="flex flex-col items-center gap-[16px] rounded-[6px] bg-white p-[24px] text-center lg:gap-[16px]">
            <Image
                src={image}
                alt=""
                width={398}
                height={219}
                className="h-auto w-full max-w-[398px]"
            />
            <p className="text-[16px] font-semibold text-black lg:text-[18px]">{title}</p>
            <p className="text-[14px] leading-[20px] whitespace-pre-line text-grey lg:text-[16px] lg:leading-[22px]">
                {text}
            </p>
        </div>
    )
}

// Oq kartochka — forma bloklari uchun (Figma 208:8790).
export function CabinetCard({ children, className = '' }) {
    return (
        <section
            className={`flex flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px] ${className}`}
        >
            {children}
        </section>
    )
}

// «Безопасность» bo'limidagi qator — Пароль / Почта / Телефон.
// Figma desktop 260:6989: ikonka, matn va o'ngda «Изменить».
// Figma mobil 434:16939: tugma matn ostiga tushib, to'liq kenglikni oladi.
export function CabinetSecurityRow({ icon: Icon, title, note, onChange }) {
    return (
        <div className="flex flex-col gap-[8px] rounded-[6px] bg-white p-[12px] lg:flex-row lg:items-center lg:gap-[16px] lg:p-[16px]">
            <div className="flex min-w-0 flex-1 items-center gap-[12px] lg:gap-[16px]">
                <span className="ui-icon-btn flex size-[40px] shrink-0 items-center justify-center rounded-[6px]">
                    <Icon size={24} strokeWidth={2} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-[4px]">
                    <span className="text-[14px] font-medium text-black lg:text-[16px]">
                        {title}
                    </span>
                    <span className="truncate text-[12px] text-grey lg:text-[14px]">{note}</span>
                </span>
            </div>
            <button
                type="button"
                onClick={onChange}
                className="ui-shine relative w-full shrink-0 cursor-pointer overflow-hidden rounded-[6px] bg-gold px-[16px] py-[8px] text-[12px] font-medium text-white transition-colors hover:bg-[#c19754] lg:w-auto lg:text-[14px]"
            >
                <span className="relative">Изменить</span>
            </button>
        </div>
    )
}

// Bo'sh bo'lim matni — «Параметры не заполнены» + izoh (Figma 260:12076).
// 20px semibold sarlavha, ostida 18px/24 kulrang matn.
export function CabinetEmptyBlock({ title, text }) {
    return (
        <div className="flex flex-col gap-[12px] lg:gap-[16px]">
            <p className="text-[16px] font-semibold text-black lg:text-[20px]">{title}</p>
            {text && (
                <p className="text-[14px] leading-[20px] text-grey lg:text-[18px] lg:leading-[24px]">
                    {text}
                </p>
            )}
        </div>
    )
}
