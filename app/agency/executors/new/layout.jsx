import { cabinetMetadata } from '@/lib/seo'

// Kabinet sahifasi — qidiruvda indekslanmaydi, faqat to'g'ri <title> beradi.
export const metadata = cabinetMetadata('Добавить исполнителя')

export default function AgencyNewExecutorLayout({ children }) {
    return children
}
