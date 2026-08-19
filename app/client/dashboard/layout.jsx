import { cabinetMetadata } from '@/lib/seo'

// Kabinet sahifasi — qidiruvda indekslanmaydi, faqat to'g'ri <title> beradi.
export const metadata = cabinetMetadata('Личный кабинет')

export default function ClientDashboardLayout({ children }) {
    return children
}
