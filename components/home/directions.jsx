import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Container from '@/components/ui/container'
import { DIRECTIONS } from '@/components/home/home-data'

// ─────────────────────────────────────────────────────────────────────────────
// Figma: «Выберите направление» — desktop 52:1021, mobil 373:17076.
// Desktop bento: chapda katta 662×616 (Модели), o'ngda 323×300 juftlik
// (Фотографы / Видеографы) va ostida 662×300 (Площадки).
// Mobil: to'liq kenglikdagi 200px kartochkalar, o'rtada ikkitalik qator.
// ─────────────────────────────────────────────────────────────────────────────

function DirectionCard({ item, className = '', sizes }) {
    return (
        <Link
            href={item.href}
            className={`group relative overflow-hidden rounded-[6px] bg-[#d9d9d9] ${className}`}
        >
            <Image
                src={item.image}
                alt={item.label}
                fill
                sizes={sizes}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Pastki chap burchakdagi yorliq — Figma'da faqat o'ng yuqori burchagi yumaloq */}
            <span className="absolute bottom-0 left-0 flex items-center justify-center gap-[8px] rounded-tr-[6px] bg-light-white p-[8px] lg:gap-[12px] lg:px-[16px] lg:py-[12px]">
                <span className="font-display text-[14px] leading-none text-black uppercase lg:text-[20px]">
                    {item.label}
                </span>
                <ArrowUpRight size={24} strokeWidth={2} className="text-black" />
            </span>
        </Link>
    )
}

export default function Directions() {
    return (
        <Container as="section" className="flex flex-col gap-[16px] lg:gap-[32px]">
            <header className="flex flex-col gap-[12px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
                <h2 className="font-display text-[24px] leading-[26px] tracking-[0.48px] text-black uppercase lg:text-[48px] lg:leading-none lg:tracking-[0.96px]">
                    Выберите направление
                </h2>
                <p className="text-[14px] leading-[20px] text-black lg:w-[436px] lg:text-[18px] lg:leading-[24px]">
                    Найдите нужных специалистов или площадку для вашего проекта
                </p>
            </header>

            <div className="flex flex-col gap-[12px] lg:flex-row lg:gap-[16px]">
                <DirectionCard
                    item={DIRECTIONS.models}
                    className="h-[200px] w-full lg:h-[616px] lg:w-[662px] lg:shrink-0"
                    sizes="(max-width: 1024px) 100vw, 662px"
                />

                <div className="flex min-w-0 flex-1 flex-col gap-[12px] lg:gap-[16px]">
                    <div className="flex gap-[12px] lg:gap-[16px]">
                        <DirectionCard
                            item={DIRECTIONS.photographers}
                            className="h-[200px] min-w-0 flex-1 lg:h-[300px]"
                            sizes="(max-width: 1024px) 50vw, 323px"
                        />
                        <DirectionCard
                            item={DIRECTIONS.videographers}
                            className="h-[200px] min-w-0 flex-1 lg:h-[300px]"
                            sizes="(max-width: 1024px) 50vw, 323px"
                        />
                    </div>

                    <DirectionCard
                        item={DIRECTIONS.venues}
                        className="h-[200px] w-full lg:h-[300px]"
                        sizes="(max-width: 1024px) 100vw, 662px"
                    />
                </div>
            </div>
        </Container>
    )
}
