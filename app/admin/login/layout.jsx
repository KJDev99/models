// Kirish sahifasi `RoleGuard`dan tashqarida turishi kerak, shuning uchun
// `app/admin/layout.jsx` o'rniga o'z karkasi bilan ochiladi.
export const metadata = {
    title: 'Вход в панель управления',
    robots: { index: false, follow: false },
}

export default function AdminLoginLayout({ children }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-light-white p-[12px]">
            {children}
        </div>
    )
}
