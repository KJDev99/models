// ─────────────────────────────────────────────────────────────────────────────
// Фотографы katalogi uchun statik kontent.
//
// Figma: desktop setka 93:6605, desktop ro'yxat 102:2652,
// mobil 364:14179 / 364:14752, filtr paneli 93:6637, «Частые вопросы» 320:11866.
//
// Backend ulanganda `PHOTOGRAPHERS` massivi `useCatalogStore.fetch()` javobi
// bilan almashtiriladi — maydon nomlari o'sha holicha qoladi.
// ─────────────────────────────────────────────────────────────────────────────

// Barcha kartochkalarda bitta rasm ishlatiladi (dizaynda ham shunday).
// Hozircha `models/model.jpg` nusxasi turibdi — dizayner haqiqiy suratni shu
// nom bilan almashtirsa, kodda hech narsa o'zgartirish shart emas.
export const PHOTOGRAPHER_IMAGE = '/img/photographers/photographer.jpg'

// Ro'yxat ko'rinishidagi gorizontal lentaga tushadigan ishlar.
export const PHOTOGRAPHER_GALLERY = [
    PHOTOGRAPHER_IMAGE,
    PHOTOGRAPHER_IMAGE,
    PHOTOGRAPHER_IMAGE,
    PHOTOGRAPHER_IMAGE,
]

// Figma 93:7333 / 93:7716 — birinchi kartochkada «Реклама», qolganlarida «Свадебный».
const TAG_SETS = [
    ['Реклама', 'Свадебный', 'Портрет'],
    ['Свадебный'],
    ['Свадебный', 'Коммерческая'],
    ['Свадебный', 'Fashion'],
]

// Figma'da setkada bir sahifada 24 ta (6 qator × 4 ustun), ro'yxatda 6 ta.
export const GRID_PAGE_SIZE = 24
export const LIST_PAGE_SIZE = 6

// 72 ta anketa — sahifalash haqiqiy ishlashi uchun (setkada 3 sahifa).
export const PHOTOGRAPHERS = Array.from({ length: 72 }, (_, i) => ({
    id: i + 1,
    slug: `aleksey-mironov-${i + 1}`,
    name: 'Алексей Миронов',
    age: 24,
    experienceYears: 5,
    shoots: 120,
    city: 'Санкт-Петербург',
    image: PHOTOGRAPHER_IMAGE,
    gallery: PHOTOGRAPHER_GALLERY,
    tags: TAG_SETS[i % TAG_SETS.length],
}))

// ── Filtrlar (Figma 93:6637 — 5 ta maydon, hammasi ochiladigan ro'yxat) ──────
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
        key: 'experience',
        kind: 'select',
        label: 'Опыт',
        placeholder: 'Без опыта',
        // Qiymat — diapazon: `min-max` (chegara yo'q bo'lsa bo'sh qoladi).
        // `performerParams` uni `experience_min` / `experience_max` ga ajratadi.
        // Ilgari bu yerda bitta son turardi va u `experience_min` ga tushardi —
        // «До 1 года» tanlansa `min=1` ketib, 9 yillik tajribalilar ham
        // chiqardi (mijoz izohi 28.08 №1).
        options: [
            { value: '', label: 'Без опыта' },
            { value: '-1', label: 'До 1 года' },
            { value: '1-3', label: 'От 1 до 3 лет' },
            { value: '3-', label: 'Более 3 лет' },
        ],
    },
    {
        key: 'category',
        kind: 'select',
        label: 'Категория',
        placeholder: 'Все категории',
        dict: 'categories_photographer',
        options: [
            { value: '', label: 'Все категории' },
            { value: 'wedding', label: 'Свадебный' },
            { value: 'portrait', label: 'Портрет' },
            { value: 'advertising', label: 'Реклама' },
            { value: 'commercial', label: 'Коммерческая' },
            { value: 'fashion', label: 'Фэшн' },
        ],
    },
    {
        key: 'projectType',
        kind: 'select',
        label: 'Тип проекта',
        placeholder: 'Любой проект',
        dict: 'project_types',
        options: [
            { value: '', label: 'Любой проект' },
            { value: 'photo', label: 'Фотосъёмка' },
            { value: 'video', label: 'Видеосъёмка' },
            { value: 'show', label: 'Показ' },
        ],
    },
    {
        key: 'travel',
        kind: 'select',
        label: 'Выезд в другие города',
        placeholder: 'Любая',
        options: [
            { value: '', label: 'Любая' },
            { value: 'yes', label: 'Готов к выезду' },
            { value: 'no', label: 'Только свой город' },
        ],
    },
]

// Filtrlarning boshlang'ich holati — `FILTER_FIELDS` dan yig'iladi.
export const EMPTY_PHOTOGRAPHER_FILTERS = FILTER_FIELDS.reduce((acc, field) => {
    acc[field.key] = ''
    return acc
}, {})

// ── Saralash (Figma 141:10293 — «Сначала популярные») ───────────────────────
export const SORT_OPTIONS = [
    { value: 'popular', label: 'Сначала популярные' },
    { value: 'new', label: 'Сначала новые' },
    { value: 'experience-desc', label: 'Опыт: сначала больше' },
    { value: 'experience-asc', label: 'Опыт: сначала меньше' },
]

// ── «Частые вопросы» (Figma 320:11866) ──────────────────────────────────────
// Ustunlarga navbat bilan taqsimlanadi: 0 va 2 — chapda, 1 va 3 — o'ngda.
export const PHOTOGRAPHERS_FAQ = [
    {
        q: 'Определите тип съёмки',
        a: 'Свадьба, портрет, реклама или предметная съёмка — от этого зависят подход, оборудование и стоимость смены. Выберите нужное в фильтре «Категория».',
    },
    {
        q: 'Обсудите детали',
        a: 'Напишите фотографу в чате платформы: сроки, локация, количество образов и формат сдачи материалов. Все договорённости остаются в переписке.',
    },
    {
        q: 'Изучите портфолио',
        a: 'В анкете есть портфолио по категориям, опыт участия в проектах и отзывы заказчиков — этого достаточно, чтобы оценить стиль работы.',
    },
    {
        q: 'Что входит в стоимость съёмки?',
        a: 'Обычно это работа фотографа на площадке и отобранные обработанные кадры. Точные условия указаны в блоке «Стоимость» в анкете.',
    },
]
