import { agencyMetadata } from '@/lib/seo'
import { getData } from '@/lib/getData'

export async function generateMetadata({ params }) {
    const { slug } = await params
    try {
        const { data } = await getData(`/agencies/${slug}/`)
        return agencyMetadata(data, slug)
    } catch {
        return agencyMetadata(null, slug)
    }
}

export default function AgencyLayout({ children }) {
    return children
}
