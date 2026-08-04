// ─────────────────────────────────────────────────────────────────────────────
// Bosh sahifaning statik kontenti va rasm yo'llari.
// Barcha rasmlar `public/img/home/...` ichida — fayl nomlari shu yerda
// belgilangan, backend ulanganda bu massivlar API javobi bilan almashtiriladi.
//
// Figma: Главная 52:954 (desktop) va 352:20504 / 373:17004 (mobile 320).
// ─────────────────────────────────────────────────────────────────────────────

// ── Hero slayder: 4 ta slayd ────────────────────────────────────────────────
// Figma: 52:954 ichidagi «animate» (81:1781) + 52:1338 / 52:1400 / 52:1463,
// mobil — 353:20607.
//
// Figma'da slayd rasmi uch qatlamdan yig'ilgan (#2f2f2f fon → blur(5px)
// qilingan studiya foni + qora 20% → kesib olingan PNG). Dizayner shu
// kompozitsiyani tayyor holda eksport qilib bergan, shuning uchun kodda
// qayta blur/qoraytirish QILINMAYDI — aks holda ikki marta blur bo'ladi.
//
// `image`       — desktop, aynan 1920×1080 (Figma 502:16733 va shunga o'xshash)
// `imageMobile` — mobil,   aynan 320×824  (Figma 502:16803 va shunga o'xshash)
export const HERO_SLIDES = [
    {
        key: 'models',
        label: 'Модели',
        linkText: 'Перейти к моделям',
        href: '/models',
        image: '/img/home/hero/models-bg.png',
        imageMobile: '/img/home/hero/models-bg-mobile.png',
    },
    {
        key: 'photographers',
        label: 'Фотографы',
        linkText: 'Перейти к фотографам',
        href: '/photographers',
        image: '/img/home/hero/photographers-bg.png',
        imageMobile: '/img/home/hero/photographers-bg-mobile.png',
    },
    {
        key: 'videographers',
        label: 'Видеографы',
        linkText: 'Перейти к видеографам',
        href: '/videographers',
        image: '/img/home/hero/videographers-bg.png',
        imageMobile: '/img/home/hero/videographers-bg-mobile.png',
    },
    {
        key: 'venues',
        label: 'Площадки',
        linkText: 'Перейти к площадкам',
        href: '/venues',
        image: '/img/home/hero/venues-bg.png',
        imageMobile: '/img/home/hero/venues-bg-mobile.png',
    },
]

export const HERO_STATS = {
    specialists: { value: '10 000+', label: 'Проверенных специалистов' },
    projects: { value: '2 000+', label: 'Успешных\nпроектов' },
}

// ── Qidiruv paneli (52:1297) ────────────────────────────────────────────────
export const SEARCH_FIELDS = [
    {
        key: 'direction',
        label: 'Направление',
        placeholder: 'Модель, фотограф, площадка....',
        options: [
            { value: 'model', label: 'Модели' },
            { value: 'photographer', label: 'Фотографы' },
            { value: 'videographer', label: 'Видеографы' },
            { value: 'venue', label: 'Площадки' },
        ],
    },
    {
        key: 'category',
        label: 'Категория',
        placeholder: 'Все категории',
        options: [
            { value: '', label: 'Все категории' },
            { value: 'fashion', label: 'Fashion' },
            { value: 'commercial', label: 'Реклама' },
            { value: 'catalog', label: 'Каталог' },
            { value: 'video', label: 'Видео' },
        ],
    },
    {
        key: 'city',
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
        key: 'type',
        label: 'Тип проекта',
        placeholder: 'Любой проект',
        options: [
            { value: '', label: 'Любой проект' },
            { value: 'photo', label: 'Фотосъёмка' },
            { value: 'video', label: 'Видеосъёмка' },
            { value: 'show', label: 'Показ' },
        ],
    },
]

// ── «Выберите направление» (52:1021) ────────────────────────────────────────
export const DIRECTIONS = {
    models: { label: 'Модели', href: '/models', image: '/img/home/directions/models.jpg' },
    photographers: {
        label: 'Фотографы',
        href: '/photographers',
        image: '/img/home/directions/photographers.jpg',
    },
    videographers: {
        label: 'Видеографы',
        href: '/videographers',
        image: '/img/home/directions/videographers.jpg',
    },
    venues: { label: 'Площадки', href: '/venues', image: '/img/home/directions/venues.jpg' },
}

