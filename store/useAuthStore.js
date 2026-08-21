import { create } from 'zustand'
import * as authApi from '@/lib/api/auth'
import {
    clearSession,
    getRefreshToken,
    getUser,
    isAuthenticated,
    setSession,
    setUser as persistUser,
} from '@/lib/auth'
import { ERROR_CODES, toApiError } from '@/lib/api-error'
import { normalizeUser, toApiRole } from '@/lib/roles'

// ─────────────────────────────────────────────────────────────────────────────
// Avtorizatsiya oqimi — backend/auth.md.
//
//   role-select → identify → password        (intent = login)
//                          → знакомство      (intent = register)
//                          ↘ oauth
//
// `challengeToken` faqat store'da yashaydi (10 daqiqa), localStorage'ga
// yozilmaydi. Muvaffaqiyatli login/register'dan keyin `tokens` + `user`
// saqlanadi va `user.role` frontend roliga o'giriladi (lib/roles.js).
// ─────────────────────────────────────────────────────────────────────────────

const initialFlow = {
    role: null,
    intent: 'login',
    identifierType: 'phone',
    challengeToken: null,
    displayIdentifier: '',
    nextStep: null,
}

export const useAuthStore = create((set, get) => ({
    user: null,
    authed: false,
    loading: false,
    error: null,
    blocked: null,
    ...initialFlow,

    resetFlow: () => set({ ...initialFlow, error: null, blocked: null }),

    // Sahifa ochilganda localStorage'dan sessiyani ko'taradi.
    hydrate: () => {
        set({ user: getUser(), authed: isAuthenticated() })
    },

    // Serverdan joriy foydalanuvchini qayta o'qish (status o'zgargan bo'lishi mumkin).
    fetchMe: async () => {
        if (!isAuthenticated()) return { success: false }
        set({ loading: true })
        try {
            const raw = await authApi.me()
            const user = normalizeUser(raw)
            persistUser(user)
            set({ user, authed: true })
            return { success: true, user }
        } catch (err) {
            const error = toApiError(err)
            if (error.code === ERROR_CODES.ACCOUNT_BLOCKED) set({ blocked: error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    // ── 1-qadam: telefon/pochta bo'yicha profilni aniqlash ──────────────────
    identify: async ({ role, intent, identifierType, value }) => {
        set({ loading: true, error: null })
        try {
            const data = await authApi.identify({
                role: toApiRole(role),
                intent,
                identifierType,
                phone: identifierType === 'phone' ? value : undefined,
                email: identifierType === 'email' ? value : undefined,
            })
            set({
                role,
                intent,
                identifierType,
                challengeToken: data.challenge_token,
                displayIdentifier: data.display_identifier,
                nextStep: data.next_step,
            })
            return { success: true, data }
        } catch (err) {
            const error = toApiError(err)
            set({ error })
            if (error.code === ERROR_CODES.ACCOUNT_BLOCKED) set({ blocked: error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    // ── 2-qadam: parol bilan kirish ─────────────────────────────────────────
    login: async (password) => {
        set({ loading: true, error: null })
        try {
            const data = await authApi.login({
                challengeToken: get().challengeToken,
                password,
            })
            const user = normalizeUser(data.user)
            setSession({ tokens: data.tokens, user })
            set({ user, authed: true, ...initialFlow })
            return { success: true, user }
        } catch (err) {
            const error = toApiError(err)
            set({ error })
            if (error.code === ERROR_CODES.ACCOUNT_BLOCKED) set({ blocked: error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    // ── «Знакомство»: ro'yxatdan o'tish ─────────────────────────────────────
    // `kind`: customer | performer | agency, `payload` — backend maydonlari.
    register: async (kind, payload) => {
        set({ loading: true, error: null })
        try {
            const body = { challenge_token: get().challengeToken, ...payload }
            const fn =
                kind === 'performer'
                    ? authApi.registerPerformer
                    : kind === 'agency'
                      ? authApi.registerAgency
                      : authApi.registerCustomer
            const data = await fn(body)
            const user = normalizeUser(data.user)
            setSession({ tokens: data.tokens, user })
            set({ user, authed: true, ...initialFlow })
            return { success: true, user }
        } catch (err) {
            const error = toApiError(err)
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    // OAuth'dan keyin profil to'ldirilmagan bo'lsa shu chaqiriladi.
    completeProfile: async (kind, payload) => {
        set({ loading: true, error: null })
        try {
            const data = await authApi.completeProfile(kind, payload)
            const user = normalizeUser(data.user || data)
            persistUser(user)
            set({ user, authed: true })
            return { success: true, user }
        } catch (err) {
            const error = toApiError(err)
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    // Adminka alohida kiradi (pochta + parol).
    adminLogin: async ({ email, password }) => {
        set({ loading: true, error: null })
        try {
            const data = await authApi.adminLogin({ email, password })
            const user = normalizeUser(data.user)
            setSession({ tokens: data.tokens, user })
            set({ user, authed: true })
            return { success: true, user }
        } catch (err) {
            const error = toApiError(err)
            set({ error })
            return { success: false, error }
        } finally {
            set({ loading: false })
        }
    },

    setBlocked: (blocked) => set({ blocked }),

    logout: async () => {
        const refresh = getRefreshToken()
        // Server xato qaytarsa ham lokal sessiya baribir tozalanadi.
        if (refresh) {
            try {
                await authApi.logout(refresh)
            } catch {
                /* jim */
            }
        }
        clearSession()
        set({ user: null, authed: false, error: null, blocked: null, ...initialFlow })
    },
}))
