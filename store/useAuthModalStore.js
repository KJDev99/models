import { create } from 'zustand'

// ─────────────────────────────────────────────────────────────────────────────
// Авторизация oynasi butun sayt bo'ylab bitta joyda turadi (root layout'da),
// istalgan «Войти» tugmasi shu store orqali uni ochadi.
//
// Figma: ВХОД 75:171 → Заказчик 75:844 → Введите пароль 85:1371 →
// Войти через 85:2756 → Регистрация 85:3512 → Знакомство 85:4559 →
// Аккаунт заблокирован 345:18476. Barchasi alohida sahifa emas — modal.
// ─────────────────────────────────────────────────────────────────────────────
export const useAuthModalStore = create((set) => ({
    open: false,
    // Qaysi qadamdan ochilsin: 'role' (kirish) yoki 'register' (ro'yxatdan o'tish).
    startStep: 'role',

    openAuth: (startStep = 'role') => set({ open: true, startStep }),
    closeAuth: () => set({ open: false }),
}))
