'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUp, ChevronLeft, Paperclip, Trash2, UserX } from 'lucide-react'
import { AdminRowMenu } from '@/components/admin/ui/admin-ui'
import { BlockModal, DeleteModal } from '@/components/admin/ui/admin-modals'
import { CHATS, CHAT_MESSAGES } from '@/components/admin/chats/chats-data'

// ─────────────────────────────────────────────────────────────────────────────
// «Чаты» — Figma 344:16231 / mobil 461:28717.
// Chapda suhbatlar ro'yxati, o'ngda yozishmalar. Mobilda ikkisi navbat bilan
// ko'rsatiladi: suhbat tanlangunча ro'yxat, keyin yozishma.
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminChats() {
    const [activeId, setActiveId] = useState(CHATS[1].id)
    const [openOnMobile, setOpenOnMobile] = useState(false)
    const [draft, setDraft] = useState('')
    const [messages, setMessages] = useState(CHAT_MESSAGES)
    const [action, setAction] = useState(null)

    const active = CHATS.find((chat) => chat.id === activeId) || CHATS[0]

    function send() {
        const text = draft.trim()
        if (!text) return
        setMessages((all) => [...all, { id: Date.now(), own: true, text, time: '12:46' }])
        setDraft('')
    }

    return (
        <>
            <div className="flex min-h-[600px] flex-col overflow-hidden rounded-[6px] bg-white lg:h-[720px] lg:flex-row">
                {/* Suhbatlar ro'yxati */}
                <aside
                    className={`flex w-full flex-col gap-[16px] p-[12px] lg:w-[300px] lg:shrink-0 lg:border-r lg:border-black/8 lg:p-[24px] ${
                        openOnMobile ? 'hidden lg:flex' : 'flex'
                    }`}
                >
                    <h1 className="font-display text-[24px] tracking-[0.48px] text-black uppercase lg:text-[32px] lg:tracking-[0.64px]">
                        Чаты
                    </h1>

                    <div className="flex flex-col">
                        {CHATS.map((chat) => (
                            <button
                                key={chat.id}
                                type="button"
                                onClick={() => {
                                    setActiveId(chat.id)
                                    setOpenOnMobile(true)
                                }}
                                className={`flex cursor-pointer items-center gap-[12px] rounded-[6px] border-b border-black/8 p-[12px] text-left transition-colors ${
                                    chat.id === activeId ? 'bg-light-white' : 'hover:bg-light-white'
                                }`}
                            >
                                <span className="relative block size-[40px] shrink-0 overflow-hidden rounded-full bg-[#d9d9d9]">
                                    <Image
                                        src={chat.avatar}
                                        alt={chat.name}
                                        fill
                                        sizes="40px"
                                        className="object-cover"
                                    />
                                </span>

                                <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                                    <span className="flex items-center justify-between gap-[8px]">
                                        <span className="truncate text-[14px] font-medium text-black">
                                            {chat.name}
                                        </span>
                                        <span className="shrink-0 text-[12px] text-grey">
                                            {chat.time}
                                        </span>
                                    </span>
                                    <span className="text-[12px] text-grey">{chat.role}</span>
                                    <span className="flex items-center justify-between gap-[8px]">
                                        <span className="truncate text-[12px] text-grey">
                                            {chat.preview}
                                        </span>
                                        {chat.unread && (
                                            <span className="size-[8px] shrink-0 rounded-full bg-gold" />
                                        )}
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Yozishma */}
                <section
                    className={`min-w-0 flex-1 flex-col ${openOnMobile ? 'flex' : 'hidden lg:flex'}`}
                >
                    <div className="flex items-center gap-[12px] border-b border-black/8 p-[12px] lg:gap-[16px] lg:p-[24px]">
                        <button
                            type="button"
                            onClick={() => setOpenOnMobile(false)}
                            aria-label="Назад"
                            className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] ui-icon-btn lg:hidden"
                        >
                            <ChevronLeft size={24} strokeWidth={2} />
                        </button>

                        <span className="relative block size-[40px] shrink-0 overflow-hidden rounded-full bg-[#d9d9d9]">
                            <Image
                                src={active.avatar}
                                alt={active.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                            />
                        </span>

                        <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                            <span className="truncate text-[14px] font-medium text-black lg:text-[16px]">
                                {active.name}
                            </span>
                            <span className="truncate text-[12px] text-grey lg:text-[14px]">
                                {active.online}
                            </span>
                        </span>

                        <Link
                            href="/admin/executors/e-1"
                            className="hidden items-center justify-center rounded-[6px] border border-gold px-[16px] py-[8px] text-[14px] font-medium whitespace-nowrap text-gold transition-colors hover:bg-gold hover:text-white sm:flex lg:px-[24px] lg:py-[12px]"
                        >
                            Посмотреть профиль
                        </Link>

                        <span className="flex size-[32px] items-center justify-center rounded-[6px] ui-icon-btn p-[4px]">
                            <AdminRowMenu compact
                                items={[
                                    {
                                        key: 'block',
                                        label: 'Заблокировать',
                                        icon: UserX,
                                        onClick: () => setAction({ type: 'block', row: active }),
                                    },
                                    {
                                        key: 'delete',
                                        label: 'Удалить чат',
                                        icon: Trash2,
                                        danger: true,
                                        onClick: () => setAction({ type: 'delete', row: active }),
                                    },
                                ]}
                            />
                        </span>
                    </div>

                    <div className="custom-scrollbar flex flex-1 flex-col justify-end gap-[16px] overflow-y-auto p-[12px] lg:p-[24px]">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.own ? 'justify-end' : 'justify-start'}`}
                            >
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

                    <div className="flex items-center gap-[12px] border-t border-black/8 p-[12px] lg:gap-[16px] lg:p-[24px]">
                        <label className="cursor-pointer text-grey transition-colors hover:text-black">
                            <input type="file" className="hidden" />
                            <Paperclip size={24} strokeWidth={2} />
                            <span className="sr-only">Прикрепить файл</span>
                        </label>

                        <input
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') send()
                            }}
                            placeholder="Здравствуйте!"
                            className="min-w-0 flex-1 rounded-[6px] border border-black/8 p-[12px] text-[14px] text-black outline-none placeholder:text-[#aaa] lg:text-[16px]"
                        />

                        <button
                            type="button"
                            onClick={send}
                            aria-label="Отправить"
                            className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-gold text-white transition-colors hover:bg-[#c19754] lg:size-[40px]"
                        >
                            <ArrowUp size={24} strokeWidth={2} />
                        </button>
                    </div>
                </section>
            </div>

            <BlockModal
                open={action?.type === 'block'}
                onClose={() => setAction(null)}
                name={action?.row?.name}
            />
            <DeleteModal
                open={action?.type === 'delete'}
                onClose={() => setAction(null)}
                name={action?.row?.name}
            />
        </>
    )
}
