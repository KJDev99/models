// «Исполнители» ro'yxati — Figma 321:13149 / 440:19416.
// Qatorlar Figma'dagi namunalardan olingan, sahifalash uchun ko'paytirilgan.

const SAMPLE = [
    { name: 'Анна Смирнова', type: 'Модель', status: 'active' },
    { name: 'Иван Петров', type: 'Фотограф', status: 'paused' },
    { name: 'LUMEN', type: 'Фотограф', status: 'active' },
    { name: 'Мария Волкова', type: 'Фотограф', status: 'paused' },
    { name: 'Мария Волкова', type: 'Модель', status: 'active' },
    { name: 'Мария Волкова', type: 'Модель', status: 'active' },
    { name: 'Мария Волкова', type: 'Модель', status: 'active' },
    { name: 'Мария Волкова', type: 'Модель', status: 'blocked' },
    { name: 'Мария Волкова', type: 'Модель', status: 'paused' },
]

export const EXECUTORS_PAGE_SIZE = 9

export const EXECUTORS = Array.from({ length: 45 }, (_, i) => {
    const base = SAMPLE[i % SAMPLE.length]
    return {
        id: `e-${i + 1}`,
        ...base,
        email: 'почта@mail.ru',
        date: '17.07.2026 14:34',
    }
})

// Yuqoridagi «Все статусы» ro'yxati (Figma 337:15410).
export const STATUS_FILTER = [
    { value: '', label: 'Все статусы' },
    { value: 'active', label: 'Активен' },
    { value: 'paused', label: 'На паузе' },
    { value: 'blocked', label: 'Заблокирован' },
]
