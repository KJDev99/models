import { cabinetMetadata } from '@/lib/seo'

// Kabinet sahifasi — qidiruvda indekslanmaydi, faqat to'g'ri <title> beradi.
export const metadata = cabinetMetadata('Заявка на модерацию')

export default function AdminModerationDetailLayout({ children }) {
    return children
}
