// ─────────────────────────────────────────────────────────────────────────────
// Figma'dagi status ekranlari uchun yagona jadval:
//   Анкета активна (260:11332) / На модерации (265:15457) / Анкета отклонена (265:14663)
//   Проект: активен (216:5469) / отклонён (216:5737)
//   Площадка: Активен (230:7018) / Отклонен (230:7420)
// StatusBadge komponenti shu yerdan rang va matn oladi.
// ─────────────────────────────────────────────────────────────────────────────

export const STATUS = {
    DRAFT: 'draft',
    MODERATION: 'moderation',
    ACTIVE: 'active',
    REJECTED: 'rejected',
    HIDDEN: 'hidden',
    ARCHIVED: 'archived',
    BLOCKED: 'blocked',
    COMPLETED: 'completed',
}

export const STATUS_META = {
    [STATUS.DRAFT]: { label: 'Черновик', className: 'bg-light-white text-grey' },
    [STATUS.MODERATION]: { label: 'На модерации', className: 'bg-warning/15 text-warning' },
    [STATUS.ACTIVE]: { label: 'Активен', className: 'bg-success/15 text-success' },
    [STATUS.REJECTED]: { label: 'Отклонён', className: 'bg-danger/15 text-danger' },
    [STATUS.HIDDEN]: { label: 'Скрыт', className: 'bg-light-white text-grey' },
    [STATUS.ARCHIVED]: { label: 'В архиве', className: 'bg-light-white text-grey' },
    [STATUS.BLOCKED]: { label: 'Заблокирован', className: 'bg-danger/15 text-danger' },
    [STATUS.COMPLETED]: { label: 'Завершён', className: 'bg-black/8 text-black' },
}

export function statusMeta(status) {
    return STATUS_META[status] || { label: status || '—', className: 'bg-light-white text-grey' }
}

// Shikoyat holatlari (Figma: Жалоба 344:16561, Отклонить жалобу? 345:17769)
export const COMPLAINT_STATUS = {
    NEW: 'new',
    IN_REVIEW: 'in_review',
    ACCEPTED: 'accepted',
    DECLINED: 'declined',
}

export const COMPLAINT_STATUS_META = {
    [COMPLAINT_STATUS.NEW]: { label: 'Новая', className: 'bg-warning/15 text-warning' },
    [COMPLAINT_STATUS.IN_REVIEW]: { label: 'На рассмотрении', className: 'bg-black/8 text-black' },
    [COMPLAINT_STATUS.ACCEPTED]: { label: 'Принята', className: 'bg-success/15 text-success' },
    [COMPLAINT_STATUS.DECLINED]: { label: 'Отклонена', className: 'bg-danger/15 text-danger' },
}
