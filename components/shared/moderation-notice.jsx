import React from 'react'
import { STATUS } from '@/lib/statuses'
import Button from '@/components/ui/button'

// Figma: "На модерации" (265:15457), "Анкета отклонена" (265:14663),
// "Анкета активна" (260:11332) — kabinet tepasidagi holat bannerи.
const TONE = {
    [STATUS.MODERATION]: 'border-warning/30 bg-warning/10 text-warning',
    [STATUS.REJECTED]: 'border-danger/30 bg-danger/10 text-danger',
    [STATUS.ACTIVE]: 'border-success/30 bg-success/10 text-success',
    [STATUS.DRAFT]: 'border-black/10 bg-light-white text-grey',
    [STATUS.HIDDEN]: 'border-black/10 bg-light-white text-grey',
}

const TEXT = {
    [STATUS.MODERATION]: {
        title: 'Анкета на модерации',
        description: 'Обычно проверка занимает до 24 часов. Мы пришлём уведомление о решении.',
    },
    [STATUS.REJECTED]: {
        title: 'Анкета отклонена',
        description: 'Исправьте замечания модератора и отправьте анкету повторно.',
    },
    [STATUS.ACTIVE]: {
        title: 'Анкета активна',
        description: 'Ваш профиль виден в каталоге — заказчики могут приглашать вас в проекты.',
    },
    [STATUS.DRAFT]: {
        title: 'Анкета не заполнена',
        description: 'Заполните основную информацию и портфолио, чтобы отправить анкету на модерацию.',
    },
    [STATUS.HIDDEN]: {
        title: 'Анкета скрыта',
        description: 'Профиль не отображается в каталоге. Включите видимость в настройках.',
    },
}

export default function ModerationNotice({ status, reason, actionText, actionHref }) {
    const text = TEXT[status]
    if (!text) return null

    return (
        <div className={`mb-6 rounded-[16px] border p-5 lg:p-6 ${TONE[status] || TONE.draft}`}>
            <p className="text-lg font-medium">{text.title}</p>
            <p className="mt-2 text-base text-black/70">{reason || text.description}</p>
            {actionText && actionHref && (
                <Button href={actionHref} variant="whiteStroke" size="sm" className="mt-4">
                    {actionText}
                </Button>
            )}
        </div>
    )
}
