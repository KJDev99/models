// ─────────────────────────────────────────────────────────────────────────────
// Проекты katalogi uchun statik kontent.
//
// Figma: desktop setka 141:8989, desktop ro'yxat 145:11176,
// mobil 373:16436 / 373:17675, mobil filtrlar 360:22138 · 360:21739 · 360:23274.
//
// Backend ulanganda `PROJECTS` massivi `useCatalogStore.fetch()` javobi bilan
// almashtiriladi — maydon nomlari o'sha holicha qoladi.
// ─────────────────────────────────────────────────────────────────────────────

// Barcha kartochkalarda bitta rasm ishlatiladi (dizaynda ham shunday).
export const PROJECT_IMAGE = '/img/projects/project.jpg'

// Figma'da setkada bir sahifada 24 ta (8 qator × 3 ustun), ro'yxatda 6 ta.
export const GRID_PAGE_SIZE = 24
export const LIST_PAGE_SIZE = 6

// Loyihani e'lon qilgan kompaniya (Figma 151:11963).
export const PROJECT_COMPANY = {
    name: 'LIME',
    note: 'Российский бренд одежды',
    projects: '11 проектов компании',
    more: 'Еще 11 проектов',
    // Kompaniya yo'lakchasida LIME so'z-belgisi turadi (Figma 151:11963).
    logo: '/img/companies/lime.svg',
    href: '/companies/lime',
}

// «Кого ищем» — Figma 151:11943. Ro'yxatda beshtasi ko'rinadi, qolgani «+N».
const REQUIREMENTS = [
    'Женский',
    '20–30 лет',
    '170–180 см',
    'Размер одежды S-M',
    'Опыт коммерческих съёмок',
    'Уверенная работа перед камерой',
]

// Sanani ruscha ko'rinishga keltirish: 2026-07-18 → «18 июля».
const MONTHS = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
]

export function formatShootDate(iso) {
    const [, m, d] = iso.split('-')
    return `${Number(d)} ${MONTHS[Number(m) - 1]}`
}

// Sanalar 18.07.2026 dan boshlab har uch kunda — filtr haqiqiy ishlashi uchun.
function shootDate(i) {
    const date = new Date(Date.UTC(2026, 6, 18 + (i % 12) * 3))
    return date.toISOString().slice(0, 10)
}

// 72 ta e'lon — sahifalash haqiqiy ishlashi uchun (setkada 3 sahifa).
export const PROJECTS = Array.from({ length: 72 }, (_, i) => {
    const iso = shootDate(i)
    const pricePerHour = 2500

    return {
        id: i + 1,
        slug: `fashion-brand-shoot-${i + 1}`,
        title: 'Съёмка для fashion-бренда',
        description:
            'Требуется модель для новой коллекции одежды и рекламных материалов',
        need: 'Требуется 2 модели',
        performers: 2,
        lookingFor: 'models',
        category: 'fashion',
        city: 'Санкт-Петербург',
        pricePerHour,
        price: `от ${pricePerHour.toLocaleString('ru-RU')} ₽/час`,
        dateISO: iso,
        date: formatShootDate(iso),
        image: PROJECT_IMAGE,
        requirements: REQUIREMENTS,
        company: PROJECT_COMPANY,
        // Ro'yxat ko'rinishidagi qisqacha tavsif (Figma 145:11910).
        summary:
            'Ищем моделей для рекламной съёмки новой коллекции одежды. Проект включает ' +
            'студийную фотосессию и создание контента для социальных сетей бренда. ' +
            'Рассматриваем моделей с опытом коммерческих съёмок. Съёмка пройдёт в ' +
            'профессиональной фотостудии Санкт-Петербурга.',
    }
})

