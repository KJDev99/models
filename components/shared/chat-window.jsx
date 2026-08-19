'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FiSend } from 'react-icons/fi'
import { formatDateTime } from '@/lib/format'
import Avatar from '@/components/ui/avatar'
import Spinner from '@/components/ui/spinner'

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
                                <p className="whitespace-pre-line text-base">{m.text}</p>
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
