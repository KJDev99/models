// ─────────────────────────────────────────────────────────────────────────────
// Площадки katalogi uchun statik kontent.
//
// Figma: desktop setka 120:1121, desktop ro'yxat 128:3387,
// mobil 373:12458 / 373:12970, filtr paneli 120:1158, «Частые вопросы» 320:11866.
//
// Backend ulanganda `VENUES` massivi `useCatalogStore.fetch()` javobi bilan
// almashtiriladi — maydon nomlari o'sha holicha qoladi.
// ─────────────────────────────────────────────────────────────────────────────

// Barcha kartochkalarda bitta rasm ishlatiladi (dizaynda ham shunday).
// Hozircha `models/model.jpg` nusxasi turibdi — dizayner haqiqiy suratni shu
// nom bilan almashtirsa, kodda hech narsa o'zgartirish shart emas.
export const VENUE_IMAGE = '/img/venues/venue.jpg'

// Ro'yxat ko'rinishidagi gorizontal lentaga tushadigan suratlar.
export const VENUE_GALLERY = [VENUE_IMAGE, VENUE_IMAGE, VENUE_IMAGE, VENUE_IMAGE]

// Figma 138:8590 — kartochka tepasida faqat shahar chipi (teglar «+N» siz).
const TYPES = ['Фотостудия', 'Лофт', 'Интерьерная студия', 'Циклорама']

// Figma'da setkada bir sahifada 24 ta (6 qator × 4 ustun), ro'yxatda 6 ta.
export const GRID_PAGE_SIZE = 24
export const LIST_PAGE_SIZE = 6

// 72 ta e'lon — sahifalash haqiqiy ishlashi uchun (setkada 3 sahifa).
export const VENUES = Array.from({ length: 72 }, (_, i) => ({
    id: i + 1,
    slug: `studio-loft-21-${i + 1}`,
    name: 'Studio Loft 21',
    area: 120,
    capacity: 5,
    pricePerHour: 2500,
    city: 'Санкт-Петербург',
    type: TYPES[i % TYPES.length],
    image: VENUE_IMAGE,
    gallery: VENUE_GALLERY,
}))

// ── Filtrlar (Figma 120:1158 — 4 ta ro'yxat + 2 ta diapazon) ────────────────
export const FILTER_FIELDS = [
    {
        key: 'city',
        kind: 'select',
        label: 'Город',
        placeholder: 'Любой город',
        // Backend `city` ni matn bo'yicha filtrlaydi (GET /site/…?city=Москва),
        // shuning uchun `value` — shaharning to'liq nomi.
        options: [
            { value: '', label: 'Любой город' },
            { value: 'Москва', label: 'Москва' },
            { value: 'Санкт-Петербург', label: 'Санкт-Петербург' },
            { value: 'Казань', label: 'Казань' },
            { value: 'Екатеринбург', label: 'Екатеринбург' },
            { value: 'Сочи', label: 'Сочи' },
        ],
    },
    {
        key: 'venueType',
        kind: 'select',
        label: 'Тип площадки',
        placeholder: 'Все площадки',
        options: [
            { value: '', label: 'Все площадки' },
            { value: 'photo', label: 'Фотостудия' },
            { value: 'loft', label: 'Лофт' },
            { value: 'interior', label: 'Интерьерная студия' },
            { value: 'cyclorama', label: 'Циклорама' },
        ],
    },
    {
        key: 'projectType',
        kind: 'select',
        label: 'Тип проекта',
        placeholder: 'Любой проект',
        options: [
            { value: '', label: 'Любой проект' },
            { value: 'photo', label: 'Фотосъёмка' },
            { value: 'video', label: 'Видеосъёмка' },
            { value: 'content', label: 'Съёмка контента' },
            { value: 'event', label: 'Мероприятие' },
        ],
    },
    {
        key: 'capacity',
        kind: 'select',
        label: 'Вместимость',
        placeholder: 'до 5 человек',
        options: [
            { value: '', label: 'до 5 человек' },
            { value: '10', label: 'до 10 человек' },
            { value: '20', label: 'до 20 человек' },
            { value: '50', label: 'до 50 человек' },
        ],
    },
    {
        key: 'area',
        kind: 'range',
        label: 'Площадь',
        from: { key: 'areaFrom', prefix: 'от', placeholder: '20' },
        to: { key: 'areaTo', prefix: 'до', placeholder: '500' },
    },
    {
        key: 'price',
        kind: 'range',
        label: 'Стоимость',
        from: { key: 'priceFrom', prefix: 'от', placeholder: '2 000' },
        to: { key: 'priceTo', prefix: 'до', placeholder: '20 000' },
    },
]

// Filtrlarning boshlang'ich holati — `FILTER_FIELDS` dan yig'iladi.
export const EMPTY_VENUE_FILTERS = FILTER_FIELDS.reduce((acc, field) => {
    if (field.kind === 'range') {
        acc[field.from.key] = ''
        acc[field.to.key] = ''
    } else {
        acc[field.key] = ''
    }
    return acc
}, {})

// ── Saralash (Figma 141:10293 — «Сначала популярные») ───────────────────────
export const SORT_OPTIONS = [
    { value: 'popular', label: 'Сначала популярные' },
    { value: 'new', label: 'Сначала новые' },
    { value: 'price-asc', label: 'Стоимость: по возрастанию' },
    { value: 'price-desc', label: 'Стоимость: по убыванию' },
]

// ── «Частые вопросы» (Figma 320:12036) ──────────────────────────────────────
// Ustunlarga navbat bilan taqsimlanadi: 0 va 2 — chapda, 1 va 3 — o'ngda.
export const VENUES_FAQ = [
    {
        q: 'Что входит в стоимость аренды студии?',
        a: 'Обычно это аренда зала и базовое оборудование студии — свет, фоны, гримёрная зона. Точный список и условия указаны в блоке «Стоимость» на странице площадки.',
    },
    {
        q: 'Можно ли приехать со своим оборудованием?',
        a: 'Да, почти все площадки разрешают привозить свой свет и технику. Предупредите студию в чате заранее — так вам подготовят нужное количество розеток и место для разгрузки.',
    },
    {
        q: 'Какое минимальное время аренды?',
        a: 'Чаще всего это два часа. Минимальное время указано в карточке площадки, там же можно выбрать дату и часы брони.',
    },
    {
        q: 'Можно ли привести свою команду?',
        a: 'Да. Ограничение только по вместимости зала — она указана в характеристиках. Если людей больше, уточните у площадки возможность увеличить количество.',
    },
]
