'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { FiSend } from 'react-icons/fi'
import { Paperclip } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateTime } from '@/lib/format'
import Avatar from '@/components/ui/avatar'
import Spinner from '@/components/ui/spinner'
import * as site from '@/lib/api/site'

// Figma: сообщение (193:3489). readOnly — admin "Переписка участников" (344:17016)
// rejimida yozish imkoni yo'q.
export default function ChatWindow({
    messages = [],
    companion,
    loading,
    sending,
    onSend,
    currentUserId,
    readOnly = false,
}) {
    const [text, setText] = useState('')
    const [uploading, setUploading] = useState(false)
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    function submit(e) {
        e.preventDefault()
        if (!text.trim()) return
        onSend?.(text)
        setText('')
    }

    // Skrepka: fayl avval `POST /site/upload` ga ketadi, so'ng xabar sifatida
    // yuboriladi (matnsiz ham bo'ladi) — backend `attachment_url` ni kutadi.
    async function attach(file) {
        if (!file) return
        setUploading(true)
        try {
            const res = await site.upload(file)
            const url = res?.url
            if (!url) throw new Error('Файл не загрузился')
            // Izohsiz rasm ham yuboriladi — backend `body` ni ixtiyoriy qildi.
            await onSend?.(text.trim(), url)
            setText('')
        } catch (err) {
            toast.error(err?.message || 'Не удалось отправить файл')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="flex h-[70vh] flex-col overflow-hidden rounded-[16px] border border-black/8 bg-white">
            <header className="flex items-center gap-3 border-b border-black/8 p-4">
                <Avatar src={companion?.avatar} name={companion?.name} />
                <div>
                    <p className="text-base text-black">{companion?.name || 'Диалог'}</p>
                    {companion?.role && <p className="text-sm text-grey">{companion.role}</p>}
                </div>
            </header>

            <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
                {loading && (
                    <div className="flex justify-center py-10">
                        <Spinner />
                    </div>
                )}

                {!loading && messages.length === 0 && (
                    <p className="py-10 text-center text-base text-grey">
                        Сообщений пока нет — напишите первым.
                    </p>
                )}

                {messages.map((m) => {
                    const own = String(m.authorId) === String(currentUserId)
                    return (
                        <div key={m.id} className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[75%] rounded-[16px] px-4 py-3 ${
                                    own ? 'bg-gold text-white' : 'bg-light-white text-black'
                                }`}
                            >
                                {m.attachment && (
                                    <a
                                        href={m.attachment}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="relative mb-2 block h-[160px] w-[220px] max-w-full overflow-hidden rounded-[12px] bg-black/10"
                                    >
                                        <Image
                                            src={m.attachment}
                                            alt=""
                                            fill
                                            sizes="220px"
                                            className="object-cover"
                                        />
                                    </a>
                                )}
                                {m.text && (
                                    <p className="whitespace-pre-line text-base">{m.text}</p>
                                )}
                                <p className={`mt-1 text-xs ${own ? 'text-white/70' : 'text-grey'}`}>
                                    {formatDateTime(m.createdAt)}
                                </p>
                            </div>
                        </div>
                    )
                })}
                <div ref={bottomRef} />
            </div>

            {!readOnly && (
                <form onSubmit={submit} className="flex items-center gap-3 border-t border-black/8 p-4">
                    {/* Fayl biriktirish — Figma'dagi «paperclip» (193:3489). */}
                    <label
                        className={`shrink-0 text-grey transition-colors hover:text-black ${
                            uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'
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
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Напишите сообщение..."
                        className="h-12 flex-1 rounded-[12px] border border-black/15 px-4 text-base outline-none focus:border-gold"
                    />
                    <button
                        type="submit"
                        disabled={sending || !text.trim()}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-gold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                        aria-label="Отправить"
                    >
                        <FiSend size={20} />
                    </button>
                </form>
            )}
        </div>
    )
}
