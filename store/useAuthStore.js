import { create } from 'zustand'
import { api, apiToken } from '@/lib/axios'
import {
    clearSession,
    getUser,
    isAuthenticated,
    setSession,
    setUser as persistUser,
} from '@/lib/auth'

// ─────────────────────────────────────────────────────────────────────────────
// Auth oqimi (Figma: ВХОД 75:171 → Заказчик-Телефон/Почта → Введите пароль →
// Регистрация → Знакомство (rol tanlash) → Аккаунт заблокирован 345:18476).
//
// Endpoint nomlari backend bilan kelishilganda faqat shu faylda o'zgaradi.
// ─────────────────────────────────────────────────────────────────────────────

const ENDPOINTS = {
    login: '/auth/login/',
    loginPhone: '/auth/login/phone/',
    sendCode: '/auth/code/send/',
    verifyCode: '/auth/code/verify/',
    register: '/auth/register/',
    setRole: '/auth/role/',
    me: '/auth/me/',
    forgotPassword: '/auth/password/forgot/',
    resetPassword: '/auth/password/reset/',
    changePassword: '/auth/password/change/',
    changeEmail: '/auth/email/change/',
    changePhone: '/auth/phone/change/',
    deleteAccount: '/auth/account/delete/',
}

export const useAuthStore = create((set, get) => ({
    user: null,
    authed: false,
    loading: false,
    error: null,

    // Sahifa ochilganda localStorage'dan sessiyani ko'taradi.
    hydrate: () => {
        set({ user: getUser(), authed: isAuthenticated() })
    },

    // Serverdan joriy foydalanuvchini qayta o'qish (rol o'zgargan bo'lishi mumkin).
    fetchMe: async () => {
        if (!isAuthenticated()) return { success: false }
        set({ loading: true })
        try {
            const res = await apiToken.get(ENDPOINTS.me)
            persistUser(res.data)
            set({ user: res.data, authed: true })
            return { success: true, data: res.data }
        } catch (err) {
            return { success: false, error: err?.response?.data || err }
        } finally {
            set({ loading: false })
        }
    },

    // Login — telefon yoki pochta + parol.
    login: async ({ login, password }) => {
        set({ loading: true, error: null })
        try {
            const res = await api.post(ENDPOINTS.login, { login, password })
            const { access, refresh, user } = res.data
            setSession({ access, refresh, user })
            set({ user, authed: true })
            return { success: true, user }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error, blocked: err?.response?.status === 423 }
        } finally {
            set({ loading: false })
        }
    },

    // SMS/Email kod yuborish (Figma: Введите пароль / подтверждение).
    sendCode: async ({ login }) => {
        set({ loading: true, error: null })
        try {
            const res = await api.post(ENDPOINTS.sendCode, { login })
            return { success: true, data: res.data }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    verifyCode: async ({ login, code }) => {
        set({ loading: true, error: null })
        try {
            const res = await api.post(ENDPOINTS.verifyCode, { login, code })
            const { access, refresh, user } = res.data
            if (access) setSession({ access, refresh, user })
            set({ user: user || get().user, authed: Boolean(access) })
            return { success: true, data: res.data }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    register: async (payload) => {
        set({ loading: true, error: null })
        try {
            const res = await api.post(ENDPOINTS.register, payload)
            const { access, refresh, user } = res.data
            if (access) setSession({ access, refresh, user })
            set({ user: user || null, authed: Boolean(access) })
            return { success: true, data: res.data }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    // "Знакомство" ekrani — rolni tanlab yuborish.
    chooseRole: async (role, extra = {}) => {
        set({ loading: true, error: null })
        try {
            const res = await apiToken.post(ENDPOINTS.setRole, { role, ...extra })
            const user = res.data?.user || { ...get().user, role }
            persistUser(user)
            set({ user })
            return { success: true, user }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    forgotPassword: async ({ login }) => {
        set({ loading: true, error: null })
        try {
            const res = await api.post(ENDPOINTS.forgotPassword, { login })
            return { success: true, data: res.data }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    resetPassword: async (payload) => {
        set({ loading: true, error: null })
        try {
            const res = await api.post(ENDPOINTS.resetPassword, payload)
            return { success: true, data: res.data }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    changePassword: async (payload) => {
        set({ loading: true, error: null })
        try {
            const res = await apiToken.post(ENDPOINTS.changePassword, payload)
            return { success: true, data: res.data }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    changeEmail: async (payload) => {
        set({ loading: true, error: null })
        try {
            const res = await apiToken.post(ENDPOINTS.changeEmail, payload)
            return { success: true, data: res.data }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    changePhone: async (payload) => {
        set({ loading: true, error: null })
        try {
            const res = await apiToken.post(ENDPOINTS.changePhone, payload)
            return { success: true, data: res.data }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    deleteAccount: async (payload) => {
        set({ loading: true, error: null })
        try {
            await apiToken.post(ENDPOINTS.deleteAccount, payload)
            clearSession()
            set({ user: null, authed: false })
            return { success: true }
        } catch (err) {
            const error = err?.response?.data || err
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    logout: () => {
        clearSession()
        set({ user: null, authed: false, error: null })
    },
}))
