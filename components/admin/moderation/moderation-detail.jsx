'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminExecutorProfile from '@/components/admin/executors/executor-profile'
import { ApproveModal, RejectModal } from '@/components/admin/moderation/moderation-modals'
import { EXECUTOR_PROFILE } from '@/components/admin/executors/executor-profile-data'

// ─────────────────────────────────────────────────────────────────────────────
// Moderatsiyadagi anketa — Figma «Анкета» 344:14840, «Отклонить профиль»
// 344:15121 va «Опубликовать профиль?» 344:15883.
// Anketaning o'zi ijrochi sahifasi bilan bir xil, farqi — tepadagi qaror
// paneli va «На модерации» holati.
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminModerationDetail() {
    const router = useRouter()
    const [decision, setDecision] = useState(null)

    const profile = { ...EXECUTOR_PROFILE, status: 'moderation' }

    return (
        <>
            <AdminExecutorProfile
                profile={profile}
                decisionBar={
                    <div className="flex flex-col gap-[12px] rounded-[6px] bg-white p-[12px] lg:flex-row lg:items-center lg:justify-between lg:gap-[16px] lg:p-[16px]">
                        <p className="text-[14px] font-medium text-black lg:text-[18px]">
                            Проверьте данные исполнителя и примите решение.
                        </p>

                        <div className="flex gap-[12px] lg:gap-[16px]">
                            <button
                                type="button"
                                onClick={() => setDecision('approve')}
                                className="min-w-0 flex-1 cursor-pointer rounded-[6px] bg-[#44a400] px-[16px] py-[12px] text-[14px] font-medium text-white transition-colors hover:bg-[#3b8f00] lg:flex-none lg:px-[24px] lg:py-[16px] lg:text-[18px]"
                            >
                                Одобрить
                            </button>
                            <button
                                type="button"
                                onClick={() => setDecision('reject')}
                                className="min-w-0 flex-1 cursor-pointer rounded-[6px] bg-[#e53b35] px-[16px] py-[12px] text-[14px] font-medium text-white transition-colors hover:bg-[#cf332e] lg:flex-none lg:px-[24px] lg:py-[16px] lg:text-[18px]"
                            >
                                Отклонить
                            </button>
                        </div>
                    </div>
                }
            />

            <ApproveModal
                open={decision === 'approve'}
                onClose={() => setDecision(null)}
                name={profile.name}
                onConfirm={() => router.push('/admin/moderation')}
            />
            <RejectModal
                open={decision === 'reject'}
                onClose={() => setDecision(null)}
                name={profile.name}
                onConfirm={() => router.push('/admin/moderation')}
            />
        </>
    )
}
