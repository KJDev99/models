// ─────────────────────────────────────────────────────────────────────────────
// Vaqtinchalik ko'rish rejimi.
//
// Backend hali ulanmagani uchun kabinet bo'limlarini (jumladan /admin) token
// va rolsiz ochib ko'rish kerak. Bu kalit `true` bo'lsa `AuthGuard` va
// `RoleGuard` tekshiruvni o'tkazib yuboradi.
//
// Ishlab chiqarishga chiqarishdan oldin shuni `false` qiling — boshqa hech
// qayerga tegish shart emas.
// ─────────────────────────────────────────────────────────────────────────────
export const SKIP_GUARDS = true
