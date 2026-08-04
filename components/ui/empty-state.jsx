import React from 'react'
import Button from '@/components/ui/button'

// Figma: "Пустой профиль" (260:12521, 270:19929, 338:16778) — bo'sh holat bloki.
export default function EmptyState({
    title = 'Пока пусто',
    description,
    actionText,
    actionHref,
    onAction,
    icon,
}) {
    return (
        <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-black/15 bg-light-white px-6 py-14 text-center">
            {icon && <div className="mb-4 text-gold">{icon}</div>}
            <p className="text-lg font-medium text-black">{title}</p>
            {description && <p className="mt-2 max-w-[420px] text-base text-grey">{description}</p>}
            {(actionText && (actionHref || onAction)) && (
                <Button href={actionHref} onClick={onAction} className="mt-6">
                    {actionText}
                </Button>
            )}
        </div>
    )
}
