import { venueMetadata } from '@/lib/seo'
import * as site from '@/lib/api/site'
import { venueDetail } from '@/lib/adapters'

// Metadata backenddagi e'londan yig'iladi (GET /site/venues/{id}).
export async function generateMetadata({ params }) {
    const { slug } = await params
    try {
        return venueMetadata(venueDetail(await site.venue(slug)), slug)
    } catch {
        return venueMetadata(null, slug)
    }
}

export default function VenueDetailLayout({ children }) {
    return children
}
