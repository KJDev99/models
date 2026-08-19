import { cabinetMetadata } from '@/lib/seo'

// Kabinet sahifasi — qidiruvda indekslanmaydi, faqat to'g'ri <title> beradi.
export const metadata = cabinetMetadata('Заполнить профиль')

export default function ExecutorQuestionnaireLayout({ children }) {
    return children
}
