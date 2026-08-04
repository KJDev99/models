import React from 'react'
import { FileText, Users } from 'lucide-react'
import Container from '@/components/ui/container'
import { IMAGES } from '@/components/home/home-data'

// ─────────────────────────────────────────────────────────────────────────────
// Figma: ikkita ma'lumot plitkasi — desktop 316:8015, mobil 373:17150.
// Chapdagi oq plitkada 10% shaffof tekstura (image 5, mix-blend-luminosity).
// ─────────────────────────────────────────────────────────────────────────────
export default function InfoTiles() {
    return (
        <Container as="section" className="flex flex-col gap-[16px] lg:flex-row lg:items-stretch">
            <div className="relative flex min-w-0 flex-1 flex-col gap-[12px] overflow-hidden rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
                {/* Tekstura — SVG'ning ichida shaffoflik 10% qilib berilgan */}
                <span
                    aria-hidden
                    style={{ backgroundImage: `url(${IMAGES.texture})` }}
                    className="pointer-events-none absolute inset-0 bg-cover bg-center"
                />

                <FileText
                    size={42}
                    strokeWidth={1.5}
                    className="relative shrink-0 text-gold lg:size-[56px]"
                />
                <p className="relative text-[16px] leading-[22px] text-black lg:text-[20px] lg:leading-[24px]">
                    Разместите проект бесплатно и получите предложения
                    <br className="hidden lg:inline" /> от моделей, фотографов и видеографов в
                    течение нескольких часов.
                </p>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-[12px] overflow-hidden rounded-[6px] bg-gold p-[12px] lg:gap-[24px] lg:p-[24px]">
                <Users
                    size={42}
                    strokeWidth={1.5}
                    className="shrink-0 text-light-white lg:size-[56px]"
                />
                <p className="text-[16px] leading-[22px] text-light-white lg:text-[20px] lg:leading-[24px]">
                    Подходит для fashion-съёмок, рекламы, каталогов
                    <br className="hidden lg:inline" /> и корпоративных видео.
                </p>
            </div>
        </Container>
    )
}
