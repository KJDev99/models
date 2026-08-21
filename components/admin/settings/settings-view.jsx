'use client'

import React, { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import {
    AdminListCard,
    AdminSearch,
    AdminSelect,
    AdminStatus,
    AdminTitle,
} from '@/components/admin/ui/admin-ui'
import Button from '@/components/ui/button'
import { useApi, useAction } from '@/lib/use-api'
import * as adminApi from '@/lib/api/admin'
import * as site from '@/lib/api/site'
import { adminFaqRow } from '@/lib/adapters'

// ─────────────────────────────────────────────────────────────────────────────
// «Настройки» — sayt kontentini boshqarish.
//
// Backendda uchta bo'lim bor (backend/admin.md):
//   GET/PUT  /admin/contacts        — «Контакты» sahifasi
//   GET/POST /admin/faqs            — sahifalar bo'yicha «Частые вопросы»
//   POST     /admin/faqs/{id}/publish · PATCH …/status · DELETE
//
// Rollardan kelgan savollar `pending_review` holatida turadi va shu yerdan
// chop etiladi.
// ─────────────────────────────────────────────────────────────────────────────

const FAQ_STATUS_FILTER = [
    { value: '', label: 'Все статусы' },
    { value: 'pending_review', label: 'На модерации' },
    { value: 'published', label: 'Опубликован' },
    { value: 'hidden', label: 'Скрыт' },
]

const FAQ_STATUS_TONE = {
    published: { label: 'Опубликован', tone: 'success' },
    pending_review: { label: 'На модерации', tone: 'pending' },
    hidden: { label: 'Скрыт', tone: 'draft' },
}

function Field({ label, ...props }) {
    return (
        <label className="flex flex-col gap-[8px] lg:gap-[12px]">
            <span className="text-[14px] text-grey lg:text-[16px]">{label}</span>
            <input
                {...props}
                className="w-full rounded-[6px] bg-light-white p-[12px] text-[14px] text-black outline-none placeholder:text-[#aaa] lg:p-[16px] lg:text-[16px]"
            />
        </label>
    )
}

export default function AdminSettings() {
    return (
        <>
            <AdminTitle>Настройки</AdminTitle>
            <ContactsCard />
            <FaqCard />
        </>
    )
}

// ── «Контакты сайта» ────────────────────────────────────────────────────────
function ContactsCard() {
    const fetcher = useCallback(() => adminApi.contacts(), [])
    const { data, loading, reload } = useApi(fetcher)
    const save = useAction(adminApi.saveContacts)

    const [form, setForm] = useState(null)
    // Ma'lumot kelgach forma bir marta to'ldiriladi (`key` orqali qayta mount).
    const values = form || {
        phone: data?.phone || '',
        email: data?.email || '',
        address: data?.address || '',
        city: data?.city || '',
    }

    const set = (key) => (e) => setForm({ ...values, [key]: e.target.value })

    async function submit() {
        const res = await save.run(values)
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success('Контакты сохранены')
        setForm(null)
        reload()
    }

    return (
        <AdminListCard title="Контакты сайта">
            {loading ? (
                <div className="h-[200px] animate-pulse rounded-[6px] bg-black/5" />
            ) : (
                <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                    <Field label="Телефон" value={values.phone} onChange={set('phone')} />
                    <Field
                        label="Электронная почта"
                        type="email"
                        value={values.email}
                        onChange={set('email')}
                    />
                    <Field label="Город" value={values.city} onChange={set('city')} />
                    <Field label="Адрес" value={values.address} onChange={set('address')} />

                    <Button
                        variant="gold"
                        onClick={submit}
                        disabled={save.loading}
                        className="lg:w-[240px]"
                    >
                        Сохранить
                    </Button>
                </div>
            )}
        </AdminListCard>
    )
}

// ── «Частые вопросы» ────────────────────────────────────────────────────────
function FaqCard() {
    const [type, setType] = useState('')
    const [status, setStatus] = useState('')
    const [query, setQuery] = useState('')
    const [adding, setAdding] = useState(false)
    const [draft, setDraft] = useState({ page_type: '', question: '', answer: '' })

    const typesFetcher = useCallback(() => site.faqTypes(), [])
    const { data: types } = useApi(typesFetcher)

    const fetcher = useCallback(
        () => adminApi.faqs({ type: type || undefined, status: status || undefined }),
        [type, status],
    )
    const { data, loading, error, reload } = useApi(fetcher)

    const create = useAction(adminApi.createFaq)
    const publish = useAction(adminApi.publishFaq)
    const setFaqStatus = useAction(adminApi.setFaqStatus)
    const remove = useAction(adminApi.deleteFaq)

    const rows = useMemo(() => {
        const list = (data?.items || data || []).map(adminFaqRow).filter(Boolean)
        const q = query.trim().toLowerCase()
        return q ? list.filter((r) => r.question.toLowerCase().includes(q)) : list
    }, [data, query])

    const typeOptions = useMemo(
        () => [
            { value: '', label: 'Все страницы' },
            ...(types || []).map((t) => ({ value: t.type, label: t.title })),
        ],
        [types],
    )

    async function run(promise, message) {
        const res = await promise
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success(message)
        reload()
    }

    async function submitNew() {
        if (!draft.page_type || !draft.question.trim() || !draft.answer.trim()) return
        const res = await create.run(draft)
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success('Вопрос добавлен')
        setDraft({ page_type: '', question: '', answer: '' })
        setAdding(false)
        reload()
    }

    return (
        <AdminListCard
            title="Частые вопросы"
            action={
                <Button variant="gold" size="md" onClick={() => setAdding((v) => !v)}>
                    <Plus size={20} strokeWidth={2} />
                    Добавить вопрос
                </Button>
            }
            toolbar={
                <>
                    <AdminSearch
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Поиск по тексту вопроса"
                    />
                    <AdminSelect
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        options={typeOptions}
                        className="lg:w-[227px] lg:shrink-0"
                    />
                    <AdminSelect
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        options={FAQ_STATUS_FILTER}
                        className="lg:w-[227px] lg:shrink-0"
                    />
                </>
            }
        >
            {adding && (
                <div className="mb-[16px] flex flex-col gap-[12px] rounded-[6px] bg-light-white p-[12px] lg:p-[16px]">
                    <AdminSelect
                        value={draft.page_type}
                        onChange={(e) => setDraft({ ...draft, page_type: e.target.value })}
                        options={[{ value: '', label: 'Выберите страницу' }, ...typeOptions.slice(1)]}
                    />
                    <Field
                        label="Вопрос"
                        value={draft.question}
                        onChange={(e) => setDraft({ ...draft, question: e.target.value })}
                        placeholder="Например: Как выбрать модель для съёмки?"
                    />
                    <label className="flex flex-col gap-[8px] lg:gap-[12px]">
                        <span className="text-[14px] text-grey lg:text-[16px]">Ответ</span>
                        <textarea
                            value={draft.answer}
                            onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
                            placeholder="Развёрнутый ответ"
                            className="custom-scrollbar min-h-[96px] w-full resize-none rounded-[6px] bg-white p-[12px] text-[14px] text-black outline-none placeholder:text-[#aaa] lg:p-[16px] lg:text-[16px]"
                        />
                    </label>
                    <Button
                        variant="gold"
                        onClick={submitNew}
                        disabled={create.loading}
                        className="lg:w-[240px]"
                    >
                        Опубликовать
                    </Button>
                </div>
            )}

            <div className="flex flex-col gap-[12px] lg:gap-[16px]">
                {(loading || error || rows.length === 0) && (
                    <p className="rounded-[6px] bg-light-white p-[24px] text-center text-[14px] text-grey lg:text-[16px]">
                        {loading ? 'Загружаем…' : error ? error.message : 'Вопросов нет'}
                    </p>
                )}

                {rows.map((faq) => {
                    const state = FAQ_STATUS_TONE[faq.status] || FAQ_STATUS_TONE.published
                    return (
                        <article
                            key={faq.id}
                            className="flex flex-col gap-[12px] rounded-[6px] bg-light-white p-[12px] lg:p-[16px]"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-[12px]">
                                <span className="flex min-w-0 flex-col gap-[4px]">
                                    <span className="text-[14px] font-medium text-black lg:text-[16px]">
                                        {faq.question}
                                    </span>
                                    <span className="text-[12px] text-grey lg:text-[14px]">
                                        {faq.pageType} · {faq.author}
                                    </span>
                                </span>

                                <div className="flex items-center gap-[12px]">
                                    <AdminStatus tone={state.tone} className="lg:w-[150px]">
                                        {state.label}
                                    </AdminStatus>

                                    {faq.status === 'pending_review' ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                run(publish.run(faq.id), 'Вопрос опубликован')
                                            }
                                            className="cursor-pointer text-[12px] font-medium text-gold transition-opacity hover:opacity-70 lg:text-[14px]"
                                        >
                                            Опубликовать
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                run(
                                                    setFaqStatus.run(
                                                        faq.id,
                                                        faq.status === 'hidden'
                                                            ? 'published'
                                                            : 'hidden',
                                                    ),
                                                    'Статус изменён',
                                                )
                                            }
                                            className="cursor-pointer text-[12px] font-medium text-grey transition-colors hover:text-black lg:text-[14px]"
                                        >
                                            {faq.status === 'hidden' ? 'Показать' : 'Скрыть'}
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => run(remove.run(faq.id), 'Вопрос удалён')}
                                        aria-label="Удалить вопрос"
                                        className="cursor-pointer text-danger transition-opacity hover:opacity-70"
                                    >
                                        <Trash2 size={20} strokeWidth={2} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-[12px] leading-[18px] text-grey lg:text-[14px] lg:leading-[20px]">
                                {faq.answer}
                            </p>
                        </article>
                    )
                })}
            </div>
        </AdminListCard>
    )
}
