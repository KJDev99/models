'use client'

import * as site from '@/lib/api/site'
import { agencyCard, meta, projectCard, venueCard } from '@/lib/adapters'

// ─────────────────────────────────────────────────────────────────────────────
// Площадки / Проекты / Агентства kataloglari uchun so'rov qurish va olish.
// Modul darajasida e'lon qilingan — funksiya identifikatori barqaror bo'lishi
// React hook bog'liqliklari uchun muhim (`performer-catalog.jsx` bilan bir xil).
//
// Backend parametrlari (Swagger «Site: Каталог»):
//   venues   — q · city · area_min · area_max · price_min · price_max · sort
//   projects — q · city · age_min · age_max · height_min · gender · sort
//   agencies — q · city  (saralash va boshqa filtrlar yo'q)
// ─────────────────────────────────────────────────────────────────────────────

const SUPPORTED_SORT = new Set(['popular', 'new'])

function sortParam(sort) {
    return SUPPORTED_SORT.has(sort) ? sort : undefined
}

// ── Площадки ────────────────────────────────────────────────────────────────
export function venueParams({ search, sort, page, pageSize, filters }) {
    return {
        q: search || undefined,
        city: filters.city || undefined,
        area_min: filters.areaFrom || undefined,
        area_max: filters.areaTo || undefined,
        price_min: filters.priceFrom || undefined,
        price_max: filters.priceTo || undefined,
        sort: sortParam(sort),
        page,
        page_size: pageSize,
    }
}

export const fetchVenues = async (params) => {
    const data = await site.venues(params)
    return { items: (data.items || []).map(venueCard), meta: meta(data) }
}

// ── Проекты ─────────────────────────────────────────────────────────────────
export function projectParams({ search, sort, page, pageSize, filters }) {
    return {
        q: search || undefined,
        city: filters.city || undefined,
        age_min: filters.ageFrom || undefined,
        age_max: filters.ageTo || undefined,
        height_min: filters.heightFrom || undefined,
        gender: filters.gender || undefined,
        sort: sortParam(sort),
        page,
        page_size: pageSize,
    }
}

export const fetchProjects = async (params) => {
    const data = await site.projects(params)
    return { items: (data.items || []).map(projectCard), meta: meta(data) }
}

// ── Агентства ───────────────────────────────────────────────────────────────
export function agencyParams({ search, page, pageSize, filters }) {
    return {
        q: search || undefined,
        city: filters?.city || undefined,
        page,
        page_size: pageSize,
    }
}

export const fetchAgencies = async (params) => {
    const data = await site.agencies(params)
    return { items: (data.items || []).map(agencyCard), meta: meta(data) }
}
