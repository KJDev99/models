// «Отзывы» — Figma 343:12626 / mobil 457:23859.

const POSITIVE =
    'Отлично справилась с задачей. Быстро влилась в процесс, уверенно работала перед камерой и выполнила все пожелания команды.'

const NEGATIVE =
    'Съёмка прошла не так, как ожидалось. Исполнитель несколько раз опоздал на площадку, из-за чего пришлось менять график работы команды. Часть договорённостей была выполнена не полностью. Надеемся, что в дальнейшем организация процесса станет лучше.'

export const REVIEWS_PAGE_SIZE = 6

export const ADMIN_REVIEWS = Array.from({ length: 30 }, (_, i) => {
    const hidden = i % 6 === 1
    return {
        id: `r-${i + 1}`,
        author: 'Анна Смирнова',
        authorType: 'Частное лицо',
        rating: hidden ? 2 : 5,
        date: '23.04.2026',
        text: hidden ? NEGATIVE : POSITIVE,
        status: hidden ? 'hidden' : 'published',
        target: {
            name: 'Катерина Журавлёва',
            role: 'Модель',
            image: '/img/models/model.jpg',
            href: '/admin/executors/e-1',
        },
    }
})

export const REVIEW_STATUS = {
    published: { label: 'Опубликован', tone: 'success' },
    pending_review: { label: 'На модерации', tone: 'pending' },
    rejected: { label: 'Отклонён', tone: 'danger' },
    hidden: { label: 'Скрыт', tone: 'archive' },
}

// Backend yangi holat qo'shsa, kartochka yiqilmasligi kerak.
export function reviewStatus(status) {
    return REVIEW_STATUS[status] || { label: status || '—', tone: 'archive' }
}

export const RATING_FILTER = [
    { value: '', label: 'Все оценки' },
    { value: '5', label: '5 звёзд' },
    { value: '4', label: '4 звезды' },
    { value: '3', label: '3 звезды' },
    { value: '2', label: '2 звезды' },
    { value: '1', label: '1 звезда' },
]

export const REVIEW_STATUS_FILTER = [
    { value: '', label: 'Все статусы' },
    { value: 'published', label: 'Опубликован' },
    { value: 'hidden', label: 'Скрыт' },
]
