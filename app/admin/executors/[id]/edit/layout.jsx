import { cabinetMetadata } from '@/lib/seo'

// Kabinet sahifasi — qidiruvda indekslanmaydi, faqat to'g'ri <title> beradi.
export const metadata = cabinetMetadata('Редактировать анкету')

export default function AdminEditExecutorLayout({ children }) {
    return children
}
