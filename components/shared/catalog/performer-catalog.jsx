'use client'

import * as site from '@/lib/api/site'
import { meta, performerCard } from '@/lib/adapters'

// ─────────────────────────────────────────────────────────────────────────────
// Модели / Фотографы / Видеографы — bitta backend endpointi (GET /site/performers),
// farqi faqat `specialty`. Filtrlarni so'rov parametrlariga o'girish ham bir xil.
//
// Backend qo'llab-quvvatlaydigan parametrlar (Swagger «Site: Каталог»):
//   specialty · q · city · age_min · age_max · height_min · height_max
//   price_min · price_max · sort · page · page_size
//
// Figma'dagi «Вес», «Пол», «Опыт», «Категория», «Тип проекта», «Выезд»
// filtrlari backendda hali yo'q — ular yuborilmaydi (backend-report.md ga
// kiritilgan).
// ─────────────────────────────────────────────────────────────────────────────

// Backend faqat `popular` va `new` ni ajratadi, qolgani standart tartib.
const SUPPORTED_SORT = new Set(['popular', 'new'])

export function performerParams({ search, sort, page, pageSize, filters }) {
    return {
        q: search || undefined,
        city: filters.city || undefined,
        age_min: filters.ageFrom || undefined,
        age_max: filters.ageTo || undefined,
        height_min: filters.heightFrom || undefined,
        height_max: filters.heightTo || undefined,
        price_min: filters.priceFrom || undefined,
        price_max: filters.priceTo || undefined,
        sort: SUPPORTED_SORT.has(sort) ? sort : undefined,
        page,
        page_size: pageSize,
    }
}

export async function fetchPerformers(specialty, params) {
    const data = await site.performers({ specialty, ...params })
    return {
        items: (data.items || []).map(performerCard),
        meta: meta(data),
    }
}

// Modul darajasidagi barqaror funksiyalar — `useCallback` shart emas,
// identifikatori hech qachon o'zgarmaydi (React hook bog'liqliklari uchun muhim).
export const fetchModels = (params) => fetchPerformers('model', params)
export const fetchPhotographers = (params) => fetchPerformers('photographer', params)
export const fetchVideographers = (params) => fetchPerformers('videographer', params)
