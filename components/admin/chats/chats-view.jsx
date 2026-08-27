'use client'

import React, { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUp, ChevronLeft, Paperclip, Trash2, UserX } from 'lucide-react'
import { AdminRowMenu } from '@/components/admin/ui/admin-ui'
import { BlockModal, DeleteModal } from '@/components/admin/ui/admin-modals'
import { useApi, useAction } from '@/lib/use-api'
import * as site from '@/lib/api/site'
import * as adminApi from '@/lib/api/admin'
import { chatListItem, chatMessage } from '@/lib/adapters'
import { PLACEHOLDER } from '@/lib/assets'

// ─────────────────────────────────────────────────────────────────────────────
// «Чаты» — Figma 344:16231 / mobil 461:28717.
// Chapda suhbatlar ro'yxati, o'ngda yozishmalar. Mobilda ikkisi navbat bilan
// ko'rsatiladi: suhbat tanlangunча ro'yxat, keyin yozishma.
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminChats() {
    const [activeId, setActiveId] = useState(null)
    const [openOnMobile, setOpenOnMobile] = useState(false)
    const [draft, setDraft] = useState('')
    const [action, setAction] = useState(null)

    // GET /admin/chats — qo'llab-quvvatlash suhbatlari (backend/admin.md).
    const listFetcher = useCallback(() => adminApi.chats(), [])
    const { data: listData, loading: listLoading } = useApi(listFetcher)

    // Adminning javoblari texnik yordam foydalanuvchisi nomidan ketadi
    // (`sender_id` = `/site/support` dagi `user_id`). Suhbatning ikkinchi
    // tomoni — shu id emas bo'lgan qatnashchi.
    const supportFetcher = useCallback(() => site.support(), [])
    const { data: support } = useApi(supportFetcher)
    const supportId = support?.user_id || support?.id || null

    const chats = useMemo(
        () =>
            (Array.isArray(listData) ? listData : listData?.items || [])
                .map(chatListItem)
                .filter(Boolean)
                .map((c) => ({
                    id: c.id,
                    name: c.companion.name,
                    role: c.companion.role,
                    avatar: c.companion.avatar || PLACEHOLDER,
                    preview: c.lastMessage?.text || '',
                    time: shortTime(c.lastAt),
                    unread: c.unreadCount > 0,
                    // `/admin/chats` `peer_id` bermaydi — suhbatdosh sifatida
                    // yordam foydalanuvchisi bo'lmagan tomonni olamiz.
                    peerId:
                        c.peerId ||
                        (c.userAId && c.userAId !== supportId ? c.userAId : c.userBId) ||
                        null,
                    peerRole: c.peerRole,
                    isSupport: c.kind === 'support',
                })),
        [listData, supportId],
    )

    const current = activeId || chats[0]?.id || null
    const active = chats.find((chat) => chat.id === current) || null

    const historyFetcher = useCallback(() => adminApi.chat(current), [current])
    const { data: historyData, reload } = useApi(historyFetcher, {
        enabled: Boolean(current),
    })

    // Adminning o'z xabarlari o'ng tomonda. `GET /admin/chats/{id}` javobida
    // administrator identifikatori yo'q, lekin javoblar yordam foydalanuvchisi
    // nomidan ketadi — shuning uchun tenglashtirish o'sha id bo'yicha.
    const messages = useMemo(
        () =>
            (historyData?.messages || [])
                .map((m) => chatMessage(m, historyData?.admin_id || supportId))
                .filter(Boolean)
                .map((m) => ({ ...m, time: shortTime(m.createdAt) })),
        [historyData, supportId],
    )

    const sendMessage = useAction(adminApi.sendMessage)

    const upload = useAction(site.upload)

    async function send(attachmentUrl = null, fallbackBody = '') {
        const text = draft.trim()
        // Backend `body` ni majburiy qilgan (`minLength: 1`) — izohsiz rasm
        // uchun fayl nomi yuboriladi (hisobot, 21-band).
        const body = text || fallbackBody
        if (!body || !current) return
        const res = await sendMessage.run(current, { body, attachmentUrl })
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        setDraft('')
        reload()
    }

    // Skrepka — fayl avval `POST /site/upload` ga ketadi (backend/site.md).
    async function attach(file) {
        if (!file || !current) return
        const res = await upload.run(file)
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        await send(res.data?.url, file.name)
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
                        {!listLoading && chats.length === 0 && (
                            <p className="p-[12px] text-[14px] text-grey lg:text-[16px]">
                                Обращений нет
                            </p>
                        )}
                        {chats.map((chat) => (
                            <button
                                key={chat.id}
                                type="button"
                                onClick={() => {
                                    setActiveId(chat.id)
                                    setOpenOnMobile(true)
                                }}
                                className={`flex cursor-pointer items-center gap-[12px] rounded-[6px] border-b border-black/8 p-[12px] text-left transition-colors ${
                                    chat.id === current ? 'bg-light-white' : 'hover:bg-light-white'
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
                                    <span className="text-[12px] text-grey">
                                        {chat.isSupport
                                            ? [chat.role, 'Поддержка'].filter(Boolean).join(' · ')
                                            : chat.role}
                                    </span>
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
                    {/* Suhbatlar hali yo'q — Figma'da bo'sh holat matni. */}
                    {!active ? (
                        <div className="flex flex-1 items-center justify-center p-[24px]">
                            <p className="text-center text-[14px] text-grey lg:text-[16px]">
                                {listLoading ? 'Загружаем…' : 'Выберите чат, чтобы открыть переписку'}
                            </p>
                        </div>
                    ) : (
                    <>
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
                            href={adminProfileHref(active)}
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
                                    className={`flex max-w-[75%] flex-col gap-[8px] rounded-[6px] p-[12px] text-[14px] leading-[20px] text-black lg:text-[16px] lg:leading-[22px] ${
                                        message.own ? 'bg-[#f7f2e9]' : 'bg-light-white'
                                    }`}
                                >
                                    {message.attachment && (
                                        <a
                                            href={message.attachment}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="relative block h-[160px] w-[220px] max-w-full overflow-hidden rounded-[6px] bg-black/10"
                                        >
                                            <Image
                                                src={message.attachment}
                                                alt=""
                                                fill
                                                sizes="220px"
                                                className="object-cover"
                                            />
                                        </a>
                                    )}
                                    <span className="flex items-end gap-[8px]">
                                        {message.text}
                                        <span className="shrink-0 text-[12px] text-grey">
                                            {message.time}
                                        </span>
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-[12px] border-t border-black/8 p-[12px] lg:gap-[16px] lg:p-[24px]">
                        <label
                            className={`text-grey transition-colors hover:text-black ${
                                upload.loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                            }`}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    e.target.value = ''
                                    attach(file)
                                }}
                            />
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
                            onClick={() => send()}
                            aria-label="Отправить"
                            className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-gold text-white transition-colors hover:bg-[#c19754] lg:size-[40px]"
                        >
                            <ArrowUp size={24} strokeWidth={2} />
                        </button>
                    </div>
                    </>
                    )}
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

// «12:46» — xabar va suhbat vaqti (Figma 344:16231).
// Suhbatdosh profili adminkaning qaysi bo'limida turishi — roliga bog'liq.
function adminProfileHref(chat) {
    if (!chat?.peerId) return '/admin/chats'
    if (chat.peerRole === 'agency') return `/admin/agencies/${chat.peerId}`
    if (chat.peerRole === 'customer') return `/admin/clients/${chat.peerId}`
    return `/admin/executors/${chat.peerId}`
}

function shortTime(value) {
    if (!value) return ''
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}
