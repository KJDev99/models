'use client'

import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { LifeBuoy } from 'lucide-react'
import { useChatStore } from '@/store/useChatStore'
import { useApi, useAction } from '@/lib/use-api'
import * as site from '@/lib/api/site'

// ─────────────────────────────────────────────────────────────────────────────
// «Поддержка» — texnik yordam bilan suhbat (mijoz izohi 24/08 №12).
//
// GET /site/support tizim foydalanuvchisini beradi, undan keyin oddiy suhbat
// ochiladi (`POST /customer|performer|agency/chats`). Ruchka javob bermasa
// tugma umuman chizilmaydi — bo'sh tugma qolib ketmasligi uchun.
// ─────────────────────────────────────────────────────────────────────────────
export default function SupportButton({ basePath = '/chat', className = '' }) {
    const router = useRouter()
    const startChat = useChatStore((s) => s.startChat)

    const fetchSupport = useCallback(() => site.support(), [])
    const { data: support } = useApi(fetchSupport)
    const open = useAction(startChat)

    if (!support?.user_id && !support?.id) return null

    async function openSupport() {
        const peer = support.user_id || support.id
        const res = await open.run(peer)
        const chatId = res.success ? res.data?.id : null
        if (!chatId) {
            toast.error(res.error?.message || 'Не удалось открыть чат поддержки')
            return
        }
        router.push(`${basePath}/${chatId}`)
    }

    return (
        <button
            type="button"
            onClick={openSupport}
            disabled={open.loading}
            className={`flex cursor-pointer items-center gap-[8px] rounded-[6px] border border-gold px-[16px] py-[10px] text-[14px] font-medium text-gold transition-colors hover:bg-gold hover:text-white disabled:opacity-50 lg:px-[24px] lg:py-[12px] lg:text-[16px] ${className}`}
        >
            <LifeBuoy size={20} strokeWidth={2} />
            {support.name || 'Поддержка'}
        </button>
    )
}