// ── Filtrlar (Figma 145:11213 — desktop panel) ───────────────────────────────
// `kind`: 'select' — ochiladigan ro'yxat, 'range' — от/до, 'dateRange' — sanalar.
export const FILTER_FIELDS = [
    {
        key: 'city',
        kind: 'select',
        label: 'Город',
        placeholder: 'Любой город',
        options: [
            { value: '', label: 'Любой город' },
            { value: 'moscow', label: 'Москва' },
            { value: 'spb', label: 'Санкт-Петербург' },
            { value: 'kazan', label: 'Казань' },
            { value: 'ekb', label: 'Екатеринбург' },
        ],
    },
    {
        key: 'lookingFor',
        kind: 'select',
        label: 'Кого ищем',
        placeholder: 'Все модели',
        options: [
            { value: '', label: 'Все модели' },
            { value: 'models', label: 'Модели' },
            { value: 'photographers', label: 'Фотографы' },
            { value: 'videographers', label: 'Видеографы' },
            { value: 'venues', label: 'Площадки' },
        ],
    },
    {
        key: 'category',
        kind: 'select',
        label: 'Категория',
        placeholder: 'Все категории',
        options: [
            { value: '', label: 'Все категории' },
            { value: 'fashion', label: 'Fashion' },
            { value: 'commercial', label: 'Коммерческая' },
            { value: 'catalog', label: 'Каталог' },
            { value: 'advertising', label: 'Реклама' },
        ],
    },
    {
        key: 'performers',
        kind: 'select',
        label: 'Количество исполнителей',
        placeholder: '1 человек',
        options: [
            { value: '', label: '1 человек' },
            { value: '2', label: '2 человека' },
            { value: '5', label: 'От 3 до 5 человек' },
            { value: '10', label: 'Более 5 человек' },
        ],
    },
    {
        key: 'price',
        kind: 'range',
        label: 'Стоимость',
        from: { key: 'priceFrom', prefix: 'от', placeholder: '2 000' },
        to: { key: 'priceTo', prefix: 'до', placeholder: '20 000' },
    },
    {
        key: 'shootDate',
        kind: 'dateRange',
        label: 'Дата съёмки',
        from: { key: 'dateFrom', prefix: 'С', placeholder: '18 июня' },
        to: { key: 'dateTo', prefix: 'До', placeholder: '20 июля' },
    },
]

// Filtrlarning boshlang'ich holati — `FILTER_FIELDS` dan yig'iladi.
export const EMPTY_PROJECT_FILTERS = FILTER_FIELDS.reduce((acc, field) => {
    if (field.from && field.to) {
        acc[field.from.key] = ''
        acc[field.to.key] = ''
    } else {
        acc[field.key] = ''
    }
    return acc
}, {})

// ── Saralash (Figma 141:10307) ──────────────────────────────────────────────
export const SORT_OPTIONS = [
    { value: 'popular', label: 'Сначала популярные' },
    { value: 'new', label: 'Сначала новые' },
    { value: 'date-asc', label: 'Дата съёмки: ближайшие' },
    { value: 'price-asc', label: 'Стоимость: по возрастанию' },
    { value: 'price-desc', label: 'Стоимость: по убыванию' },
]

// ── «Частые вопросы» (Figma 373:17643) ──────────────────────────────────────
export const PROJECTS_FAQ = [
    {
        q: 'Безопасно ли работать через платформу?',
        a: 'Да. Все проекты проходят модерацию, а переписка и договорённости остаются в чате платформы — при спорной ситуации мы видим всю историю сотрудничества.',
    },
    {
        q: 'Можно ли редактировать или удалить проект?',
        a: 'Да. Откройте проект в личном кабинете: там можно изменить описание, требования и даты или снять проект с публикации в любой момент.',
    },
    {
        q: 'Как получить больше откликов на проект?',
        a: 'Подробно опишите задачу, укажите гонорар, даты и город, добавьте фотографии референсов. Такие проекты выше в выдаче и получают больше откликов.',
    },
    {
        q: 'Что делать, если исполнитель не выполнил работу?',
        a: 'Напишите в поддержку через чат проекта. Мы разберём переписку и договорённости и поможем решить спор, а недобросовестный аккаунт получит ограничение.',
    },
]
