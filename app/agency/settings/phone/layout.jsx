import { cabinetMetadata } from '@/lib/seo'

// Kabinet sahifasi — qidiruvda indekslanmaydi, faqat to'g'ri <title> beradi.
export const metadata = cabinetMetadata('Изменить телефон')

export default function AgencyPhoneViewLayout({ children }) {
    return children
}
