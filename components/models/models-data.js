// ─────────────────────────────────────────────────────────────────────────────
// Модели katalogi uchun statik kontent.
//
// Figma: Модели — desktop setka 81:2586, desktop ro'yxat 96:4188,
// mobil 353:21270 / 360:22463, mobil filtrlar 360:22138 · 360:21739 · 360:23274.
//
// Backend ulanganda `MODELS` massivi `useCatalogStore.fetch()` javobi bilan
// almashtiriladi — maydon nomlari o'sha holicha qoladi.
// ─────────────────────────────────────────────────────────────────────────────

// Barcha kartochkalarda bitta rasm ishlatiladi (dizaynda ham shunday).
export const MODEL_IMAGE = '/img/models/model.jpg'

// Ro'yxat ko'rinishidagi gorizontal lentaga tushadigan suratlar.
export const MODEL_GALLERY = [MODEL_IMAGE, MODEL_IMAGE, MODEL_IMAGE, MODEL_IMAGE]

// Figma 81:2708 dagi qator: «Реклама +3» · «Каталог» · «Фото-съемки +1» · «Фитнес».
const TAG_SETS = [
    ['Реклама', 'Каталог', 'Коммерческая', 'Фото-съемки'],
    ['Каталог'],
    ['Фото-съемки', 'Коммерческая'],
    ['Фитнес'],
]

// Figma'da setkada bir sahifada 24 ta (6 qator × 4 ustun), ro'yxatda 6 ta.
export const GRID_PAGE_SIZE = 24
export const LIST_PAGE_SIZE = 6

// 72 ta anketa — sahifalash haqiqiy ishlashi uchun (setkada 3 sahifa).
export const MODELS = Array.from({ length: 72 }, (_, i) => ({
    id: i + 1,
    slug: `katerina-zhuravleva-${i + 1}`,
    name: 'Катерина Журавлева',
    age: 24,
    height: 170,
    weight: 55,
    city: 'Санкт-Петербург',
    image: MODEL_IMAGE,
    gallery: MODEL_GALLERY,
    tags: TAG_SETS[i % TAG_SETS.length],
}))

// ── Filtrlar (Figma 81:3003 — desktop panel, 360:22138 — mobil oyna) ─────────
// `kind`: 'range' — ikkita maydon (от / до), 'select' — ochiladigan ro'yxat.
export const FILTER_FIELDS = [
    {
        key: 'age',
        kind: 'range',
        label: 'Возраст',
        from: { key: 'ageFrom', prefix: 'от', placeholder: '18' },
        to: { key: 'ageTo', prefix: 'до', placeholder: '60' },
    },
    {
        key: 'height',
        kind: 'range',
        label: 'Рост',
        from: { key: 'heightFrom', prefix: 'от', placeholder: '150' },
        to: { key: 'heightTo', prefix: 'до', placeholder: '190' },
    },
    {
        key: 'weight',
        kind: 'range',
        label: 'Вес',
        from: { key: 'weightFrom', prefix: 'от', placeholder: '45' },
        to: { key: 'weightTo', prefix: 'до', placeholder: '80' },
    },
    {
        key: 'gender',
        kind: 'select',
        label: 'Пол',
        placeholder: 'Любой пол',
        options: [
            { value: '', label: 'Любой пол' },
            { value: 'female', label: 'Женский' },
            { value: 'male', label: 'Мужской' },
        ],
    },
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
        options: [
            { value: '', label: 'Без опыта' },
            { value: '1', label: 'До 1 года' },
            { value: '3', label: 'От 1 до 3 лет' },
            { value: '5', label: 'Более 3 лет' },
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
        key: 'projectType',
        kind: 'select',
        label: 'Тип проекта',
        placeholder: 'Любой проект',
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
            { value: 'yes', label: 'Готов(а) к выезду' },
            { value: 'no', label: 'Только свой город' },
        ],
    },
]

// Filtrlarning boshlang'ich holati — `FILTER_FIELDS` dan yig'iladi.
export const EMPTY_MODEL_FILTERS = FILTER_FIELDS.reduce((acc, field) => {
    if (field.kind === 'range') {
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
    { value: 'age-asc', label: 'Возраст: по возрастанию' },
    { value: 'age-desc', label: 'Возраст: по убыванию' },
]

// ── «Частые вопросы» (Figma 320:11866) ──────────────────────────────────────
export const MODELS_FAQ = [
    {
        q: 'Как выбрать модель для проекта?',
        a: 'Используйте фильтры по возрасту, росту, городу и категории съёмок, а затем откройте анкету — там есть портфолио, опыт и условия работы.',
    },
    {
        q: 'Как пригласить модель на проект?',
        a: 'Откройте анкету и нажмите «Пригласить в проект». Модель получит уведомление и ответит вам в чате платформы.',
    },
    {
        q: 'Нужен ли опыт работы для начинающей модели?',
        a: 'Нет. На платформе есть проекты и для начинающих — в фильтре «Опыт» выберите «Без опыта».',
    },
    {
        q: 'Работают ли модели в других городах?',
        a: 'Да. В фильтре «Выезд в другие города» выберите «Готов(а) к выезду» — останутся только те, кто готов приехать на съёмку.',
    },
]
