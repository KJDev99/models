'use client'

import React from 'react'
import { Calendar, Heart, MapPin, Ruler, Scale } from 'lucide-react'
import { FAVORITE_TYPES } from '@/lib/favorites'
import { useFavoritesStore } from '@/store/useFavoritesStore'

// ─────────────────────────────────────────────────────────────────────────────
// Anketaning asosiy kartochkasi — Figma 129:5354 (770×600, oq, radius 6, p-24,
// bloklar orasi 24px).
//
// Aniq qiymatlar:
//   ism        Montserrat Medium 32px, #222
//   yurakcha   32×32, gold 25%, radius 6, p-4, backdrop-blur 2.5
//   parametr   ikonka 24px + Montserrat Medium 16px #666, orasi 8, qatorda 16
//   teg        ramka #d9d9d9, px-12 py-8, radius 6, Medium 16px #666, orasi 12
//   sarlavha   Montserrat Bold 18px #222
//   matn       Montserrat Regular 16px/22 #666
//   plitka     light-white, p-16, radius 6; qiymat Helvetica Neue 32px,
//              izoh Montserrat Regular 14px #222
//   tugma      gold ramka, px-24 py-16, Medium 18px gold
// ─────────────────────────────────────────────────────────────────────────────

function Meta({ icon: Icon, children }) {
    return (
        <span className="flex items-center gap-[8px] text-[14px] font-medium whitespace-nowrap text-grey lg:text-[16px]">
            <Icon
                size={24}
                strokeWidth={1.75}
                className="size-[20px] shrink-0 text-gold lg:size-[24px]"
            />
            {children}
        </span>
    )
}

function SectionTitle({ children }) {
    return (
        <h2 className="font-sans text-[16px] leading-normal font-bold text-black lg:text-[18px]">
            {children}
        </h2>
    )
}

// `actions` — yurakcha o'rniga qo'yiladigan boshqaruv (Figma «Исполнитель»
// kabineti 265:14965 — holat, qalam va shesternya). `onInvite` berilmasa
// pastdagi tugma chiqmaydi — kabinetda o'z anketasiga taklif yuborilmaydi.
// `footer` — «Пригласить в проект» o'rniga qo'yiladigan blok («Агентство»
// kabinetida agentlik yorlig'i, Figma 345:19391).
export default function ModelSummary({ model, onInvite, actions, footer }) {
    const toggle = useFavoritesStore((s) => s.toggle)
    const items = useFavoritesStore((s) => s.items)
    const liked = items.some((i) => i.type === FAVORITE_TYPES.EXECUTOR && i.id === model.slug)

    function onLike() {
        toggle({
            type: FAVORITE_TYPES.EXECUTOR,
            id: model.slug,
            slug: model.slug,
            title: model.name,
            image: model.photos[0],
        })
    }

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
            {/* Ism, parametrlar va teglar — bitta blok (Figma 129:5355, gap 16) */}
            <div className="flex flex-col justify-center gap-[16px]">
                <div className="flex items-center justify-between gap-[16px]">
                    <h1 className="font-sans text-[18px] leading-[24px] font-medium text-black lg:text-[32px] lg:leading-[39px]">
                        {model.name}
                    </h1>

                    {actions || (
                        <button
                            type="button"
                            onClick={onLike}
                            aria-label={liked ? 'Убрать из избранного' : 'В избранное'}
                            className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] ui-icon-btn backdrop-blur-[2.5px]"
                        >
                            <Heart
                                size={24}
                                strokeWidth={2}
                                className={liked ? 'fill-current' : ''}
                            />
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-[12px]">
                    <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px]">
                        <Meta icon={Calendar}>{model.age} лет</Meta>
                        <Meta icon={Ruler}>{model.height} см</Meta>
                        <Meta icon={Scale}>{model.weight} кг</Meta>
                        <Meta icon={MapPin}>{model.city}</Meta>
                    </div>

                    <div className="flex flex-wrap gap-[12px]">
                        {model.tags.map((tag) => (
                            <span
                                key={tag}
                                className="flex items-center justify-center rounded-[6px] border border-[#d9d9d9] px-[12px] py-[8px] text-[14px] font-medium whitespace-nowrap text-grey backdrop-blur-[2.5px] lg:text-[16px]"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* О модели — Figma'da bu blok o'sadi va kartochkani 600px'ga to'ldiradi */}
            <div className="flex flex-1 flex-col gap-[16px]">
                <SectionTitle>О модели</SectionTitle>
                <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                    {model.about}
                </p>
            </div>

            {/* Опыт работы — 4 ta plitka bir qatorda, mobilda 2×2 */}
            <div className="flex flex-col gap-[16px]">
                <SectionTitle>Опыт работы</SectionTitle>
                <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4 lg:gap-[16px]">
                    {model.stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="flex flex-col gap-[16px] rounded-[6px] bg-light-white p-[16px]"
                        >
                            <p className="font-display text-[24px] leading-none text-black uppercase lg:text-[32px]">
                                {stat.value}
                            </p>
                            <p className="text-[12px] leading-none text-black lg:text-[14px]">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {footer}

            {onInvite && (
                <button
                    type="button"
                    onClick={onInvite}
                    className="ui-shine relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-[6px] border border-gold px-[24px] py-[12px] text-[14px] font-medium whitespace-nowrap text-gold transition-colors hover:bg-gold hover:text-white lg:w-fit lg:py-[16px] lg:text-[18px]"
                >
                    <span className="relative">Пригласить в проект</span>
                </button>
            )}
        </div>
    )
}
