// «Жалоба» — Figma 344:16561 (ro'yxat), 344:17016 («Переписка участников»),
// 345:17769 («Отклонить жалобу?»).

export const COMPLAINTS_PAGE_SIZE = 6

export const COMPLAINTS = Array.from({ length: 30 }, (_, i) => ({
    id: `cm-${i + 1}`,
    author: 'Анна Смирнова',
    target: 'Иван Иванов',
    reason: 'Оскорбление',
    text: 'Пользователь начал грубо общаться во время обсуждения условий съёмки и использовал оскорбительные выражения. Прошу проверить переписку.',
    date: '12.06.2026, 12:33',
    status: i % 6 === 1 ? 'done' : 'pending',
}))

export const COMPLAINT_STATUS = {
    pending: { label: 'На рассмотрении', tone: 'info' },
    done: { label: 'Рассмотрено', tone: 'success' },
    rejected: { label: 'Отклонена', tone: 'danger' },
}

export const COMPLAINT_FILTER = [
    { value: '', label: 'Все жалобы' },
    { value: 'pending', label: 'На рассмотрении' },
    { value: 'done', label: 'Рассмотрено' },
    { value: 'rejected', label: 'Отклонена' },
]

// «Переписка участников» (Figma 344:17023). `own: true` — shikoyat qilingan
// tomonning xabari (o'ngda).
export const COMPLAINT_CHAT = [
    { id: 1, own: true, text: 'свободны 25 июля для съемки каталога?', time: '12:45' },
    { id: 2, own: false, text: 'Здравствуйте. Да, пока свободен.', time: '12:45' },
    {
        id: 3,
        own: true,
        text: 'Съёмка будет примерно 4 часа, в студии в центре города. Стоимость у вас указана 7 000 рублей, верно?',
        time: '12:45',
    },
    { id: 4, own: false, text: 'Да, но это базовая стоимость.', time: '12:45' },
    { id: 5, own: true, text: 'А что входит в базовую стоимость?', time: '12:45' },
    { id: 6, own: false, text: 'Вы описание профиля вообще читали?', time: '12:45' },
    {
        id: 7,
        own: true,
        text: 'Да, читала. Просто хотела уточнить детали перед подтверждением.',
        time: '12:45',
    },
    {
        id: 8,
        own: false,
        text: 'Сколько можно задавать одни и те же глупые вопросы? Там всё написано. Если не понимаете, ищите другого исполнителя.',
        time: '12:45',
    },
    { id: 9, own: false, text: 'Не тратье мое время', time: '12:45' },
]
