import { venueMetadata } from '@/lib/seo'
import { getData } from '@/lib/getData'

export async function generateMetadata({ params }) {
    const { slug } = await params
    try {
        const { data } = await getData(`/venues/${slug}/`)
        return venueMetadata(data, slug)
    } catch {
        return venueMetadata(null, slug)
    }
}

export default function VenueLayout({ children }) {
    return children
}
