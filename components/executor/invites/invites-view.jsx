'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import ResourceList from '@/components/cabinet/resource-list'
import { toInviteCard, performerInvites } from '@/components/cabinet/list-fetchers'
import ProjectCard from '@/components/shared/project-card'
import { useAction } from '@/lib/use-api'
import * as performerApi from '@/lib/api/performer'

// ─────────────────────────────────────────────────────────────────────────────
// «Приглашения» — GET /performer/invites (`status`: pending | accepted |
// rejected). Javob: POST /performer/invites/{id}/accept | reject.
// Yorliqlar «Новые / Принятые / Отклонённые» — `list-fetchers.js` dagi
// `API_STATUS` orqali backend qiymatlariga o'giriladi.
// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
    { label: 'Новые', value: 'new' },
    { label: 'Принятые', value: 'accepted' },
    { label: 'Отклонённые', value: 'declined' },
]

export default function ExecutorInvites() {
    // `ResourceList` o'zi qayta yuklaydi; javobdan keyin ro'yxatni yangilash
    // uchun kalitni almashtiramiz.
    const [version, setVersion] = useState(0)

    const accept = useAction(performerApi.acceptInvite)
    const reject = useAction(performerApi.rejectInvite)

    async function respond(action, id) {
        const res = await (action === 'accept' ? accept : reject).run(id)
        if (!res.success) {
            toast.error(res.error.message)
            return
        }
        toast.success(action === 'accept' ? 'Приглашение принято' : 'Приглашение отклонено')
        setVersion((v) => v + 1)
    }

    const busy = accept.loading || reject.loading

    return (
        <Card title="Приглашения" padded={false} className="border-0 bg-transparent">
            <ResourceList
                key={version}
                fetcher={performerInvites}
                adapt={toInviteCard}
                tabs={TABS}
                columns="grid-cols-1 md:grid-cols-2"
                emptyTitle="Приглашений нет"
                emptyDescription="Здесь появятся приглашения заказчиков в проекты."
                renderItem={(item) => (
                    <div key={item.id} className="flex flex-col gap-3">
                        <ProjectCard project={item} basePath="/projects" />
                        {item.inviteStatus === 'pending' && (
                            <div className="flex gap-3">
                                <Button
                                    size="sm"
                                    onClick={() => respond('accept', item.id)}
                                    disabled={busy}
                                    className="flex-1"
                                >
                                    Принять
                                </Button>
                                <Button
                                    size="sm"
                                    variant="darkStroke"
                                    onClick={() => respond('reject', item.id)}
                                    disabled={busy}
                                    className="flex-1"
                                >
                                    Отклонить
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            />
        </Card>
    )
}
