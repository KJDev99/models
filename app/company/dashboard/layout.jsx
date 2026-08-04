import { cabinetMetadata } from '@/lib/seo'

// Kabinet sahifasi — qidiruvda indekslanmaydi, faqat to'g'ri <title> beradi.
export const metadata = cabinetMetadata('Профиль компании')

export default function CompanyDashboardLayout({ children }) {
    return children
}
