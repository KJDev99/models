import { executorMetadata } from '@/lib/seo'
import { getData } from '@/lib/getData'

// Metadata backend'dagi anketadan yig'iladi. API javob bermasa —
// fallback matn ishlatiladi, sahifa baribir ochiladi.
export async function generateMetadata({ params }) {
    const { slug } = await params
    try {
        const { data } = await getData(`/executors/${slug}/`)
        return executorMetadata(data, slug, 'видеографа')
    } catch {
        return executorMetadata(null, slug, 'видеографа')
    }
}

export default function VideographerDetailLayout({ children }) {
    return children
}
