// «Проекты» — Figma 338:19284 (ro'yxat) va 343:11886 (loyiha sahifasi).
// Kontent ochiq saytdagi loyiha ma'lumotlaridan olinadi — adminkada shu
// yozuvlar ustidan boshqaruv qo'shiladi.

import { PROJECT, DETAILS } from '@/components/projects/[slug]/project-detail-data'

export { PROJECT, DETAILS }

export const PROJECTS_PAGE_SIZE = 6

const STATUSES = ['active', 'paused', 'active', 'archive', 'rejected', 'done']

export const ADMIN_PROJECTS = Array.from({ length: 30 }, (_, i) => ({
    ...PROJECT,
    id: `p-${i + 1}`,
    status: STATUSES[i % STATUSES.length],
    comments: 45,
    views: 45,
}))

export const PROJECT_STATUS_FILTER = [
    { value: '', label: 'Все статусы' },
    { value: 'active', label: 'Активен' },
    { value: 'moderation', label: 'На модерации' },
    { value: 'paused', label: 'На паузе' },
    { value: 'archive', label: 'Архив' },
    { value: 'rejected', label: 'Отклонен' },
    { value: 'done', label: 'Завершен' },
]
