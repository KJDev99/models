'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import Container from '@/components/ui/container'
import Breadcrumb from '@/components/ui/breadcrumb'
import ProjectCard from '@/components/projects/project-card'
import { PROJECTS } from '@/components/projects/projects-data'
import ProjectSummary from '@/components/projects/[slug]/project-summary'
import { ApplyModal, ApplySentModal } from '@/components/projects/[slug]/project-modals'
import { DETAILS, PROJECT } from '@/components/projects/[slug]/project-detail-data'
import { AuthRequiredModal } from '@/components/shared/detail/detail-modals'
import { useAuth } from '@/lib/use-auth'

// ─────────────────────────────────────────────────────────────────────────────
// Loyiha sahifasi. Figma: desktop 145:10604, mobil 374:18623.
//
// Ijrochi va maydon sahifalaridan farqlari:
//   · geroy — bitta 554×600 surat, galereyasiz
//   · «Подробнее о проекте» — kirish matni va uchta ro'yxatli blok
//   · «Место съёмки» — manzil, vaqt va xarita
//   · sharhlar bo'limi yo'q
//   · modallar: «Подать заявку» → «Заявка отправлена»
// ─────────────────────────────────────────────────────────────────────────────

// Kartochka ichidagi sarlavha (Figma 145:10996 — 32px, uppercase, tracking .64)
function CardTitle({ children }) {
    return (
        <h2 className="font-display text-[18px] leading-none tracking-[0.36px] text-black uppercase lg:text-[32px] lg:tracking-[0.64px]">
            {children}
        </h2>
    )
}

export default function ProjectPage({ slug }) {
    const { authed } = useAuth()

    const [authModal, setAuthModal] = useState(false)
    const [applyModal, setApplyModal] = useState(false)
    const [sentModal, setSentModal] = useState(false)

    const project = { ...PROJECT, slug: slug || PROJECT.slug }

    // Mehmon bo'lsa — avval «Требуется вход» oynasi (Figma 164:18768).
    function apply() {
        if (authed) setApplyModal(true)
        else setAuthModal(true)
    }

    const breadcrumb = [
        { name: 'Главная', href: '/' },
        { name: 'Проекты', href: '/projects' },
        { name: project.title },
    ]

    // «Другие проекты» — katalogdan dastlabki 4 ta e'lon.
    const others = PROJECTS.slice(0, 4)

    return (
        <div className="flex flex-col gap-[24px] bg-light-white pt-[24px] pb-[40px] lg:gap-[50px] lg:pb-[100px]">
            <Container className="flex flex-col gap-[16px] lg:gap-[24px]">
                <Breadcrumb items={breadcrumb} />

                {/* Hero: surat + asosiy kartochka (Figma 145:10642) */}
                <div className="flex flex-col gap-[16px] lg:flex-row lg:gap-[16px]">
                    <div className="relative h-[400px] w-full shrink-0 overflow-hidden rounded-[6px] bg-[#d9d9d9] lg:h-[600px] lg:w-[554px]">
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 554px"
                            className="object-cover"
                        />
                    </div>

                    <ProjectSummary project={project} onApply={apply} />
                </div>
            </Container>

            {/* Подробнее о проекте — Figma 145:10994 */}
            <Container>
                <section className="flex flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
                    <CardTitle>Подробнее о проекте</CardTitle>

                    <div className="flex flex-col gap-[16px] text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                        <p>{DETAILS.intro}</p>

                        {DETAILS.blocks.map((block) => (
                            <div key={block.title}>
                                <p className="font-bold text-grey">{block.title}</p>
                                <ul className="list-disc ps-[24px]">
                                    {block.items.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            </Container>

            {/* Место съёмки — Figma 155:13145 */}
            <Container>
                <section className="flex flex-col gap-[16px] rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]">
                    <CardTitle>Место съёмки</CardTitle>

                    {/* Yorliq ustuni qat'iy 60px — qiymat yonida turib o'raladi
                        (Figma 155:13181) */}
                    <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                        {[
                            ['Адрес:', project.address],
                            ['Время:', project.time],
                        ].map(([label, value]) => (
                            <div key={label} className="flex gap-[16px]">
                                <span className="w-[45px] shrink-0 text-[14px] leading-[20px] font-medium text-grey lg:w-[60px] lg:text-[16px]">
                                    {label}
                                </span>
                                <span className="min-w-0 flex-1 text-[14px] leading-[20px] font-medium text-black lg:text-[16px]">
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Figma'da (159:13202) bu joyda xarita skrinshoti turibdi. Backend
                        ulanganda shu konteynerga haqiqiy xarita (koordinatalar
                        bo'yicha) joylashtiriladi. */}
                    <div className="relative flex h-[200px] items-center justify-center overflow-hidden rounded-[6px] bg-light-white lg:h-[300px]">
                        <span className="flex flex-col items-center gap-[8px] text-center">
                            <MapPin size={32} strokeWidth={2} className="text-gold" />
                            <span className="px-[16px] text-[12px] leading-[16px] text-grey lg:text-[14px]">
                                {project.address}
                            </span>
                        </span>
                    </div>
                </section>
            </Container>

            <Container className="flex flex-col gap-[16px] lg:gap-[32px]">
                <h2 className="font-display text-[24px] leading-[26px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:leading-none lg:tracking-[0.64px]">
                    Другие проекты
                </h2>

                {/* Mobil (Figma 374:19437) — gorizontal lenta, kartochka 284×381 */}
                <div className="scrollbar-hide -mx-[12px] flex gap-[12px] overflow-x-auto overscroll-x-contain pl-[12px] lg:hidden">
                    {others.map((item) => (
                        <div key={item.id} className="w-[284px] shrink-0">
                            <ProjectCard project={item} className="h-full" />
                        </div>
                    ))}
                    {/* Oxirida 12px bo'sh joy (gap hisobiga) */}
                    <span aria-hidden className="w-0 shrink-0" />
                </div>

                {/* Desktop (Figma 145:11078) — 4 ustun, kartochka 323×440 */}
                <div className="hidden gap-[16px] lg:grid lg:grid-cols-4">
                    {others.map((item) => (
                        <ProjectCard key={item.id} project={item} className="h-full" />
                    ))}
                </div>
            </Container>

            <AuthRequiredModal open={authModal} onClose={() => setAuthModal(false)} />

            <ApplyModal
                open={applyModal}
                onClose={() => setApplyModal(false)}
                onSent={() => {
                    setApplyModal(false)
                    setSentModal(true)
                }}
            />

            <ApplySentModal open={sentModal} onClose={() => setSentModal(false)} />
        </div>
    )
}
