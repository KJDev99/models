// ─────────────────────────────────────────────────────────────────────────────
// Backend xatolarining yagona shakli (backend/auth.md):
//   { "success": false, "error": { "code", "message", "details" } }
//
// `error.message` rus tilida keladi va to'g'ridan-to'g'ri UI'da ko'rsatiladi.
// Shart tekshirish HTTP statusi bo'yicha emas, `code` bo'yicha qilinadi.
// ─────────────────────────────────────────────────────────────────────────────

export const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    CHALLENGE_EXPIRED: 'CHALLENGE_EXPIRED',
    ACCOUNT_BLOCKED: 'ACCOUNT_BLOCKED',
    OAUTH_FAILED: 'OAUTH_FAILED',
    OAUTH_NOT_CONFIGURED: 'OAUTH_NOT_CONFIGURED',
    NETWORK_ERROR: 'NETWORK_ERROR',
    UNKNOWN: 'UNKNOWN',
}

// Backend matn bermagan holatlar uchun zaxira matnlar (UI ruscha).
const FALLBACK = {
    [ERROR_CODES.VALIDATION_ERROR]: 'Проверьте правильность заполнения полей',
    [ERROR_CODES.UNAUTHORIZED]: 'Войдите в аккаунт, чтобы продолжить',
    [ERROR_CODES.FORBIDDEN]: 'Недостаточно прав для этого действия',
    [ERROR_CODES.NOT_FOUND]: 'Данные не найдены',
    [ERROR_CODES.USER_NOT_FOUND]: 'Профиль не найден',
    [ERROR_CODES.USER_ALREADY_EXISTS]: 'Профиль уже зарегистрирован',
    [ERROR_CODES.INVALID_CREDENTIALS]: 'Неверный пароль',
    [ERROR_CODES.CHALLENGE_EXPIRED]: 'Время сессии истекло, начните заново',
    [ERROR_CODES.ACCOUNT_BLOCKED]: 'Доступ к аккаунту ограничен',
    [ERROR_CODES.OAUTH_FAILED]: 'Не удалось войти через соцсеть',
    [ERROR_CODES.OAUTH_NOT_CONFIGURED]: 'Этот способ входа временно недоступен',
    [ERROR_CODES.NETWORK_ERROR]: 'Нет связи с сервером. Проверьте интернет',
    [ERROR_CODES.UNKNOWN]: 'Что-то пошло не так. Попробуйте позже',
}

// Axios xatosini bir xil `{ code, message, details, status, fields }` ga keltiradi.
// Interceptor uni `err.api` ga yozadi, shuning uchun bu yerda ikkalasi ham tekshiriladi.
export function toApiError(err) {
    if (!err) return { code: ERROR_CODES.UNKNOWN, message: FALLBACK.UNKNOWN, details: {}, status: 0 }
    if (err.code && err.message && !err.isAxiosError) return err
    if (err.api) return err.api

    const status = err?.response?.status || 0
    const body = err?.response?.data
    const raw = body?.error

    if (!err.response) {
        return {
            code: ERROR_CODES.NETWORK_ERROR,
            message: FALLBACK[ERROR_CODES.NETWORK_ERROR],
            details: {},
            status: 0,
            fields: {},
        }
    }

    const code = raw?.code || statusToCode(status)
    return {
        code,
        message: raw?.message || FALLBACK[code] || FALLBACK[ERROR_CODES.UNKNOWN],
        details: raw?.details || {},
        status,
        fields: fieldErrors(raw?.details),
    }
}

function statusToCode(status) {
    if (status === 401) return ERROR_CODES.UNAUTHORIZED
    if (status === 403) return ERROR_CODES.FORBIDDEN
    if (status === 404) return ERROR_CODES.NOT_FOUND
    if (status === 422) return ERROR_CODES.VALIDATION_ERROR
    return ERROR_CODES.UNKNOWN
}

// `details` ichida maydonlar bo'yicha xato kelsa — inputlar tagida ko'rsatamiz.
// Backend uch shaklda berishi mumkin:
//   1) { field: "matn" }
//   2) { field: ["matn"] }
//   3) FastAPI/Pydantic: { errors: [{ loc: ["body","email"], msg: "..." }] }
function fieldErrors(details) {
    if (!details || typeof details !== 'object') return {}
    const out = {}

    if (Array.isArray(details.errors)) {
        for (const e of details.errors) {
            const loc = Array.isArray(e?.loc) ? e.loc : []
            const field = loc[loc.length - 1]
            if (field && !out[field]) out[field] = e.msg || ''
        }
        return out
    }

    for (const [key, value] of Object.entries(details)) {
        if (typeof value === 'string') out[key] = value
        else if (Array.isArray(value) && typeof value[0] === 'string') out[key] = value[0]
    }
    return out
}

// Komponentlarda qisqa yozish uchun.
export function errorMessage(err) {
    return toApiError(err).message
}

export function isCode(err, code) {
    return toApiError(err).code === code
}
