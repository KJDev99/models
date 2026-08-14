import {
    Home,
    User,
    FileText,
    Building2,
    Megaphone,
    Building,
    MessageCircle,
    Shield,
    OctagonAlert,
} from 'lucide-react'

// Adminka chap menyusi — Figma 321:13354. Ikonkalar Figma nomlari bo'yicha
// lucide'ga o'girildi: home-01 · user-03 · file-06 · building-07 ·
// announcement-02 · building-04 · message-circle-01 · shield-03 · alert-octagon.
export const ADMIN_NAV = [
    { label: 'Дашборд', href: '/admin/dashboard', icon: Home },
    { label: 'Исполнители', href: '/admin/executors', icon: User },
    { label: 'Заказчики', href: '/admin/clients', icon: FileText },
    { label: 'Агентства', href: '/admin/agencies', icon: Building2 },
    { label: 'Проекты', href: '/admin/projects', icon: Megaphone },
    { label: 'Площадки', href: '/admin/venues', icon: Building },
    { label: 'Отзывы', href: '/admin/reviews', icon: MessageCircle },
    { label: 'Модерация', href: '/admin/moderation', icon: Shield },
    { label: 'Жалоба', href: '/admin/complaints', icon: OctagonAlert },
]

// Joriy manzilga mos menyu bandi (eng uzun mos keluvchi href).
export function activeNavItem(pathname) {
    return (
        [...ADMIN_NAV]
            .sort((a, b) => b.href.length - a.href.length)
            .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) || null
    )
}
