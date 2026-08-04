import { create } from 'zustand'
import { api, apiToken } from '@/lib/axios'

// Universal so'rov store'i — genius loyihasidagi bilan bir xil shakl.
// Sahifalar aynan shu metodlarni chaqiradi, endpointni o'zi beradi.
export const useApiStore = create((set) => ({
    data: null,
    loading: false,
    error: null,

    // ── Tokensiz ────────────────────────────────────────────────────────────
    getData: async (endpoint, params) => {
        set({ loading: true, error: null })
        try {
            const res = await api.get(endpoint, { params })
            set({ data: res.data })
            return { success: true, data: res.data }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    postData: async (endpoint, body) => {
        set({ loading: true, error: null })
        try {
            const res = await api.post(endpoint, body)
            set({ data: res.data })
            return { success: true, data: res.data }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    // ── Token bilan ─────────────────────────────────────────────────────────
    getDataToken: async (endpoint, params) => {
        set({ loading: true, error: null })
        try {
            const res = await apiToken.get(endpoint, { params })
            set({ data: res.data })
            return { success: true, data: res.data }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    postDataToken: async (endpoint, body) => {
        set({ loading: true, error: null })
        try {
            const res = await apiToken.post(endpoint, body)
            set({ data: res.data })
            return { success: true, data: res.data }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    patchDataToken: async (endpoint, body) => {
        set({ loading: true, error: null })
        try {
            const res = await apiToken.patch(endpoint, body)
            set({ data: res.data })
            return { success: true, data: res.data }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    putDataToken: async (endpoint, body) => {
        set({ loading: true, error: null })
        try {
            const res = await apiToken.put(endpoint, body)
            set({ data: res.data })
            return { success: true, data: res.data }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    deleteDataToken: async (endpoint) => {
        set({ loading: true, error: null })
        try {
            const res = await apiToken.delete(endpoint)
            return { success: true, data: res.data }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    // ── Fayl yuklash (portfolio, площадка фотографии) ───────────────────────
    postFormDataToken: async (endpoint, formData) => {
        set({ loading: true, error: null })
        try {
            const res = await apiToken.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            set({ data: res.data })
            return { success: true, data: res.data }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    patchFormDataToken: async (endpoint, formData) => {
        set({ loading: true, error: null })
        try {
            const res = await apiToken.patch(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            set({ data: res.data })
            return { success: true, data: res.data }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    reset: () => set({ data: null, loading: false, error: null }),
}))
