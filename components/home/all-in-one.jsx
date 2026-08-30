import React from 'react'
import Image from 'next/image'
import Container from '@/components/ui/container'
import { IMAGES, PLATFORM_STATS } from '@/components/home/home-data'

// ─────────────────────────────────────────────────────────────────────────────
// Figma: «Всё для съёмок в одном месте» — desktop 52:1166, mobil 373:17194.
// Desktop: chapda 888×500 rasm, o'ngda ikkita plitka ustma-ust.
// Mobil: rasm 200px, ostida ikkita plitka yonma-yon.
// ─────────────────────────────────────────────────────────────────────────────
export default function AllInOne() {
    return (
        <Container as="section" className="flex flex-col gap-[16px] lg:gap-[24px]">
            <header className="flex flex-col gap-[12px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
                <h2 className="font-display text-[24px] leading-[26px] tracking-[0.48px] text-black uppercase lg:text-[48px] lg:leading-none lg:tracking-[0.96px]">
                    Всё для съёмок в одном месте
                </h2>
                <p className="text-[16px] leading-[22px] text-black lg:w-[436px] lg:text-[18px] lg:leading-[24px]">
                    Платформа для поиска специалистов
                    <br className="hidden lg:inline" /> и проектов в сфере съёмок
                </p>
            </header>

            <div className="flex flex-col gap-[12px] lg:flex-row lg:items-stretch lg:gap-[16px]">
                <div className="relative h-[200px] w-full overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:h-[500px] lg:w-[888px] lg:shrink-0">
                    <Image
                        src={IMAGES.studio}
                        alt="Съёмочная площадка"
                        fill
                        sizes="(max-width: 1024px) 100vw, 888px"
                        quality={90}
                        className="object-cover"
                    />
                </div>

                <div className="flex min-w-0 flex-1 gap-[12px] lg:flex-col lg:gap-[16px]">
                    {PLATFORM_STATS.map((stat) => (
                        <div
                            key={stat.value}
                            className={`relative flex min-w-0 flex-1 flex-col justify-between gap-[12px] overflow-hidden rounded-[6px] p-[12px] lg:p-[24px] ${
                                stat.tone === 'gold' ? 'bg-gold' : 'bg-white'
                            }`}
                        >
                            {/* Tekstura — SVG'ning ichida shaffoflik 10% qilib berilgan */}
                            {stat.tone !== 'gold' && (
                                <span
                                    aria-hidden
                                    style={{ backgroundImage: `url(${IMAGES.texture})` }}
                                    className="pointer-events-none absolute inset-0 bg-cover bg-center"
                                />
                            )}

                            <p
                                className={`relative font-display text-[30px] leading-none uppercase lg:text-[48px] ${
                                    stat.tone === 'gold' ? 'text-light-white' : 'text-black'
                                }`}
                            >
                                {stat.value}
                            </p>
                            <p
                                className={`relative text-[14px] leading-normal lg:text-[20px] lg:leading-[24px] ${
                                    stat.tone === 'gold' ? 'text-light-white' : 'text-black'
                                }`}
                            >
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    )
}
