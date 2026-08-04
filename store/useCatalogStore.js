import { create } from 'zustand'
import { api } from '@/lib/axios'

// ─────────────────────────────────────────────────────────────────────────────
// Katalog (Модели / Фотографы / Видеографы / Площадки / Проекты / Агентства).
// Barcha katalog sahifalari bir xil store'dan foydalanadi — `resource` bilan
// ajratiladi, filtrlar esa har bir resurs uchun alohida saqlanadi.
//
// Figma: Фильтры 360:22138, Возраст 360:21739.
// ─────────────────────────────────────────────────────────────────────────────

export const RESOURCES = {
    models: '/executors/',
    photographers: '/executors/',
    videographers: '/executors/',
    venues: '/venues/',
    projects: '/projects/',
    agencies: '/agencies/',
}

// Katalog turiga qarab qo'shiladigan doimiy parametr.
const RESOURCE_PARAMS = {
    models: { type: 'model' },
    photographers: { type: 'photographer' },
    videographers: { type: 'videographer' },
}

export const EMPTY_FILTERS = {
    search: '',
    city: '',
    ageFrom: null,
    ageTo: null,
    heightFrom: null,
    heightTo: null,
    priceFrom: null,
    priceTo: null,
    gender: '',
    categories: [],
    sort: 'popular',
}

export const useCatalogStore = create((set, get) => ({
    resource: 'models',
    items: [],
    count: 0,
    page: 1,
    limit: 12,
    loading: false,
    error: null,
    filters: { ...EMPTY_FILTERS },

    setResource: (resource) =>
        set({ resource, items: [], page: 1, filters: { ...EMPTY_FILTERS } }),

    setFilters: (patch) => set({ filters: { ...get().filters, ...patch }, page: 1 }),

    resetFilters: () => set({ filters: { ...EMPTY_FILTERS }, page: 1 }),

    setPage: (page) => set({ page }),

    fetch: async () => {
        const { resource, filters, page, limit } = get()
        const endpoint = RESOURCES[resource]
        if (!endpoint) return

        set({ loading: true, error: null })
        try {
            const params = {
                ...RESOURCE_PARAMS[resource],
                page,
                limit,
                search: filters.search || undefined,
                city: filters.city || undefined,
                gender: filters.gender || undefined,
                ageFrom: filters.ageFrom ?? undefined,
                ageTo: filters.ageTo ?? undefined,
                heightFrom: filters.heightFrom ?? undefined,
                heightTo: filters.heightTo ?? undefined,
                priceFrom: filters.priceFrom ?? undefined,
                priceTo: filters.priceTo ?? undefined,
                category: filters.categories?.length ? filters.categories : undefined,
                sort: filters.sort || undefined,
            }
            const res = await api.get(endpoint, { params })
            const raw = res.data
            set({
                items: raw?.results || raw?.data || raw || [],
                count: raw?.count ?? (Array.isArray(raw) ? raw.length : 0),
            })
        } catch (err) {
            set({ error: 'Не удалось загрузить данные. Попробуйте позже.', items: [] })
        } finally {
            set({ loading: false })
        }
    },
}))
