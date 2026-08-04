import React from 'react'
import Image from 'next/image'
import Container from '@/components/ui/container'

// ─────────────────────────────────────────────────────────────────────────────
// Figma: ikkita bir xil qurilgan banner —
//   «Создайте проект для съёмки прямо сейчас» (75:160 / 373:17144)
//   «Готовы начать съёмочный проект?»          (52:1180 / 373:17208)
//
// Desktop: rasm ustidan chapdan o'ngga oq gradient (60% da to'liq shaffof).
// Mobil:   rasm pastda, tepadan oq gradient — matn oq fonda o'qiladi.
// ─────────────────────────────────────────────────────────────────────────────
export default function CtaBanner({
    image,
    imageMobile,
    title,
    description,
    actions,
    descriptionClass = 'text-black',
}) {
    return (
        <Container as="section">
            <div className="relative flex h-[500px] flex-col justify-start gap-[12px] overflow-hidden rounded-[6px] px-[12px] py-[20px] lg:justify-center lg:gap-[16px] lg:p-[60px]">
                {/* Mobil va desktop uchun alohida kadrlar — mobilda sujet pastda,
                    desktopda o'ngda turadi. `imageMobile` berilmasa desktop rasmi ishlatiladi. */}
                {imageMobile && (
                    <Image
                        src={imageMobile}
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-cover object-center lg:hidden"
                    />
                )}
                <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 1340px"
                    className={`object-cover object-center ${imageMobile ? 'hidden lg:block' : ''}`}
                />

                {/* Mobil: pastdan yuqoriga oq. Desktop: chapdan o'ngga oq 60%. */}
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(255,255,255,0)_42.2%,#ffffff_57.7%,#ffffff_97.6%)] lg:bg-[linear-gradient(to_right,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_60.8%)]" />

                <h2 className="relative font-display text-[24px] leading-[26px] tracking-[0.48px] text-black uppercase lg:w-[555px] lg:text-[48px] lg:leading-[52px] lg:tracking-[0.96px]">
                    {title}
                </h2>

                <p
                    className={`relative text-[14px] leading-[20px] lg:w-[555px] lg:text-[18px] lg:leading-[24px] ${descriptionClass}`}
                >
                    {description}
                </p>

                <div className="relative flex flex-col gap-[12px] lg:flex-row lg:gap-[16px]">
                    {actions}
                </div>
            </div>
        </Container>
    )
}
