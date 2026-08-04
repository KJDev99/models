import { cabinetMetadata } from '@/lib/seo'

// Kabinet sahifasi — qidiruvda indekslanmaydi, faqat to'g'ri <title> beradi.
export const metadata = cabinetMetadata('Анкета исполнителя')

export default function AdminExecutorDetailLayout({ children }) {
    return children
}
