// ─────────────────────────────────────────────────────────────────────────────
// Vaqtinchalik ko'rish rejimi.
//
// Backend ulanмaganda kabinet bo'limlarini token va rolsiz ochib ko'rish uchun
// ishlatilgan edi. Endi backend ulangan — guard'lar haqiqiy sessiyani tekshiradi.
//
// Faqat lokal tekshiruv uchun `.env.local` da `NEXT_PUBLIC_SKIP_GUARDS=1`
// qo'yish mumkin; ishlab chiqarishda bu o'zgaruvchi bo'lmasligi kerak.
// ─────────────────────────────────────────────────────────────────────────────
export const SKIP_GUARDS = process.env.NEXT_PUBLIC_SKIP_GUARDS === '1'
