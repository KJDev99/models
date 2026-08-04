import { cabinetMetadata } from '@/lib/seo'

// Kabinet sahifasi — qidiruvda indekslanmaydi, faqat to'g'ri <title> beradi.
export const metadata = cabinetMetadata('Видимость профиля')

export default function ExecutorVisibilityViewLayout({ children }) {
    return children
}
