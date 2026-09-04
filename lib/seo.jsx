// ─────────────────────────────────────────────────────────────────────────────
// Markaziy SEO konfiguratsiyasi.
// Ochiq sahifalarning title / description / keywords matni shu yerda turadi.
// Kabinet va admin sahifalari indekslanmaydi — ular `cabinetMetadata()` orqali
// faqat to'g'ri <title> oladi.
//
// MUHIM: metadata faqat Server Component'da ishlaydi. Sahifalar 'use client'
// bo'lgani uchun har bir route yonida server `layout.jsx` turadi va metadata
// shu yerdan olinadi (genius-shop bilan bir xil uslub).
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
    name: 'База моделей',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://modelworkrf.ru',
    locale: 'ru_RU',
}

const DEFAULT_OG_IMAGE = '/img/og-default.png'

function buildMetadata({ title, description, keywords, path, image, noindex }) {
    const url = path ? `${SITE.url}${path}` : undefined
    return {
        title,
        description,
        keywords,
        alternates: url ? { canonical: url } : undefined,
        openGraph: {
            title,
            description,
            url,
            siteName: SITE.name,
            locale: SITE.locale,
            type: 'website',
            images: [{ url: image || DEFAULT_OG_IMAGE }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image || DEFAULT_OG_IMAGE],
        },
        robots: noindex
            ? { index: false, follow: false }
            : { index: true, follow: true },
    }
}

// ─── Ochiq sahifalar ─────────────────────────────────────────────────────────
export const PAGE_SEO = {
    home: {
        path: '/',
        title: 'База моделей — модели, фотографы, видеографы и площадки для съёмок',
        description:
            'Каталог моделей, фотографов, видеографов, съёмочных площадок и проектов. Найдите исполнителя или получите заказ — бесплатная регистрация.',
        keywords: 'база моделей, кастинг, модельное агентство, фотограф, видеограф, съёмочная площадка',
    },
    models: {
        path: '/models',
        title: 'Модели — каталог анкет с фото и параметрами | База моделей',
        description:
            'Анкеты моделей: рост, параметры, возраст, город и портфолио. Фильтры по типу внешности и опыту. Приглашайте в проект напрямую.',
        keywords: 'модели, анкеты моделей, кастинг моделей, поиск модели',
    },
    modelDetail: {
        path: '/models',
        title: 'Анкета модели | База моделей',
        description:
            'Портфолио, параметры, опыт участия в проектах и отзывы. Пригласите модель в проект или добавьте в избранное.',
        keywords: 'анкета модели, портфолио модели',
    },
    photographers: {
        path: '/photographers',
        title: 'Фотографы — каталог с портфолио и ценами | База моделей',
        description:
            'Найдите фотографа для съёмки: портфолио, жанры, город и стоимость смены. Прямая связь без посредников.',
        keywords: 'фотограф, найти фотографа, фотосъёмка, портфолио фотографа',
    },
    photographerDetail: {
        path: '/photographers',
        title: 'Профиль фотографа | База моделей',
        description: 'Портфолио, жанры съёмки, оборудование, отзывы и стоимость работы фотографа.',
        keywords: 'профиль фотографа, портфолио',
    },
    videographers: {
        path: '/videographers',
        title: 'Видеографы — каталог с портфолио и ценами | База моделей',
        description:
            'Видеографы и операторы для рекламных, fashion и event-съёмок. Портфолио, оборудование, стоимость.',
        keywords: 'видеограф, оператор, видеосъёмка, найти видеографа',
    },
    videographerDetail: {
        path: '/videographers',
        title: 'Профиль видеографа | База моделей',
        description: 'Шоурил, жанры, оборудование, отзывы и стоимость работы видеографа.',
        keywords: 'профиль видеографа, шоурил',
    },
    venues: {
        path: '/venues',
        title: 'Съёмочные площадки и студии — аренда | База моделей',
        description:
            'Фотостудии, лофты и локации для съёмок. Площадь, оборудование, цена за час и онлайн-бронирование.',
        keywords: 'съёмочная площадка, аренда фотостудии, лофт для съёмок',
    },
    venueDetail: {
        path: '/venues',
        title: 'Площадка для съёмок | База моделей',
        description: 'Фотографии, оборудование, площадь, цена и свободные даты. Забронируйте площадку онлайн.',
        keywords: 'аренда студии, бронирование площадки',
    },
    projects: {
        path: '/projects',
        title: 'Проекты и кастинги — актуальные съёмки | База моделей',
        description:
            'Открытые проекты и кастинги: описание, требования, гонорар и даты. Откликнитесь в один клик.',
        keywords: 'кастинг, проекты, съёмки, вакансии для моделей',
    },
    projectDetail: {
        path: '/projects',
        title: 'Проект | База моделей',
        description: 'Описание проекта, требования к исполнителям, гонорар, даты и площадка съёмки.',
        keywords: 'проект, кастинг, отклик',
    },
    agencies: {
        path: '/agencies',
        title: 'Модельные агентства — каталог | База моделей',
        description: 'Модельные агентства с проверенными исполнителями, портфолио и контактами.',
        keywords: 'модельное агентство, агентства моделей',
    },
    agencyDetail: {
        path: '/agencies',
        title: 'Модельное агентство | База моделей',
        description: 'Состав агентства, проекты, портфолио и отзывы.',
        keywords: 'агентство, состав агентства',
    },
    companyDetail: {
        path: '/companies',
        title: 'Профиль компании | База моделей',
        description: 'Профиль компании-заказчика: проекты, площадки, отзывы и контакты.',
        keywords: 'компания, заказчик',
    },
    personDetail: {
        path: '/persons',
        title: 'Профиль заказчика | База моделей',
        description: 'Профиль частного заказчика: проекты, отзывы и контакты.',
        keywords: 'заказчик, частное лицо',
    },
    terms: {
        path: '/terms',
        title: 'Пользовательское соглашение | База моделей',
        description: 'Правила использования платформы «База моделей».',
        keywords: 'пользовательское соглашение, правила',
    },
    privacy: {
        path: '/privacy',
        title: 'Политика конфиденциальности | База моделей',
        description: 'Как «База моделей» обрабатывает и хранит персональные данные.',
        keywords: 'политика конфиденциальности, персональные данные',
    },
    contacts: {
        path: '/contacts',
        title: 'Контакты | База моделей',
        description: 'Свяжитесь с командой «База моделей»: почта, телефон, соцсети и форма обратной связи.',
        keywords: 'контакты, обратная связь',
    },
    onboarding: {
        path: '/onboarding',
        title: 'Как это работает | База моделей',
        description: 'Три шага: заполните анкету, найдите проект или исполнителя, договоритесь напрямую.',
        keywords: 'как это работает, инструкция',
    },
    // ─── Indekslanmaydigan ochiq sahifalar ───────────────────────────────────
    favorites: {
        path: '/favorites',
        title: 'Избранное | База моделей',
        description: 'Сохранённые анкеты, площадки и проекты.',
        keywords: 'избранное',
        noindex: true,
    },
    notifications: {
        path: '/notifications',
        title: 'Уведомления | База моделей',
        description: 'Приглашения, отклики и системные уведомления.',
        keywords: 'уведомления',
        noindex: true,
    },
    chat: {
        path: '/chat',
        title: 'Сообщения | База моделей',
        description: 'Переписка с заказчиками и исполнителями.',
        keywords: 'сообщения, чат',
        noindex: true,
    },
    // ─── Auth ────────────────────────────────────────────────────────────────
    login: {
        path: '/auth/login',
        title: 'Вход | База моделей',
        description: 'Вход в личный кабинет по телефону или почте.',
        keywords: 'вход, авторизация',
        noindex: true,
    },
    register: {
        path: '/auth/register',
        title: 'Регистрация | База моделей',
        description: 'Регистрация заказчика, исполнителя или агентства.',
        keywords: 'регистрация',
        noindex: true,
    },
}

