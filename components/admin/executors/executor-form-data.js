// «Создать исполнителя» formasi uchun ro'yxatlar — Figma 335:14800.

export const EXECUTOR_TYPES = [
    { value: 'model', label: 'Модель' },
    { value: 'photographer', label: 'Фотограф' },
    { value: 'videographer', label: 'Видеограф' },
]

// Sonli o'lchamlar uchun ro'yxat yasovchi (Figma'da barchasi ochiladigan ro'yxat).
function range(from, to, unit) {
    const list = [{ value: '', label: `Выберите${unit ? '' : ''} значение` }]
    for (let i = from; i <= to; i += 1) list.push({ value: String(i), label: `${i} ${unit}` })
    return list
}

export const PARAM_FIELDS = [
    { key: 'height', label: 'Рост', options: range(140, 200, 'см'), placeholder: '170 см' },
    { key: 'weight', label: 'Вес', options: range(40, 120, 'кг'), placeholder: '55 кг' },
    { key: 'chest', label: 'Грудь', options: range(70, 120, 'см'), placeholder: '84 см' },
    { key: 'waist', label: 'Талия', options: range(50, 110, 'см'), placeholder: '61 см' },
    { key: 'hips', label: 'Бёдра', options: range(70, 130, 'см'), placeholder: '90 см' },
    {
        key: 'clothing',
        label: 'Размер одежды',
        options: [
            { value: '', label: 'Выберите размер' },
            { value: 'xs', label: 'XS (40)' },
            { value: 's', label: 'S (42)' },
            { value: 'm', label: 'M (44)' },
            { value: 'l', label: 'L (46)' },
            { value: 'xl', label: 'XL (48)' },
        ],
    },
    { key: 'shoes', label: 'Размер обуви', options: range(33, 47, '') },
    {
        key: 'hair',
        label: 'Цвет волос',
        options: [
            { value: '', label: 'Выберите цвет волос' },
            { value: 'blond', label: 'Блонд' },
            { value: 'light', label: 'Русый' },
            { value: 'dark', label: 'Тёмно-русый' },
            { value: 'brown', label: 'Шатен' },
            { value: 'black', label: 'Брюнет' },
            { value: 'red', label: 'Рыжий' },
        ],
    },
    {
        key: 'eyes',
        label: 'Цвет глаз',
        options: [
            { value: '', label: 'Выберите цвет глаз' },
            { value: 'brown', label: 'Карие' },
            { value: 'green', label: 'Зелёные' },
            { value: 'blue', label: 'Голубые' },
            { value: 'grey', label: 'Серые' },
        ],
    },
    {
        key: 'passport',
        label: 'Загранпаспорт',
        options: [
            { value: 'yes', label: 'Есть' },
            { value: 'no', label: 'Нет' },
        ],
    },
    {
        key: 'travel',
        label: 'Выезд в другие города',
        options: [
            { value: 'yes', label: 'Да' },
            { value: 'no', label: 'Нет' },
        ],
        full: true,
    },
]

export const EXPERIENCE_FIELDS = [
    { key: 'years', label: 'Лет опыта' },
    { key: 'shoots', label: 'Количество съёмок' },
    { key: 'brands', label: 'Количество брендов' },
    { key: 'projects', label: 'Количество проектов' },
]

// O'ng ustundagi qadamlar (Figma 335:14979).
export const EXECUTOR_STEPS = ['Основная информация', 'Опыт участия в проектах', 'Портфолио']
