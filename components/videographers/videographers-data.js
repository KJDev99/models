// ─────────────────────────────────────────────────────────────────────────────
// Видеографы katalogi uchun statik kontent.
//
// Figma: desktop setka 96:2049, desktop ro'yxat 102:4056,
// mobil 366:16479 / 366:17007, filtr paneli 96:2086, «Частые вопросы» 320:11866.
//
// Backend ulanganda `VIDEOGRAPHERS` massivi `useCatalogStore.fetch()` javobi
// bilan almashtiriladi — maydon nomlari o'sha holicha qoladi.
// ─────────────────────────────────────────────────────────────────────────────

// Barcha kartochkalarda bitta rasm ishlatiladi (dizaynda ham shunday).
// Hozircha `models/model.jpg` nusxasi turibdi — dizayner haqiqiy suratni shu
// nom bilan almashtirsa, kodda hech narsa o'zgartirish shart emas.
export const VIDEOGRAPHER_IMAGE = '/img/videographers/videographer.jpg'

// Ro'yxat ko'rinishidagi gorizontal lentaga tushadigan ishlar.
export const VIDEOGRAPHER_GALLERY = [
    VIDEOGRAPHER_IMAGE,
    VIDEOGRAPHER_IMAGE,
    VIDEOGRAPHER_IMAGE,
    VIDEOGRAPHER_IMAGE,
]

// Figma 138:8189 / 138:8203 — «Клипы +2», «Реклама +2».
const TAG_SETS = [
    ['Клипы', 'Реклама', 'Кино'],
    ['Реклама', 'Интервью', 'Контент'],
    ['Реклама', 'Коммерческая съёмка'],
    ['Кино'],
]

// Figma'da setkada bir sahifada 24 ta (6 qator × 4 ustun), ro'yxatda 6 ta.
export const GRID_PAGE_SIZE = 24
export const LIST_PAGE_SIZE = 6

// 72 ta anketa — sahifalash haqiqiy ishlashi uchun (setkada 3 sahifa).
export const VIDEOGRAPHERS = Array.from({ length: 72 }, (_, i) => ({
    id: i + 1,
    slug: `ilya-voronov-${i + 1}`,
    name: 'Илья Воронов',
    age: 24,
    experienceYears: 4,
    cases: 45,
    city: 'Санкт-Петербург',
    image: VIDEOGRAPHER_IMAGE,
    gallery: VIDEOGRAPHER_GALLERY,
    tags: TAG_SETS[i % TAG_SETS.length],
}))

// ── Filtrlar (Figma 96:2086 — 7 ta maydon, hammasi ochiladigan ro'yxat) ─────
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
        // «Без опыта» ilgari ham bo'sh holat, ham variant edi — filtr
        // qo'llanganmi yoki yo'qmi bilib bo'lmasdi. Endi bo'sh holat —
        // «Любой опыт», «Без опыта» esa haqiqiy filtr (`experience_max=0`).
        placeholder: 'Любой опыт',
        // Qiymat — diapazon: `min-max` (chegara yo'q bo'lsa bo'sh qoladi).
        // `performerParams` uni `experience_min` / `experience_max` ga ajratadi.
        // Ilgari bu yerda bitta son turardi va u `experience_min` ga tushardi —
        // «До 1 года» tanlansa `min=1` ketib, 9 yillik tajribalilar ham
        // chiqardi (mijoz izohi 28.08 №1).
        options: [
            { value: '', label: 'Любой опыт' },
            { value: '-0', label: 'Без опыта' },
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
        dict: 'categories_videographer',
        options: [
            { value: '', label: 'Все категории' },
            { value: 'clips', label: 'Клипы' },
            { value: 'advertising', label: 'Реклама' },
            { value: 'cinema', label: 'Кино' },
            { value: 'interview', label: 'Интервью' },
            { value: 'commercial', label: 'Коммерческая съёмка' },
            { value: 'content', label: 'Контент' },
        ],
    },
    {
        key: 'projectType',
        kind: 'select',
        label: 'Тип проекта',
        placeholder: 'Любой проект',
        dict: 'project_types_videographer',
        options: [
            { value: '', label: 'Любой проект' },
            { value: 'video', label: 'Видеосъёмка' },
            { value: 'clip', label: 'Музыкальный клип' },
            { value: 'reportage', label: 'Репортаж' },
            { value: 'image', label: 'Имиджевый ролик' },
        ],
    },
    {
        key: 'services',
        kind: 'select',
        label: 'Услуги',
        placeholder: 'Любые услуги',
        options: [
            { value: '', label: 'Любые услуги' },
            { value: 'editing', label: 'Монтаж видео' },
            { value: 'color', label: 'Цветокоррекция' },
            { value: 'sound', label: 'Звукозапись' },
            { value: 'script', label: 'Разработка сценария' },
        ],
    },
    {
        key: 'equipment',
        kind: 'select',
        label: 'Оборудование',
        placeholder: 'Любое оборудование',
        options: [
            { value: '', label: 'Любое оборудование' },
            { value: 'own', label: 'Своё оборудование' },
            { value: 'drone', label: 'Съёмка с дрона' },
            { value: 'stabilizer', label: 'Стабилизатор' },
            { value: 'light', label: 'Свет и звук' },
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
export const EMPTY_VIDEOGRAPHER_FILTERS = FILTER_FIELDS.reduce((acc, field) => {
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
export const VIDEOGRAPHERS_FAQ = [
    {
        q: 'Определите тип съёмки',
        a: 'Клип, рекламный ролик, интервью или имиджевое видео — от этого зависят команда, оборудование и сроки. Выберите нужное в фильтре «Категория».',
    },
    {
        q: 'Обсудите детали',
        a: 'Напишите видеографу в чате платформы: хронометраж, локации, сроки монтажа и формат сдачи материала. Все договорённости остаются в переписке.',
    },
    {
        q: 'Изучите портфолио',
        a: 'В анкете есть портфолио по категориям, опыт участия в проектах и отзывы заказчиков — этого достаточно, чтобы оценить стиль съёмки и монтажа.',
    },
    {
        q: 'Что входит в стоимость съёмки?',
        a: 'Обычно это работа на площадке, монтаж и цветокоррекция готового ролика. Точные условия указаны в блоке «Стоимость» в анкете.',
    },
]
