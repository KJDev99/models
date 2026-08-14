'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { COMPLAINT_CHAT } from '@/components/admin/complaints/complaints-data'

// ─────────────────────────────────────────────────────────────────────────────
// «Переписка участников» — Figma 344:17016 / mobil 460:27434.
// Keng oq oyna: sarlavha, ishtirokchilar qatori va aylanadigan xabarlar.
// ─────────────────────────────────────────────────────────────────────────────
export default function ComplaintChatModal({ open, onClose, complaint }) {
    useEffect(() => {
        if (!open) return

        const { overflow } = document.body.style
        document.body.style.overflow = 'hidden'

        function onKey(e) {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', onKey)

        return () => {
            document.body.style.overflow = overflow
            document.removeEventListener('keydown', onKey)
        }
    }, [open, onClose])

    if (!open) return null

    return (
        <div
            className="fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-[12px]"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                className="modal-in flex max-h-[90vh] w-full max-w-[910px] flex-col gap-[16px] overflow-hidden rounded-[6px] bg-white p-[12px] lg:gap-[24px] lg:p-[24px]"
            >
                <div className="flex items-center justify-between gap-[16px]">
                    <h2 className="text-[20px] font-medium text-black lg:text-[32px]">
                        Переписка участников
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Закрыть"
                        className="flex size-[24px] shrink-0 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-70 lg:size-[32px]"
                    >
                        <X size={32} strokeWidth={2} className="size-[24px] lg:size-[32px]" />
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-[16px] text-[14px] font-medium text-black lg:text-[16px]">
                    <span className="flex items-center gap-[8px]">
                        <span className="block size-[20px] rounded-full bg-[#7d7d7d]" />
                        {complaint?.author}
                    </span>
                    <span className="flex items-center gap-[8px]">
                        <span className="block size-[20px] rounded-full bg-[#7d7d7d]" />
                        {complaint?.target}
                    </span>
                </div>

                <div className="custom-scrollbar flex flex-col gap-[16px] overflow-y-auto pr-[4px]">
                    {COMPLAINT_CHAT.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-end gap-[8px] ${
                                message.own ? 'flex-row-reverse' : ''
                            }`}
                        >
                            <span className="block size-[32px] shrink-0 rounded-full bg-[#7d7d7d]" />
                            <span
                                className={`flex max-w-[75%] items-end gap-[8px] rounded-[6px] p-[12px] text-[14px] leading-[20px] text-black lg:text-[16px] lg:leading-[22px] ${
                                    message.own ? 'bg-[#f7f2e9]' : 'bg-light-white'
                                }`}
                            >
                                {message.text}
                                <span className="shrink-0 text-[12px] text-grey">
                                    {message.time}
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
