// «Площадки» — Figma 342:10467 (ro'yxat) va 343:12110 (Studio Loft 21).

import { VENUES, VENUE_GALLERY, VENUE_IMAGE } from '@/components/venues/venues-data'
import { PROJECT_COMPANY } from '@/components/projects/projects-data'

export { VENUE_IMAGE, VENUE_GALLERY }

export const VENUES_PAGE_SIZE = 6

const STATUSES = ['active', 'active', 'moderation', 'paused', 'archive', 'rejected']

export const ADMIN_VENUES = VENUES.slice(0, 30).map((venue, i) => ({
    ...venue,
    id: `v-${i + 1}`,
    status: STATUSES[i % STATUSES.length],
    comments: 45,
    views: 45,
    company: {
        ...PROJECT_COMPANY,
        projects: '5 площадок компании',
    },
}))

export const VENUE_STATUS_FILTER = [
    { value: '', label: 'Все статусы' },
    { value: 'active', label: 'Активен' },
    { value: 'moderation', label: 'На модерации' },
    { value: 'paused', label: 'На паузе' },
    { value: 'archive', label: 'Архив' },
    { value: 'rejected', label: 'Отклонен' },
]
