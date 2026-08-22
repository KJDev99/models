// ─────────────────────────────────────────────────────────────────────────────
// Агентства katalogi uchun statik kontent.
//
// Figma: desktop 155:12722, mobil 375:14414.
// Bu bo'limda filtrlar yo'q — faqat qidiruv va saralash (155:12806).
//
// Backend ulanganda `AGENCIES` massivi `useCatalogStore.fetch()` javobi bilan
// almashtiriladi — maydon nomlari o'sha holicha qoladi.
// ─────────────────────────────────────────────────────────────────────────────

// Barcha kartochkalarda bitta logotip ishlatiladi (dizaynda ham shunday).
export const AGENCY_IMAGE = '/img/agencies/agency.png'

// Figma'da setkada bir sahifada 24 ta (6 qator × 4 ustun).
export const GRID_PAGE_SIZE = 24

const CITIES = ['Санкт-Петербург', 'Москва', 'Казань', 'Екатеринбург']

// 72 ta agentlik — sahifalash haqiqiy ishlashi uchun (3 sahifa).
export const AGENCIES = Array.from({ length: 72 }, (_, i) => ({
    id: i + 1,
    slug: `lumen-agency-${i + 1}`,
    name: 'LUMEN AGENCY',
    kind: 'Модельное и креативное агентство',
    city: CITIES[i % CITIES.length],
    executors: 68,
    image: AGENCY_IMAGE,
}))

// ── Saralash (Figma 155:12817) ──────────────────────────────────────────────
export const SORT_OPTIONS = [
    { value: 'popular', label: 'Сначала популярные' },
    { value: 'new', label: 'Сначала новые' },
    { value: 'name-asc', label: 'По названию: А–Я' },
    { value: 'performers-desc', label: 'Больше исполнителей' },
]

// ── «Частые вопросы» (Figma 320:12172) ──────────────────────────────────────
export const AGENCIES_FAQ = [
    {
        q: 'Что такое модельное агентство и чем оно отличается от фрилансеров?',
        a: 'Агентство представляет сразу несколько исполнителей и берёт на себя подбор, согласование условий и сопровождение съёмки. С фрилансером вы договариваетесь напрямую и все организационные вопросы решаете сами.',
    },
    {
        q: 'Как выбрать подходящее агентство?',
        a: 'Посмотрите состав агентства: сколько у него моделей, фотографов и видеографов, в каком городе оно работает и какие проекты уже вело. Открыть анкету любого исполнителя можно прямо со страницы агентства.',
    },
    {
        q: 'Какие преимущества работы с агентствами?',
        a: 'Агентство быстро подбирает нескольких кандидатов под задачу, заменяет исполнителя при форс-мажоре и отвечает за организацию съёмки — это экономит время на переписке и согласованиях.',
    },
    {
        q: 'Может ли агентство представлять исполнителей из других городов?',
        a: 'Да. У многих агентств есть исполнители, готовые к выезду. Уточните это в чате с агентством — контакты указаны на его странице.',
    },
]
