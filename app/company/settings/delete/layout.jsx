import { cabinetMetadata } from '@/lib/seo'

// Kabinet sahifasi — qidiruvda indekslanmaydi, faqat to'g'ri <title> beradi.
export const metadata = cabinetMetadata('Удалить аккаунт')

export default function CompanyDeleteViewLayout({ children }) {
    return children
}
