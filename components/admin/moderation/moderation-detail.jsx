'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import AdminExecutorProfile from '@/components/admin/executors/executor-profile'
import AdminProjectDetail from '@/components/admin/projects/project-detail'
import AdminVenueDetail from '@/components/admin/venues/venue-detail'
import { ApproveModal, RejectModal } from '@/components/admin/moderation/moderation-modals'
import { useApi, useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'
import {
    adminExecutorProfile,
    adminProjectDetail,
    portfolioFromMedia,
    venueDetail,
} from '@/lib/adapters'

// ─────────────────────────────────────────────────────────────────────────────
// Moderatsiyadagi kartochka — Figma «Анкета» 344:14840, «Отклонить профиль»
// 344:15121 va «Опубликовать профиль?» 344:15883.
// Kartochkaning o'zi tegishli bo'limdagi sahifa bilan bir xil, farqi — tepadagi
// qaror paneli va «На модерации» holati.
//
// Manba: GET /admin/moderation/{source}/{id} — `source`: user | project | venue
// (backend/admin.md). Manba ro'yxatdan `?source=` bilan keladi.
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminModerationDetail({ id }) {
    const router = useRouter()
    const params = useSearchParams()
    const source = params.get('source') || 'user'

    const [decision, setDecision] = useState(null)

    const fetcher = useCallback(() => adminApi.moderationItem(source, id), [source, id])
    const { data, loading, error } = useApi(fetcher, { enabled: Boolean(id) })

    const approve = useAction(adminApi.approve)
    const reject = useAction(adminApi.reject)

    const profile = useMemo(
        () => (source === 'user' ? adminExecutorProfile(data) : null),
        [source, data],
    )
    const project = useMemo(
        () => (source === 'project' ? adminProjectDetail(data) : null),
        [source, data],
    )
    const venue = useMemo(() => (source === 'venue' ? venueDetail(data) : null), [source, data])
    const photos = useMemo(() => portfolioFromMedia(data?.media), [data])

    const item = profile || project || venue

    if (loading || error || !item) {
        return loading ? (
            <div className="h-[600px] animate-pulse rounded-[6px] bg-black/5" />
        ) : (
            <p className="rounded-[6px] bg-white p-[40px] text-center text-[14px] text-grey lg:text-[16px]">
                {error?.message || 'Заявка не найдена'}
            </p>
        )
    }

    // «На модерации» holati — kartochka qaysi bo'limdan bo'lmasin bir xil.
    const decisionBar = (
        <div className="flex flex-col gap-[12px] rounded-[6px] bg-white p-[12px] lg:flex-row lg:items-center lg:justify-between lg:gap-[16px] lg:p-[16px]">
            <p className="text-[14px] font-medium text-black lg:text-[18px]">
                {SUBTITLE[source] || SUBTITLE.user}
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
    )

    async function decide(action, comment) {
        const res =
            action === 'approve'
                ? await approve.run(source, id)
                : await reject.run(source, id, comment || '')
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success(action === 'approve' ? 'Опубликовано' : 'Отклонено')
        router.push('/admin/moderation')
    }

    return (
        <>
            {source === 'user' && (
                <AdminExecutorProfile
                    profile={{ ...profile, status: 'moderation' }}
                    decisionBar={decisionBar}
                />
            )}
            {source === 'project' && (
                <AdminProjectDetail
                    project={{ ...project, status: 'moderation' }}
                    decisionBar={decisionBar}
                    backHref="/admin/moderation"
                />
            )}
            {source === 'venue' && (
                <AdminVenueDetail
                    venue={{ ...venue, status: 'moderation' }}
                    photoTabs={photos.tabs}
                    photoItems={photos.items}
                    banner={decisionBar}
                    backHref="/admin/moderation"
                />
            )}

            <ApproveModal
                open={decision === 'approve'}
                onClose={() => setDecision(null)}
                onConfirm={() => decide('approve')}
            />
            <RejectModal
                open={decision === 'reject'}
                onClose={() => setDecision(null)}
                onConfirm={(comment) => decide('reject', comment)}
            />
        </>
    )
}

const SUBTITLE = {
    user: 'Проверьте данные исполнителя и примите решение.',
    project: 'Проверьте данные проекта и примите решение.',
    venue: 'Проверьте данные площадки и примите решение.',
}