// Ochiq sahifa metadata'si: pageMetadata('models')
export function pageMetadata(key) {
    const seo = PAGE_SEO[key]
    if (!seo) return {}
    return buildMetadata(seo)
}

// Kabinet / admin sahifalari — har doim noindex, faqat title muhim.
export function cabinetMetadata(title, description) {
    return buildMetadata({
        title: `${title} | ${SITE.name}`,
        description: description || `${title} — личный кабинет «${SITE.name}».`,
        noindex: true,
    })
}

// ─── Dinamik sahifalar — backend obyektidan ──────────────────────────────────

export function executorMetadata(executor, slug, type = 'модели') {
    if (!executor) {
        return buildMetadata({
            path: `/models/${slug}`,
            title: `Анкета ${type} | ${SITE.name}`,
            description: 'Портфолио, параметры и опыт исполнителя.',
            keywords: 'анкета исполнителя',
        })
    }
    const name = executor.name || 'Анкета'
    const city = executor.city ? `, ${executor.city}` : ''
    return buildMetadata({
        path: `/models/${slug}`,
        title: `${name} — анкета ${type}${city} | ${SITE.name}`,
        description:
            executor.about?.trim()?.slice(0, 155) ||
            `${name}. Портфолио, параметры, опыт участия в проектах и отзывы.`,
        keywords: `${name}, анкета ${type}`,
        image: executor.avatar || executor.photos?.[0]?.url,
    })
}

export function venueMetadata(venue, slug) {
    if (!venue) {
        return buildMetadata({
            path: `/venues/${slug}`,
            title: `Площадка для съёмок | ${SITE.name}`,
            description: 'Фотографии, оборудование, площадь и стоимость аренды.',
            keywords: 'площадка, студия',
        })
    }
    const name = venue.name || 'Площадка'
    return buildMetadata({
        path: `/venues/${slug}`,
        title: `${name} — аренда площадки для съёмок | ${SITE.name}`,
        description:
            venue.description?.trim()?.slice(0, 155) ||
            `${name}. Площадь, оборудование, цена за час и свободные даты.`,
        keywords: `${name}, аренда студии`,
        image: venue.photos?.[0]?.url,
    })
}

export function projectMetadata(project, slug) {
    if (!project) {
        return buildMetadata({
            path: `/projects/${slug}`,
            title: `Проект | ${SITE.name}`,
            description: 'Требования, гонорар, даты и площадка съёмки.',
            keywords: 'проект, кастинг',
        })
    }
    const title = project.title || 'Проект'
    return buildMetadata({
        path: `/projects/${slug}`,
        title: `${title} — кастинг и требования | ${SITE.name}`,
        description:
            project.description?.trim()?.slice(0, 155) ||
            `${title}. Требования к исполнителям, гонорар и даты съёмки.`,
        keywords: `${title}, кастинг`,
        image: project.cover,
    })
}

export function agencyMetadata(agency, slug) {
    if (!agency) {
        return buildMetadata({
            path: `/agencies/${slug}`,
            title: `Модельное агентство | ${SITE.name}`,
            description: 'Состав агентства, проекты и отзывы.',
            keywords: 'агентство',
        })
    }
    const name = agency.name || 'Агентство'
    return buildMetadata({
        path: `/agencies/${slug}`,
        title: `${name} — модельное агентство | ${SITE.name}`,
        description:
            agency.about?.trim()?.slice(0, 155) ||
            `${name}. Состав агентства, проекты, портфолио и отзывы.`,
        keywords: `${name}, модельное агентство`,
        image: agency.logo,
    })
}
