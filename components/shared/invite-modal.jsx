'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import Select from '@/components/ui/select'
import Textarea from '@/components/ui/textarea'
import EmptyState from '@/components/ui/empty-state'
import { useApiStore } from '@/store/useApiStore'

// Figma: "Пригласить в проект" (164:15199) → "Приглашение отправлено" (164:15594).
export default function InviteModal({ open, onClose, executor }) {
    const getDataToken = useApiStore((s) => s.getDataToken)
    const postDataToken = useApiStore((s) => s.postDataToken)

    const [projects, setProjects] = useState([])
    const [projectId, setProjectId] = useState('')
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)

    useEffect(() => {
        if (!open) return
        getDataToken('/projects/mine/', { status: 'active' }).then((r) => {
            setSent(false)
            const list = r.data?.results || r.data || []
            setProjects(list.map((p) => ({ label: p.title, value: String(p.id) })))
        })
    }, [open, getDataToken])

    async function submit() {
        if (!projectId) {
            toast.error('Выберите проект')
            return
        }
        setSending(true)
        const res = await postDataToken('/invites/', {
            projectId: Number(projectId),
            executorId: executor?.id,
            message,
        })
        setSending(false)
        if (res.success) {
            setSent(true)
        } else {
            toast.error('Не удалось отправить приглашение')
        }
    }

    if (sent) {
        return (
            <Modal open={open} onClose={onClose} title="Приглашение отправлено" width="max-w-[480px]">
                <p className="text-base text-grey">
                    {executor?.name || 'Исполнитель'} получит уведомление и сможет ответить в
                    сообщениях.
                </p>
                <Button onClick={onClose} className="mt-6" full>
                    Понятно
                </Button>
            </Modal>
        )
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Пригласить в проект"
            description={executor?.name ? `Приглашение для: ${executor.name}` : undefined}
        >
            {projects.length === 0 ? (
                <EmptyState
                    title="У вас нет активных проектов"
                    description="Сначала создайте проект — потом сможете приглашать исполнителей."
                    actionText="Создать проект"
                    actionHref="/company/projects/new"
                />
            ) : (
                <div className="flex flex-col gap-5">
                    <Select
                        label="Проект"
                        value={projectId}
                        options={projects}
                        placeholder="Выберите проект"
                        onChange={setProjectId}
                    />
                    <Textarea
                        label="Сообщение"
                        value={message}
                        maxLength={500}
                        placeholder="Расскажите о съёмке, датах и условиях"
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button onClick={submit} loading={sending} full>
                        Отправить приглашение
                    </Button>
                </div>
            )}
        </Modal>
    )
}
