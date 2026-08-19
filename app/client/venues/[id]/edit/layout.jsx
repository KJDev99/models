import { cabinetMetadata } from '@/lib/seo'

// Kabinet sahifasi — qidiruvda indekslanmaydi, faqat to'g'ri <title> beradi.
export const metadata = cabinetMetadata('Редактировать площадку')

export default function ClientEditVenueLayout({ children }) {
    return children
}
