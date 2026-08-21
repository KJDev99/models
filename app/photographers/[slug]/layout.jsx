import { executorMetadata } from '@/lib/seo'
import * as site from '@/lib/api/site'
import { performerDetail } from '@/lib/adapters'

// Metadata backenddagi anketadan yig'iladi (GET /site/performers/{id}).
// API javob bermasa — fallback matn ishlatiladi, sahifa baribir ochiladi.
export async function generateMetadata({ params }) {
    const { slug } = await params
    try {
        const data = performerDetail(await site.performer(slug))
        return executorMetadata(data, slug, 'фотографа')
    } catch {
        return executorMetadata(null, slug, 'фотографа')
    }
}

export default function PhotographerDetailLayout({ children }) {
    return children
}
