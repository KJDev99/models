'use client'

import * as site from '@/lib/api/site'
import { agencyCard, meta, projectCard, venueCard } from '@/lib/adapters'

// ─────────────────────────────────────────────────────────────────────────────
// Площадки / Проекты / Агентства kataloglari uchun so'rov qurish va olish.
// Modul darajasida e'lon qilingan — funksiya identifikatori barqaror bo'lishi
// React hook bog'liqliklari uchun muhim (`performer-catalog.jsx` bilan bir xil).
//
// Backend parametrlari (Swagger «Site: Каталог», backend javobi 21.08.2026):
//   venues   — q · city · area_min · area_max · price_min · price_max
//              venue_type · capacity_max · project_type · sort
//   projects — q · city · age_min · age_max · height_min · gender · category
//              looking_for · performers_count · price_min · price_max
//              date_from · date_to · sort
//   agencies — q · city · sort
// ─────────────────────────────────────────────────────────────────────────────

const VENUE_SORT = new Set(['popular', 'new', 'views', 'price-asc', 'price-desc'])
const PROJECT_SORT = new Set([
    'popular',
    'new',
    'views',
    'date-asc',
    'date-desc',
    'price-asc',
    'price-desc',
])
const AGENCY_SORT = new Set(['popular', 'new', 'name-asc', 'performers-desc'])

const pick = (set) => (sort) => (set.has(sort) ? sort : undefined)

// ── Площадки ────────────────────────────────────────────────────────────────
export function venueParams({ search, sort, page, pageSize, filters }) {
    return {
        q: search || undefined,
        city: filters.city || undefined,
        area_min: filters.areaFrom || undefined,
        area_max: filters.areaTo || undefined,
        price_min: filters.priceFrom || undefined,
        price_max: filters.priceTo || undefined,
        venue_type: filters.venueType || undefined,
        capacity_max: filters.capacity || undefined,
        project_type: filters.projectType || undefined,
        sort: pick(VENUE_SORT)(sort),
        page,
        page_size: pageSize,
    }
}

export const fetchVenues = async (params) => {
    const data = await site.venues(params)
    return { items: (data.items || []).map(venueCard), meta: meta(data) }
}

// ── Проекты ─────────────────────────────────────────────────────────────────
// «Кого ищем» Figma'da ko'plikda, backendda birlikda (`model` / `photographer` /
// `videographer`). «Площадки» varianti backendda yo'q — u yuborilmaydi.
const LOOKING_FOR = {
    models: 'model',
    photographers: 'photographer',
    videographers: 'videographer',
}

export function projectParams({ search, sort, page, pageSize, filters }) {
    return {
        q: search || undefined,
        city: filters.city || undefined,
        age_min: filters.ageFrom || undefined,
        age_max: filters.ageTo || undefined,
        height_min: filters.heightFrom || undefined,
        gender: filters.gender || undefined,
        category: filters.category || undefined,
        looking_for: LOOKING_FOR[filters.lookingFor] || undefined,
        performers_count: filters.performers || undefined,
        price_min: filters.priceFrom || undefined,
        price_max: filters.priceTo || undefined,
        date_from: filters.dateFrom || undefined,
        date_to: filters.dateTo || undefined,
        sort: pick(PROJECT_SORT)(sort),
        page,
        page_size: pageSize,
    }
}

export const fetchProjects = async (params) => {
    const data = await site.projects(params)
    return { items: (data.items || []).map(projectCard), meta: meta(data) }
}

// ── Агентства ───────────────────────────────────────────────────────────────
export function agencyParams({ search, sort, page, pageSize, filters }) {
    return {
        q: search || undefined,
        city: filters?.city || undefined,
        sort: pick(AGENCY_SORT)(sort),
        page,
        page_size: pageSize,
    }
}

export const fetchAgencies = async (params) => {
    const data = await site.agencies(params)
    return { items: (data.items || []).map(agencyCard), meta: meta(data) }
}
