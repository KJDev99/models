'use client'

import React, { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { CheckCircle, Eye, MinusCircle } from 'lucide-react'
import {
    AdminListCard,
    AdminPagination,
    AdminSelect,
    AdminStatus,
} from '@/components/admin/ui/admin-ui'
import AdminModal, {
    AdminModalButton,
    AdminModalText,
} from '@/components/admin/ui/admin-modal'
import ComplaintChatModal from '@/components/admin/complaints/complaint-chat-modal'
import { COMPLAINTS_PAGE_SIZE, COMPLAINT_FILTER, complaintStatus } from '@/components/admin/complaints/complaints-data'
import { useApi, useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'
import { adminComplaintRow } from '@/lib/adapters'

// Figma: Жалоба (344:16561 / 458:26503)
export default function AdminComplaints() {
    const [filter, setFilter] = useState('')
    const [page, setPage] = useState(1)
    const [chat, setChat] = useState(null)
    const [rejecting, setRejecting] = useState(null)

    // GET /admin/complaints — filtr va sahifalash server tomonida.
    const fetcher = useCallback(
        () =>
            adminApi.complaints({
                status: filter || undefined,
                page,
                page_size: COMPLAINTS_PAGE_SIZE,
            }),
        [filter, page],
    )
    const { data, loading, error, reload } = useApi(fetcher)

    const rows = useMemo(() => (data?.items || []).map(adminComplaintRow), [data])
    const pages = data?.meta?.pages || 1
    const current = data?.meta?.page || page

    const accept = useAction(adminApi.acceptComplaint)
    const rejectComplaint = useAction(adminApi.rejectComplaint)

    async function run(promise, message) {
        const res = await promise
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success(message)
        reload()
    }

    return (
        <>
            <AdminListCard
                title="Жалоба"
                action={
                    <AdminSelect
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value)
                            setPage(1)
                        }}
                        options={COMPLAINT_FILTER}
                        className="lg:w-[227px]"
                    />
                }
            >
                <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                    {(loading || error || rows.length === 0) && (
                        <p className="rounded-[6px] bg-light-white p-[24px] text-center text-[14px] text-grey lg:text-[16px]">
                            {loading ? 'Загружаем…' : error ? error.message : 'Жалоб нет'}
                        </p>
                    )}
                    {rows.map((complaint) => {
                        const state = complaintStatus(complaint.status)
                        const pending = complaint.status === 'pending'

                        return (
                            <article
                                key={complaint.id}
                                className="flex flex-col gap-[12px] rounded-[6px] bg-light-white p-[12px] lg:p-[16px]"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-[12px]">
                                    <div className="flex min-w-0 items-center gap-[12px]">
                                        <span className="block size-[40px] shrink-0 rounded-full bg-[#7d7d7d]" />
                                        <span className="flex min-w-0 flex-col gap-[4px]">
                                            <span className="text-[14px] font-medium text-black lg:text-[16px]">
                                                {complaint.author}{' '}
                                                <span className="text-grey">на</span>{' '}
                                                {complaint.accused}
                                            </span>
                                            <span className="text-[12px] text-grey lg:text-[14px]">
                                                Причина: {complaint.reason}
                                            </span>
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-[12px] lg:gap-[16px]">
                                        <AdminStatus tone={state.tone} className="lg:w-[150px]">
                                            {state.label}
                                        </AdminStatus>

                                        <button
                                            type="button"
                                            onClick={() => setChat(complaint)}
                                            aria-label="Переписка участников"
                                            className="cursor-pointer text-black transition-opacity hover:opacity-70"
                                        >
                                            <Eye size={24} strokeWidth={2} />
                                        </button>

                                        {pending && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        run(
                                                            accept.run(complaint.id),
                                                            'Жалоба рассмотрена',
                                                        )
                                                    }
                                                    aria-label="Рассмотрено"
                                                    className="cursor-pointer text-[#44a400] transition-opacity hover:opacity-70"
                                                >
                                                    <CheckCircle size={24} strokeWidth={2} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setRejecting(complaint)}
                                                    aria-label="Отклонить жалобу"
                                                    className="cursor-pointer text-[#e53b35] transition-opacity hover:opacity-70"
                                                >
                                                    <MinusCircle size={24} strokeWidth={2} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <p className="text-[14px] leading-[20px] text-grey lg:text-[16px] lg:leading-[22px]">
                                    {complaint.text}
                                </p>

                                <p className="text-[12px] text-grey lg:text-[14px]">
                                    {complaint.date}
                                </p>
                            </article>
                        )
                    })}
                </div>

                <AdminPagination page={current} pages={pages} onChange={setPage} />
            </AdminListCard>

            <ComplaintChatModal open={Boolean(chat)} onClose={() => setChat(null)} complaint={chat} />

            {/* «Отклонить жалобу?» — Figma 345:17769 / mobil 461:28244. */}
            <AdminModal
                open={Boolean(rejecting)}
                onClose={() => setRejecting(null)}
                title="Отклонить жалобу?"
            >
                <AdminModalText>
                    Жалоба будет отклонена, участники получат уведомление о том, что нарушений не
                    выявлено.
                </AdminModalText>

                <div className="flex gap-[16px]">
                    <AdminModalButton
                        onClick={async () => {
                            const row = rejecting
                            setRejecting(null)
                            await run(rejectComplaint.run(row.id), 'Жалоба отклонена')
                        }}
                    >
                        Отклонить
                    </AdminModalButton>
                    <AdminModalButton variant="secondary" onClick={() => setRejecting(null)}>
                        Отменить
                    </AdminModalButton>
                </div>
            </AdminModal>
        </>
    )
}
