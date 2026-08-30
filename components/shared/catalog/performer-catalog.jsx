'use client'

import * as site from '@/lib/api/site'
import { meta, performerCard } from '@/lib/adapters'

// ─────────────────────────────────────────────────────────────────────────────
// Модели / Фотографы / Видеографы — bitta backend endpointi (GET /site/performers),
// farqi faqat `specialty`. Filtrlarni so'rov parametrlariga o'girish ham bir xil.
//
// Backend qo'llab-quvvatlaydigan parametrlar (Swagger «Site: Каталог»,
// backend javobi 21.08.2026):
//   specialty · q · city · age_min · age_max · height_min · height_max
//   weight_min · weight_max · gender · experience_min · category
//   (`experience_max` hali yo'q — frontend-report, 4-band)
//   project_type · can_travel · price_min · price_max · sort · page · page_size
// ─────────────────────────────────────────────────────────────────────────────

// Backend qabul qiladigan `sort` qiymatlari. Noma'lumi `new` ga tushadi,
// shuning uchun ro'yxatda yo'q qiymat umuman yuborilmaydi.
const SUPPORTED_SORT = new Set([
    'popular',
    'new',
    'views',
    'age-asc',
    'age-desc',
    'experience-asc',
    'experience-desc',
    'price-asc',
    'price-desc',
    'rating',
    'name-asc',
])

// «Выезд в другие города» — Figma'da uchta holat, backendda mantiqiy qiymat.
function travelParam(value) {
    if (value === 'yes') return true
    if (value === 'no') return false
    return undefined
}

// «Опыт» — ro'yxatdagi qiymat `min-max` ko'rinishida ('-1', '1-3', '3-').
// Backendda hozircha faqat `experience_min` bor; `experience_max` qo'shilganda
// yuqori chegara ham o'z-o'zidan ishlay boshlaydi (frontend-report, 4-band).
function experienceRange(value) {
    if (!value) return [undefined, undefined]
    const [min, max] = String(value).split('-')
    return [min || undefined, max || undefined]
}

export function performerParams({ search, sort, page, pageSize, filters }) {
    const [experienceMin, experienceMax] = experienceRange(filters.experience)
    return {
        q: search || undefined,
        city: filters.city || undefined,
        age_min: filters.ageFrom || undefined,
        age_max: filters.ageTo || undefined,
        height_min: filters.heightFrom || undefined,
        height_max: filters.heightTo || undefined,
        weight_min: filters.weightFrom || undefined,
        weight_max: filters.weightTo || undefined,
        gender: filters.gender || undefined,
        experience_min: experienceMin,
        experience_max: experienceMax,
        category: filters.category || undefined,
        project_type: filters.projectType || undefined,
        can_travel: travelParam(filters.travel),
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