// ── «Актуальные проекты» (52:1048) ──────────────────────────────────────────
export const PROJECTS = [
    {
        id: 1,
        slug: 'fashion-brand-shoot-1',
        title: 'Съёмка для fashion-бренда',
        description: 'Требуется модель для новой коллекции одежды и рекламных материалов',
        need: 'Требуется 2 модели',
        price: 'от 20 000 ₽',
        date: '18 июля',
        city: 'Санкт-Петербург',
        image: '/img/home/projects/project-1.jpg',
    },
    {
        id: 2,
        slug: 'fashion-brand-shoot-2',
        title: 'Съёмка для fashion-бренда',
        description: 'Требуется модель для новой коллекции одежды и рекламных материалов',
        need: 'Требуется 2 модели',
        price: 'от 20 000 ₽',
        date: '18 июля',
        city: 'Санкт-Петербург',
        image: '/img/home/projects/project-1.jpg',
    },
    {
        id: 3,
        slug: 'fashion-brand-shoot-3',
        title: 'Съёмка для fashion-бренда',
        description: 'Требуется модель для новой коллекции одежды и рекламных материалов',
        need: 'Требуется 2 модели',
        price: 'от 20 000 ₽',
        date: '18 июля',
        city: 'Санкт-Петербург',
        image: '/img/home/projects/project-1.jpg',
    },
    {
        id: 4,
        slug: 'fashion-brand-shoot-4',
        title: 'Съёмка для fashion-бренда',
        description: 'Требуется модель для новой коллекции одежды и рекламных материалов',
        need: 'Требуется 2 модели',
        price: 'от 20 000 ₽',
        date: '18 июля',
        city: 'Санкт-Петербург',
        image: '/img/home/projects/project-1.jpg',
    },
]

// ── «Популярные исполнители» (52:1110) ──────────────────────────────────────
// `roleClass` — Figma'dagi rol chipining foni: model / photographer / videographer.
export const EXECUTORS = [
    {
        id: 1,
        slug: 'katerina-zhuravleva',
        name: 'Катерина Журавлева',
        role: 'Модель',
        roleClass: 'bg-[rgba(200,164,107,0.5)]',
        tags: ['24 лет', '170 см'],
        href: '/models/katerina-zhuravleva',
        image: '/img/home/executors/executor-1.jpg',
    },
    {
        id: 2,
        slug: 'aleksey-mironov',
        name: 'Алексей Миронов',
        role: 'Фотограф',
        roleClass: 'bg-[rgba(107,188,200,0.3)]',
        tags: ['5 лет опыта', '120 съёмок'],
        href: '/photographers/aleksey-mironov',
        image: '/img/home/executors/executor-2.jpg',
    },
    {
        id: 3,
        slug: 'ilya-voronov',
        name: 'Илья Воронов',
        role: 'Видеограф',
        roleClass: 'bg-[rgba(141,138,194,0.3)]',
        tags: ['4 года опыта', '45 кейсов'],
        href: '/videographers/ilya-voronov',
        image: '/img/home/executors/executor-3.jpg',
    },
    {
        id: 4,
        slug: 'sofia-lebedeva',
        name: 'София Лебедева',
        role: 'Модель',
        roleClass: 'bg-[rgba(200,164,107,0.5)]',
        tags: ['24 лет', '170 см'],
        href: '/models/sofia-lebedeva',
        image: '/img/home/executors/executor-4.jpg',
    },
]

// ── «Всё для съёмок в одном месте» (52:1166) ────────────────────────────────
export const PLATFORM_STATS = [
    { value: '10 000+', label: 'Анкет исполнителей на платформе', tone: 'white' },
    { value: '1 200+', label: 'Проектов для съёмок, рекламы и кино', tone: 'gold' },
]

// ── Umumiy rasmlar ──────────────────────────────────────────────────────────
export const IMAGES = {
    // Ikkala CTA bannerи (75:160 va 52:1180) — mobil uchun alohida kadr
    ctaCreateProject: '/img/home/cta/create-project.jpg',
    ctaCreateProjectMobile: '/img/home/cta/create-project-mobile.jpg',
    ctaReadyToStart: '/img/home/cta/ready-to-start.jpg',
    ctaReadyToStartMobile: '/img/home/cta/ready-to-start-mobile.jpg',
    // «Всё для съёмок» katta rasmi (52:1171)
    studio: '/img/home/studio.jpg',
    // Oq plitkalar ostidagi to'lqinsimon tekstura (Figma 52:1174 / 316:8015).
    // SVG'ning o'zida shaffoflik 10% qilib berilgan — kodda opacity qo'shilmaydi.
    texture: '/img/home/studio-white-bg.svg',
    logo: '/img/logo.svg',
    logoDark: '/img/logo-dark.svg',
}
